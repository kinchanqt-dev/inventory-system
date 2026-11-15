import type {
  IngredientCostInput,
  SubRecipeCostInput,
} from "@/lib/food-cost";

import type {
  RecipeIngredientCostInput,
  RecipeSubRecipeCostInput,
} from "@/features/products/types/recipe.types";

interface IngredientCostSource {
  id: string;
  packPriceCents: number;
  packSize: number;
  packUnit: string;
  yieldBps: number;
}

interface SubRecipeCostSource {
  id: string;
  batchQty: number;
  batchUnit: string;
  lines: Array<{ ingredientId: string; qty: number; unit: string }>;
}

export function toRecipeIngredientCostInputs(
  ingredients: IngredientCostSource[],
): RecipeIngredientCostInput[] {
  return ingredients.map((item) => ({
    id: item.id,
    packPriceCents: item.packPriceCents,
    packSize: item.packSize,
    packUnit: item.packUnit,
    yieldBps: item.yieldBps,
  }));
}

export function toRecipeSubRecipeCostInputs(
  subRecipes: SubRecipeCostSource[],
): RecipeSubRecipeCostInput[] {
  return subRecipes.map((item) => ({
    id: item.id,
    batchQty: item.batchQty,
    batchUnit: item.batchUnit,
    lines: item.lines.map((line) => ({
      ingredientId: line.ingredientId,
      qty: line.qty,
      unit: line.unit,
    })),
  }));
}

export function buildIngredientCostMap(
  ingredients: RecipeIngredientCostInput[],
): Map<string, IngredientCostInput> {
  return new Map(
    toRecipeIngredientCostInputs(ingredients).map((item) => [
      item.id,
      {
        id: item.id,
        packPriceCents: item.packPriceCents,
        packSize: item.packSize,
        packUnit: item.packUnit,
        yieldBps: item.yieldBps,
      },
    ]),
  );
}

export function buildSubRecipeCostMap(
  subRecipes: RecipeSubRecipeCostInput[],
): Map<string, SubRecipeCostInput> {
  return new Map(
    toRecipeSubRecipeCostInputs(subRecipes).map((item) => [
      item.id,
      {
        id: item.id,
        batchQty: item.batchQty,
        batchUnit: item.batchUnit,
        lines: item.lines,
      },
    ]),
  );
}