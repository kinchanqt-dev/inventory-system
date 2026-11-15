import {
  type IngredientCostInput,
  type RecipeLineInput,
  type SubRecipeCostInput,
} from "@/lib/food-cost";

import type { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export function collectRecipeLineIds(lines: RecipeLineInput[]) {
  const ingredientIds = new Set<string>();
  const subRecipeIds = new Set<string>();
  for (const line of lines) {
    if (line.ingredientId) {
      ingredientIds.add(line.ingredientId);
    }
    if (line.subRecipeId) {
      subRecipeIds.add(line.subRecipeId);
    }
  }
  return { ingredientIds, subRecipeIds };
}

export { loadRecipeLines } from "@/features/pos/lib/recipe-lines-query";

function mapSubRecipeRow(
  row: {
    id: string;
    batch_qty: number;
    batch_unit: string;
    sub_recipe_lines: Array<{
      ingredient_id: string;
      qty: number;
      unit: string;
    }> | null;
  },
  ingredientIds: Set<string>,
): [string, SubRecipeCostInput] {
  const subLines = Array.isArray(row.sub_recipe_lines)
    ? row.sub_recipe_lines
    : [];
  for (const subLine of subLines) {
    ingredientIds.add(subLine.ingredient_id);
  }
  return [
    row.id,
    {
      id: row.id,
      batchQty: Number(row.batch_qty),
      batchUnit: row.batch_unit,
      lines: subLines.map((subLine) => ({
        ingredientId: subLine.ingredient_id,
        qty: Number(subLine.qty),
        unit: subLine.unit,
      })),
    },
  ];
}

export async function loadSubRecipesById(
  supabase: SupabaseClient,
  orgId: string,
  subRecipeIds: Set<string>,
  ingredientIds: Set<string>,
) {
  if (subRecipeIds.size === 0) {
    return new Map<string, SubRecipeCostInput>();
  }

  const { data: subRecipes, error: subError } = await supabase
    .from("sub_recipes")
    .select(
      "id, batch_qty, batch_unit, sub_recipe_lines(ingredient_id, qty, unit)",
    )
    .eq("organization_id", orgId)
    .in("id", [...subRecipeIds]);

  if (subError) {
    throw new Error(subError.message);
  }

  return new Map(
    (subRecipes ?? []).map((row) => mapSubRecipeRow(row, ingredientIds)),
  );
}

export async function loadProductPortionsPerBatch(
  supabase: SupabaseClient,
  orgId: string,
  productId: string,
) {
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("portions_per_batch")
    .eq("id", productId)
    .eq("organization_id", orgId)
    .maybeSingle();

  if (productError) {
    throw new Error(productError.message);
  }

  return Number(product?.portions_per_batch ?? 1);
}

export async function loadIngredientsCostMap(
  supabase: SupabaseClient,
  orgId: string,
  ingredientIds: Set<string>,
) {
  const { data: ingredients, error: ingredientError } = await supabase
    .from("ingredients")
    .select("id, pack_price_cents, pack_size, pack_unit, yield_bps")
    .eq("organization_id", orgId)
    .in("id", [...ingredientIds]);

  if (ingredientError) {
    throw new Error(ingredientError.message);
  }

  return new Map<string, IngredientCostInput>(
    (ingredients ?? []).map((row) => [
      row.id,
      {
        id: row.id,
        packPriceCents: row.pack_price_cents,
        packSize: Number(row.pack_size),
        packUnit: row.pack_unit,
        yieldBps: row.yield_bps,
      },
    ]),
  );
}