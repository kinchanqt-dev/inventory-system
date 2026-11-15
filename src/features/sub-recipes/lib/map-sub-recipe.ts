import {
  subRecipeBatchCostCents,
  subRecipeCostPerBatchUnitCents,
  type IngredientCostInput,
  type SubRecipeCostInput,
} from "@/lib/food-cost";

import type { UiSubRecipe, UiSubRecipeLine } from "@/features/sub-recipes/types/sub-recipe.types";

import type { Ingredient, SubRecipe, SubRecipeLine } from "@/types/database.types";

type SubRecipeIngredientRow = Pick<
  Ingredient,
  "id" | "name" | "pack_price_cents" | "pack_size" | "pack_unit" | "yield_bps"
>;

export type SubRecipeLineRow = SubRecipeLine & {
  ingredient: SubRecipeIngredientRow | SubRecipeIngredientRow[] | null;
};

function resolveIngredient(
  ingredient: SubRecipeIngredientRow | SubRecipeIngredientRow[] | null,
): SubRecipeIngredientRow | null {
  if (!ingredient) {
    return null;
  }
  if (Array.isArray(ingredient)) {
    return ingredient[0] ?? null;
  }
  return ingredient;
}

function toIngredientCostInput(
  ingredient: SubRecipeIngredientRow,
): IngredientCostInput {
  return {
    id: ingredient.id,
    packPriceCents: ingredient.pack_price_cents,
    packSize: Number(ingredient.pack_size),
    packUnit: ingredient.pack_unit,
    yieldBps: ingredient.yield_bps,
  };
}

function computeSubRecipeDisplayCosts(
  costInput: SubRecipeCostInput,
  ingredientsById: Map<string, IngredientCostInput>,
  lineCount: number,
) {
  if (lineCount === 0 || ingredientsById.size !== lineCount) {
    return { batchCostCents: 0, costPerUnitCents: 0 };
  }

  try {
    return {
      batchCostCents: subRecipeBatchCostCents(costInput, ingredientsById),
      costPerUnitCents: Math.round(
        subRecipeCostPerBatchUnitCents(costInput, ingredientsById),
      ),
    };
  } catch {
    // Bad legacy lines (e.g. pc vs kg) must not crash list/detail pages.
    return { batchCostCents: 0, costPerUnitCents: 0 };
  }
}

export function mapSubRecipe(
  row: SubRecipe,
  lineRows: SubRecipeLineRow[],
): UiSubRecipe {
  const sorted = [...lineRows].sort(
    (left, right) => left.sort_order - right.sort_order,
  );

  const ingredientsById = new Map<string, IngredientCostInput>();
  const lines: UiSubRecipeLine[] = sorted.map((line) => {
    const ingredient = resolveIngredient(line.ingredient);
    if (ingredient) {
      ingredientsById.set(line.ingredient_id, toIngredientCostInput(ingredient));
    }

    return {
      id: line.id,
      ingredientId: line.ingredient_id,
      ingredientName: ingredient?.name ?? "Unknown ingredient",
      qty: Number(line.qty),
      unit: line.unit,
      sortOrder: line.sort_order,
    };
  });

  const costInput: SubRecipeCostInput = {
    id: row.id,
    batchQty: Number(row.batch_qty),
    batchUnit: row.batch_unit,
    lines: lines.map((line) => ({
      ingredientId: line.ingredientId,
      qty: line.qty,
      unit: line.unit,
    })),
  };

  const { batchCostCents, costPerUnitCents } = computeSubRecipeDisplayCosts(
    costInput,
    ingredientsById,
    lines.length,
  );

  return {
    id: row.id,
    name: row.name,
    batchQty: Number(row.batch_qty),
    batchUnit: row.batch_unit,
    notes: row.notes,
    lines,
    batchCostCents,
    costPerUnitCents,
  };
}