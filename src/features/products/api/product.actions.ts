"use server";

import { revalidatePath } from "next/cache";

import { firstZodIssueMessage } from "@/lib/first-zod-issue";
import { requireRole } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

import {
  attachProductImage,
  insertProductWithStock,
} from "@/features/products/lib/create-product-core";
import { readProductFormData } from "@/features/products/lib/product-write-data";
import { runProductUpdate } from "@/features/products/lib/update-product-action";
import { validateOpeningStockForRecipe } from "@/features/products/lib/validate-opening-stock-for-recipe";
import { productSchema } from "@/features/products/schemas/product.schema";

import type { RecipeLineFormValues } from "@/features/products/types/recipe.types";

function revalidateCatalogPaths() {
  revalidatePath("/products");
  revalidatePath("/inventory");
  revalidatePath("/pos");
}

export async function createProductAction(formData: FormData) {
  const session = await requireRole(["OWNER"]);
  const orgId = session.organization.id;

  const parsed = productSchema.safeParse(
    readProductFormData(formData, { includeQuantity: true }),
  );

  if (!parsed.success) {
    return {
      error: firstZodIssueMessage(parsed.error.issues, "Invalid product"),
    };
  }

  const supabase = await createClient();
  const created = await insertProductWithStock(supabase, orgId, parsed.data);
  if ("error" in created) {
    return { error: created.error };
  }

  const imageResult = await attachProductImage(
    supabase,
    formData,
    orgId,
    created.productId,
  );
  if ("error" in imageResult) {
    return { error: imageResult.error };
  }

  revalidateCatalogPaths();
  return { success: true, productId: created.productId };
}

export async function validateOpeningStockForRecipeAction(
  quantity: number,
  lines: RecipeLineFormValues[],
) {
  await requireRole(["OWNER"]);
  return validateOpeningStockForRecipe(quantity, lines);
}

export async function updateProductAction(productId: string, formData: FormData) {
  const session = await requireRole(["OWNER"]);
  const orgId = session.organization.id;
  const supabase = await createClient();
  const saveResult = await runProductUpdate(
    productId,
    formData,
    orgId,
    supabase,
  );
  if ("error" in saveResult) {
    return { error: saveResult.error };
  }

  revalidateCatalogPaths();
  return { success: true };
}

export async function toggleProductActiveAction(productId: string) {
  const session = await requireRole(["OWNER"]);
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("is_active")
    .eq("id", productId)
    .eq("organization_id", session.organization.id)
    .maybeSingle();

  if (error || !product) {
    return;
  }

  await supabase
    .from("products")
    .update({ is_active: !product.is_active })
    .eq("id", productId)
    .eq("organization_id", session.organization.id);

  revalidatePath("/products");
  revalidatePath("/pos");
}