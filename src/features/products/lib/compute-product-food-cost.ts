import { computeRecipeCost, type RecipeLineInput } from "@/lib/food-cost";

import { listIngredients } from "@/features/ingredients/api/ingredient.queries";
import {
  buildIngredientCostMap,
  buildSubRecipeCostMap,
} from "@/features/products/lib/build-recipe-cost-maps";
import { listSubRecipes } from "@/features/sub-recipes/api/sub-recipe.queries";

import type { ProductRecipeLineInput } from "@/features/products/schemas/recipe-line.schema";

function toRecipeLineInputs(lines: ProductRecipeLineInput[]): RecipeLineInput[] {
  return lines.map((line) => ({
    ingredientId: line.ingredientId ?? null,
    subRecipeId: line.subRecipeId ?? null,
    qty: line.qty,
    unit: line.unit,
  }));
}

interface ProductFoodCostProduct {
  price_cents: number;
  portions_per_batch?: number;
  labor_cents?: number;
  packaging_cents?: number;
}

interface ProductFoodCostOrg {
  target_food_cost_bps?: number;
  sales_tax_bps?: number;
  prices_include_tax?: boolean;
}

function foodCostSettingsFromOrg(org: ProductFoodCostOrg) {
  return {
    targetFoodCostBps: org.target_food_cost_bps ?? 3300,
    salesTaxBps: org.sales_tax_bps ?? 0,
    pricesIncludeTax: org.prices_include_tax ?? true,
  };
}

async function computeProductFoodCostCentsValue(
  org: ProductFoodCostOrg,
  product: ProductFoodCostProduct,
  lines: ProductRecipeLineInput[],
): Promise<number> {
  const [ingredients, subRecipes] = await Promise.all([
    listIngredients(),
    listSubRecipes(),
  ]);

  const ingredientsById = buildIngredientCostMap(ingredients);
  const subRecipesById = buildSubRecipeCostMap(subRecipes);

  const result = computeRecipeCost(
    {
      portionsPerBatch: Number(product.portions_per_batch ?? 1),
      menuPriceCents: product.price_cents,
      laborCents: product.labor_cents ?? 0,
      packagingCents: product.packaging_cents ?? 0,
      lines: toRecipeLineInputs(lines),
    },
    ingredientsById,
    subRecipesById,
    foodCostSettingsFromOrg(org),
  );

  return result.foodCostPerPortionCents;
}

export async function computeProductFoodCostCents(
  org: ProductFoodCostOrg,
  product: ProductFoodCostProduct,
  lines: ProductRecipeLineInput[],
): Promise<number | null> {
  if (lines.length === 0) {
    return null;
  }

  return computeProductFoodCostCentsValue(org, product, lines).catch(() => null);
}