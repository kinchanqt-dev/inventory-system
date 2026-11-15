import { parseLinesJsonFromFormData } from "@/lib/parse-lines-json-from-form";
import { firstZodIssueMessage } from "@/lib/first-zod-issue";

import { productRecipeSchema } from "@/features/products/schemas/recipe-line.schema";

import type { createClient } from "@/lib/supabase/server";
import type { ProductRecipeLineInput } from "@/features/products/schemas/recipe-line.schema";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export function parseProductRecipeFormData(formData: FormData) {
  const raw = parseLinesJsonFromFormData(
    formData,
    "Could not read recipe lines",
  );
  if ("parseError" in raw) {
    return { error: raw.parseError } as const;
  }

  const parsed = productRecipeSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: firstZodIssueMessage(parsed.error.issues, "Invalid product recipe"),
    } as const;
  }

  return { lines: parsed.data.lines } as const;
}

export async function replaceProductRecipeLines(
  supabase: SupabaseClient,
  orgId: string,
  productId: string,
  lines: ProductRecipeLineInput[],
) {
  const { error: deleteError } = await supabase
    .from("recipe_lines")
    .delete()
    .eq("product_id", productId)
    .eq("organization_id", orgId);

  if (deleteError) {
    return { error: "Could not update recipe lines." } as const;
  }

  if (lines.length === 0) {
    return { success: true as const };
  }

  const { error: insertError } = await supabase.from("recipe_lines").insert(
    lines.map((line, index) => ({
      organization_id: orgId,
      product_id: productId,
      ingredient_id: line.ingredientId ?? null,
      sub_recipe_id: line.subRecipeId ?? null,
      qty: line.qty,
      unit: line.unit,
      sort_order: index,
    })),
  );

  if (insertError) {
    return { error: "Could not save recipe lines." } as const;
  }

  return { success: true as const };
}

export async function fetchProductForRecipeCost(
  supabase: SupabaseClient,
  orgId: string,
  productId: string,
) {
  const { data: product, error: productError } = await supabase
    .from("products")
    .select(
      "id, price_cents, portions_per_batch, labor_cents, packaging_cents",
    )
    .eq("id", productId)
    .eq("organization_id", orgId)
    .maybeSingle();

  if (productError || !product) {
    return { error: "Could not update product recipe." } as const;
  }

  return { product } as const;
}

export async function persistProductFoodCostCents(
  supabase: SupabaseClient,
  orgId: string,
  productId: string,
  foodCostCents: number,
) {
  const { error: costError } = await supabase
    .from("products")
    .update({ cost_cents: foodCostCents })
    .eq("id", productId)
    .eq("organization_id", orgId);

  if (costError) {
    return {
      error: "Recipe saved but product cost could not be updated.",
    } as const;
  }

  return { success: true as const };
}