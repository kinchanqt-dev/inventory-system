import { convertQuantity, type UnitDefinition } from "@/lib/food-cost/units";

import type {
  RecipeLineInput,
  SubRecipeCostInput,
} from "@/lib/food-cost/costing.types";

type AddIngredient = (
  ingredientId: string,
  qty: number,
  unit: string,
  scale: number,
) => void;

function batchFractionForLine(
  line: RecipeLineInput,
  subRecipe: SubRecipeCostInput,
  units: UnitDefinition[],
) {
  const qtyInBatchUnits = convertQuantity(
    line.qty,
    line.unit,
    subRecipe.batchUnit,
    units,
  );
  const batchQty = subRecipe.batchQty > 0 ? subRecipe.batchQty : 1;
  return qtyInBatchUnits / batchQty;
}

export function expandSubRecipeLine(
  line: RecipeLineInput,
  subRecipesById: Map<string, SubRecipeCostInput>,
  addIngredient: AddIngredient,
  units: UnitDefinition[],
  scale: number,
) {
  const subRecipeId = line.subRecipeId;
  if (!subRecipeId) {
    return;
  }
  const subRecipe = subRecipesById.get(subRecipeId);
  if (!subRecipe) {
    throw new Error(`Missing sub-recipe ${subRecipeId}`);
  }
  const batchFraction = batchFractionForLine(line, subRecipe, units);
  for (const subLine of subRecipe.lines) {
    addIngredient(
      subLine.ingredientId,
      subLine.qty * batchFraction,
      subLine.unit,
      scale,
    );
  }
}