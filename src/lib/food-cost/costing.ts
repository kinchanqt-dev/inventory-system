import {
  convertQuantity,
  DEFAULT_UNITS,
  type UnitDefinition,
} from "@/lib/food-cost/units";

import type {
  IngredientCostInput,
  SubRecipeCostInput,
} from "@/lib/food-cost/costing.types";

/** True cost per pack unit after yield loss (cents per pack_unit). */
export function trueCostPerPackUnitCents(ingredient: IngredientCostInput): number {
  if (ingredient.packSize <= 0) return 0;
  const yieldFactor = ingredient.yieldBps / 10000;
  if (yieldFactor <= 0) return 0;
  return ingredient.packPriceCents / (ingredient.packSize * yieldFactor);
}

/** Cost in cents for a quantity of an ingredient. */
export function ingredientUsageCostCents(
  ingredient: IngredientCostInput,
  qty: number,
  unit: string,
  units: UnitDefinition[] = DEFAULT_UNITS,
): number {
  const qtyInPackUnit = convertQuantity(
    qty,
    unit,
    ingredient.packUnit,
    units,
  );
  return Math.round(trueCostPerPackUnitCents(ingredient) * qtyInPackUnit);
}

export function subRecipeBatchCostCents(
  subRecipe: SubRecipeCostInput,
  ingredientsById: Map<string, IngredientCostInput>,
  units: UnitDefinition[] = DEFAULT_UNITS,
): number {
  let total = 0;
  for (const line of subRecipe.lines) {
    const ingredient = ingredientsById.get(line.ingredientId);
    if (!ingredient) {
      throw new Error(`Missing ingredient ${line.ingredientId}`);
    }
    total += ingredientUsageCostCents(
      ingredient,
      line.qty,
      line.unit,
      units,
    );
  }
  return total;
}

export function subRecipeCostPerBatchUnitCents(
  subRecipe: SubRecipeCostInput,
  ingredientsById: Map<string, IngredientCostInput>,
  units: UnitDefinition[] = DEFAULT_UNITS,
): number {
  if (subRecipe.batchQty <= 0) return 0;
  return (
    subRecipeBatchCostCents(subRecipe, ingredientsById, units) /
    subRecipe.batchQty
  );
}
