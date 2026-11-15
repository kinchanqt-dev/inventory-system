import { listIngredients } from "@/features/ingredients";
import {
  buildIngredientCostMap,
  buildSubRecipeCostMap,
  toRecipeIngredientCostInputs,
  toRecipeSubRecipeCostInputs,
} from "@/features/products/lib/build-recipe-cost-maps";
import { maxMakeablePortions } from "@/features/products/lib/max-makeable-portions";
import { linesToCostInputs } from "@/features/products/lib/recipe-line-payload";
import { listSubRecipes } from "@/features/sub-recipes";

import type { RecipeLineFormValues } from "@/features/products/types/recipe.types";

export async function validateOpeningStockForRecipe(
  quantity: number,
  lines: RecipeLineFormValues[],
  portionsPerBatch = 1,
): Promise<{ error?: string }> {
  const recipeLines = linesToCostInputs(lines);
  if (recipeLines.length === 0) {
    return {};
  }

  const [ingredients, subRecipes] = await Promise.all([
    listIngredients(),
    listSubRecipes(),
  ]);

  const stockById = new Map(
    ingredients.map((item) => [
      item.id,
      {
        id: item.id,
        stockQuantity: item.stockQuantity,
        stockUnit: item.stockUnit,
      },
    ]),
  );

  const max = maxMakeablePortions(
    recipeLines,
    portionsPerBatch,
    buildIngredientCostMap(toRecipeIngredientCostInputs(ingredients)),
    buildSubRecipeCostMap(toRecipeSubRecipeCostInputs(subRecipes)),
    stockById,
  );

  if (max != null && quantity > max) {
    return {
      error: `Opening stock cannot exceed ${max} from current ingredient stock.`,
    };
  }

  return {};
}
