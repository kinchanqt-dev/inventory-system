import {
  convertQuantity,
  DEFAULT_UNITS,
  type UnitDefinition,
} from "@/lib/food-cost/units";

import {
  ingredientUsageCostCents,
  subRecipeCostPerBatchUnitCents,
} from "@/lib/food-cost/costing";

import type {
  IngredientCostInput,
  RecipeLineInput,
  SubRecipeCostInput,
} from "@/lib/food-cost/costing.types";

function ingredientLineCostCents(
  line: RecipeLineInput,
  ingredientsById: Map<string, IngredientCostInput>,
  units: UnitDefinition[],
): number {
  const ingredientId = line.ingredientId;
  if (!ingredientId) {
    throw new Error("Recipe line needs ingredientId");
  }
  const ingredient = ingredientsById.get(ingredientId);
  if (!ingredient) {
    throw new Error(`Missing ingredient ${ingredientId}`);
  }
  return ingredientUsageCostCents(ingredient, line.qty, line.unit, units);
}

function subRecipeLineCostCents(
  line: RecipeLineInput,
  ingredientsById: Map<string, IngredientCostInput>,
  subRecipesById: Map<string, SubRecipeCostInput>,
  units: UnitDefinition[],
): number {
  const subRecipeId = line.subRecipeId;
  if (!subRecipeId) {
    throw new Error("Recipe line needs subRecipeId");
  }
  const subRecipe = subRecipesById.get(subRecipeId);
  if (!subRecipe) {
    throw new Error(`Missing sub-recipe ${subRecipeId}`);
  }
  const perUnit = subRecipeCostPerBatchUnitCents(
    subRecipe,
    ingredientsById,
    units,
  );
  const qtyInBatchUnit = convertQuantity(
    line.qty,
    line.unit,
    subRecipe.batchUnit,
    units,
  );
  return Math.round(perUnit * qtyInBatchUnit);
}

export function recipeLineCostCents(
  line: RecipeLineInput,
  ingredientsById: Map<string, IngredientCostInput>,
  subRecipesById: Map<string, SubRecipeCostInput>,
  units: UnitDefinition[] = DEFAULT_UNITS,
): number {
  if (line.ingredientId) {
    return ingredientLineCostCents(line, ingredientsById, units);
  }
  if (line.subRecipeId) {
    return subRecipeLineCostCents(
      line,
      ingredientsById,
      subRecipesById,
      units,
    );
  }
  throw new Error("Recipe line needs ingredientId or subRecipeId");
}