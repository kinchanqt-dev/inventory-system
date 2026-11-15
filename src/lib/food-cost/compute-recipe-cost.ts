import {
  DEFAULT_UNITS,
  type UnitDefinition,
} from "@/lib/food-cost/units";

import { recipeLineCostCents } from "@/lib/food-cost/recipe-line-cost";

import type {
  FoodCostSettings,
  FoodCostStatus,
  IngredientCostInput,
  RecipeCostInput,
  RecipeCostResult,
  SubRecipeCostInput,
} from "@/lib/food-cost/costing.types";

function priceWithoutTaxCents(
  menuPriceCents: number,
  settings: Pick<FoodCostSettings, "salesTaxBps" | "pricesIncludeTax">,
): number {
  if (!settings.pricesIncludeTax || settings.salesTaxBps <= 0) {
    return menuPriceCents;
  }
  return Math.round(
    (menuPriceCents * 10000) / (10000 + settings.salesTaxBps),
  );
}

function suggestedMenuPriceCents(
  foodCostPerPortionCents: number,
  settings: FoodCostSettings,
): number {
  if (settings.targetFoodCostBps <= 0) return foodCostPerPortionCents;
  const netSuggested = Math.round(
    (foodCostPerPortionCents * 10000) / settings.targetFoodCostBps,
  );
  if (!settings.pricesIncludeTax || settings.salesTaxBps <= 0) {
    return netSuggested;
  }
  return Math.round((netSuggested * (10000 + settings.salesTaxBps)) / 10000);
}

function foodCostStatus(
  foodCostBps: number,
  targetFoodCostBps: number,
): FoodCostStatus {
  if (foodCostBps > targetFoodCostBps) {
    return "above_target";
  }
  return "on_target";
}

function recipePortionCount(portionsPerBatch: number) {
  return portionsPerBatch > 0 ? portionsPerBatch : 1;
}

function bpsRatio(numerator: number, denominator: number) {
  if (denominator <= 0) {
    return 0;
  }
  return Math.round((numerator * 10000) / denominator);
}

export function computeRecipeCost(
  recipe: RecipeCostInput,
  ingredientsById: Map<string, IngredientCostInput>,
  subRecipesById: Map<string, SubRecipeCostInput>,
  settings: FoodCostSettings,
  units: UnitDefinition[] = DEFAULT_UNITS,
): RecipeCostResult {
  const batchFoodCostCents = recipe.lines.reduce(
    (sum, line) =>
      sum +
      recipeLineCostCents(line, ingredientsById, subRecipesById, units),
    0,
  );

  const portions = recipePortionCount(recipe.portionsPerBatch);
  const foodCostPerPortionCents = Math.round(batchFoodCostCents / portions);
  const laborCents = recipe.laborCents ?? 0;
  const packagingCents = recipe.packagingCents ?? 0;
  const totalCostPerPortionCents =
    foodCostPerPortionCents +
    Math.round(laborCents / portions) +
    packagingCents;

  const netPrice = priceWithoutTaxCents(recipe.menuPriceCents, settings);
  const foodCostBps = bpsRatio(foodCostPerPortionCents, netPrice);
  const suggested = suggestedMenuPriceCents(foodCostPerPortionCents, settings);
  const profitPerPortionCents = netPrice - totalCostPerPortionCents;
  const profitMarginBps = bpsRatio(profitPerPortionCents, netPrice);

  return {
    batchFoodCostCents,
    foodCostPerPortionCents,
    laborCents: Math.round(laborCents / portions),
    packagingCents,
    totalCostPerPortionCents,
    priceWithoutTaxCents: netPrice,
    foodCostBps,
    suggestedMenuPriceCents: suggested,
    profitPerPortionCents,
    profitMarginBps,
    status: foodCostStatus(foodCostBps, settings.targetFoodCostBps),
  };
}