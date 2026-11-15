import {
  convertQuantity,
  expandRecipeToIngredientUsage,
  type IngredientCostInput,
  type RecipeLineInput,
  type SubRecipeCostInput,
  type UnitDefinition,
  DEFAULT_UNITS,
} from "@/lib/food-cost";

export interface IngredientStockInput {
  id: string;
  stockQuantity: number;
  stockUnit: string;
}

function stockInPackUnit(
  stock: IngredientStockInput | undefined,
  packUnit: string,
  units: UnitDefinition[],
): number | null {
  if (!stock) {
    return 0;
  }
  try {
    return convertQuantity(
      stock.stockQuantity,
      stock.stockUnit,
      packUnit,
      units,
    );
  } catch {
    return null;
  }
}

function portionsForUsageRow(
  row: { ingredientId: string; qtyInPackUnit: number; packUnit: string },
  stockById: Map<string, IngredientStockInput>,
  units: UnitDefinition[],
): number {
  if (row.qtyInPackUnit <= 0) {
    return Number.POSITIVE_INFINITY;
  }
  const onHand = stockInPackUnit(stockById.get(row.ingredientId), row.packUnit, units);
  if (onHand == null) {
    return 0;
  }
  return Math.floor(onHand / row.qtyInPackUnit);
}

function expandOnePortionUsage(
  lines: RecipeLineInput[],
  portionsPerBatch: number,
  ingredientsById: Map<string, IngredientCostInput>,
  subRecipesById: Map<string, SubRecipeCostInput>,
  units: UnitDefinition[],
) {
  try {
    return expandRecipeToIngredientUsage(
      lines,
      1,
      portionsPerBatch,
      subRecipesById,
      ingredientsById,
      units,
    );
  } catch {
    return null;
  }
}

/**
 * Max finished portions current ingredient stock can support for this recipe.
 * Returns null when there are no usable recipe lines (uncapped).
 */
export function maxMakeablePortions(
  lines: RecipeLineInput[],
  portionsPerBatch: number,
  ingredientsById: Map<string, IngredientCostInput>,
  subRecipesById: Map<string, SubRecipeCostInput>,
  stockById: Map<string, IngredientStockInput>,
  units: UnitDefinition[] = DEFAULT_UNITS,
): number | null {
  if (lines.length === 0) {
    return null;
  }

  const usage = expandOnePortionUsage(
    lines,
    portionsPerBatch,
    ingredientsById,
    subRecipesById,
    units,
  );
  if (!usage) {
    return 0;
  }

  const needed = usage.filter((row) => row.qtyInPackUnit > 0);
  if (needed.length === 0) {
    return null;
  }

  return needed.reduce(
    (max, row) => Math.min(max, portionsForUsageRow(row, stockById, units)),
    Number.POSITIVE_INFINITY,
  );
}
