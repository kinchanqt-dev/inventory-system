import {
  convertQuantity,
  DEFAULT_UNITS,
  type UnitDefinition,
} from "@/lib/food-cost/units";
import { expandSubRecipeLine } from "@/lib/food-cost/sub-recipe-line-expansion";

import type {
  IngredientCostInput,
  RecipeLineInput,
  SubRecipeCostInput,
} from "@/lib/food-cost/costing.types";

type UsageEntry = { qtyInPackUnit: number; packUnit: string };

function scalePortions(portionsSold: number, portionsPerBatch: number) {
  const batchSize = portionsPerBatch > 0 ? portionsPerBatch : 1;
  return portionsSold / batchSize;
}

function mergeIngredientUsage(
  usage: Map<string, UsageEntry>,
  ingredientId: string,
  qtyInPackUnit: number,
  packUnit: string,
) {
  const existing = usage.get(ingredientId);
  if (existing) {
    existing.qtyInPackUnit += qtyInPackUnit;
    return;
  }
  usage.set(ingredientId, { qtyInPackUnit, packUnit });
}

function addIngredientUsage(
  usage: Map<string, UsageEntry>,
  ingredientsById: Map<string, IngredientCostInput>,
  units: UnitDefinition[],
  ingredientId: string,
  qty: number,
  unit: string,
  scale: number,
) {
  const ingredient = ingredientsById.get(ingredientId);
  if (!ingredient) {
    throw new Error(`Missing ingredient ${ingredientId}`);
  }
  const qtyInPackUnit =
    convertQuantity(qty, unit, ingredient.packUnit, units) * scale;
  mergeIngredientUsage(
    usage,
    ingredientId,
    qtyInPackUnit,
    ingredient.packUnit,
  );
}

export function expandRecipeToIngredientUsage(
  lines: RecipeLineInput[],
  portionsSold: number,
  portionsPerBatch: number,
  subRecipesById: Map<string, SubRecipeCostInput>,
  ingredientsById: Map<string, IngredientCostInput>,
  units: UnitDefinition[] = DEFAULT_UNITS,
): Array<{ ingredientId: string; qtyInPackUnit: number; packUnit: string }> {
  const scale = scalePortions(portionsSold, portionsPerBatch);
  const usage = new Map<string, UsageEntry>();

  for (const line of lines) {
    if (line.ingredientId) {
      addIngredientUsage(
        usage,
        ingredientsById,
        units,
        line.ingredientId,
        line.qty,
        line.unit,
        scale,
      );
      continue;
    }
    expandSubRecipeLine(
      line,
      subRecipesById,
      (ingredientId, qty, unit, lineScale) => {
        addIngredientUsage(
          usage,
          ingredientsById,
          units,
          ingredientId,
          qty,
          unit,
          lineScale,
        );
      },
      units,
      scale,
    );
  }

  return [...usage.entries()].map(([ingredientId, value]) => ({
    ingredientId,
    qtyInPackUnit: value.qtyInPackUnit,
    packUnit: value.packUnit,
  }));
}