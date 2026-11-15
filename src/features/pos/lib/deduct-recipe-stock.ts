import { expandRecipeToIngredientUsage } from "@/lib/food-cost";

import { applyIngredientUsage } from "@/features/pos/lib/deduct-recipe-stock-apply";
import {
  collectRecipeLineIds,
  loadIngredientsCostMap,
  loadProductPortionsPerBatch,
  loadRecipeLines,
  loadSubRecipesById,
} from "@/features/pos/lib/deduct-recipe-stock-load";

import type { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

interface DeductRecipeStockInput {
  supabase: SupabaseClient;
  orgId: string;
  userId: string;
  saleId: string;
  saleNumber: string;
  productId: string;
  productName: string;
  quantitySold: number;
}

/**
 * If the product has recipe lines, deduct ingredient stock (BOM expand).
 * Returns whether a recipe was applied. Finished-goods stock is deducted separately.
 */
export async function deductRecipeIngredientStock(
  input: DeductRecipeStockInput,
): Promise<{ usedRecipe: boolean }> {
  const { supabase, orgId, productId, quantitySold } = input;

  const lines = await loadRecipeLines(supabase, orgId, productId);
  if (!lines) {
    return { usedRecipe: false };
  }

  const portionsPerBatch = await loadProductPortionsPerBatch(
    supabase,
    orgId,
    productId,
  );

  const { ingredientIds, subRecipeIds } = collectRecipeLineIds(lines);

  const subRecipesById = await loadSubRecipesById(
    supabase,
    orgId,
    subRecipeIds,
    ingredientIds,
  );

  const ingredientsById = await loadIngredientsCostMap(
    supabase,
    orgId,
    ingredientIds,
  );

  const usage = expandRecipeToIngredientUsage(
    lines,
    quantitySold,
    portionsPerBatch,
    subRecipesById,
    ingredientsById,
  );

  await applyIngredientUsage(input, usage);
  return { usedRecipe: true };
}