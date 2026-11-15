import type { FoodCostSettings } from "@/lib/food-cost";

import { listIngredients } from "@/features/ingredients";
import {
  getProductById,
  getProductRecipe,
  listMenuCategories,
} from "@/features/products";
import {
  toRecipeIngredientCostInputs,
  toRecipeSubRecipeCostInputs,
} from "@/features/products/lib/build-recipe-cost-maps";
import { listSubRecipes } from "@/features/sub-recipes";

import type { Organization } from "@/types/database.types";

export function foodCostSettingsFromOrg(
  organization: Organization,
): FoodCostSettings {
  return {
    targetFoodCostBps: organization.target_food_cost_bps ?? 3300,
    salesTaxBps: organization.sales_tax_bps ?? 0,
    pricesIncludeTax: organization.prices_include_tax ?? true,
  };
}

export async function loadEditProductPageData(productId: string) {
  const [product, categories, recipe, ingredients, subRecipes] =
    await Promise.all([
      getProductById(productId),
      listMenuCategories(),
      getProductRecipe(productId),
      listIngredients(),
      listSubRecipes(),
    ]);

  return { product, categories, recipe, ingredients, subRecipes };
}

export function toRecipeEditorOptions(
  ingredients: Awaited<ReturnType<typeof listIngredients>>,
  subRecipes: Awaited<ReturnType<typeof listSubRecipes>>,
) {
  return {
    ingredients: ingredients.map((item) => ({
      id: item.id,
      name: item.name,
      packUnit: item.packUnit,
      stockQuantity: item.stockQuantity,
      stockUnit: item.stockUnit,
    })),
    subRecipes: subRecipes.map((item) => ({
      id: item.id,
      name: item.name,
      batchUnit: item.batchUnit,
    })),
    ingredientCosts: toRecipeIngredientCostInputs(ingredients),
    subRecipeCosts: toRecipeSubRecipeCostInputs(subRecipes),
  };
}
