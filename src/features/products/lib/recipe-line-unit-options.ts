import { compatibleCatalogUnits } from "@/lib/food-cost/units";

import type {
  RecipeEditorIngredientOption,
  RecipeEditorSubRecipeOption,
  RecipeLineFormValues,
} from "@/features/products/types/recipe.types";

function ingredientLineUnit(
  line: RecipeLineFormValues,
  ingredients: RecipeEditorIngredientOption[],
) {
  const ingredient = ingredients.find((item) => item.id === line.ingredientId);
  return ingredient?.packUnit || line.unit || "pc";
}

function subRecipeLineUnit(
  line: RecipeLineFormValues,
  subRecipes: RecipeEditorSubRecipeOption[],
) {
  const subRecipe = subRecipes.find((item) => item.id === line.subRecipeId);
  return subRecipe?.batchUnit || line.unit || "portion";
}

export function recipeLineUnitOptions(
  line: RecipeLineFormValues,
  ingredients: RecipeEditorIngredientOption[],
  subRecipes: RecipeEditorSubRecipeOption[],
) {
  if (line.lineKind === "ingredient") {
    return compatibleCatalogUnits(ingredientLineUnit(line, ingredients));
  }

  return compatibleCatalogUnits(subRecipeLineUnit(line, subRecipes));
}
