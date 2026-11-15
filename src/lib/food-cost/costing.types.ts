export interface IngredientCostInput {
  id: string;
  packPriceCents: number;
  packSize: number;
  packUnit: string;
  /** Yield in basis points (10000 = 100%). */
  yieldBps: number;
}

export interface SubRecipeLineInput {
  ingredientId: string;
  qty: number;
  unit: string;
}

export interface SubRecipeCostInput {
  id: string;
  batchQty: number;
  batchUnit: string;
  lines: SubRecipeLineInput[];
}

export interface RecipeLineInput {
  ingredientId?: string | null;
  subRecipeId?: string | null;
  qty: number;
  unit: string;
}

export interface RecipeCostInput {
  portionsPerBatch: number;
  menuPriceCents: number;
  laborCents?: number;
  packagingCents?: number;
  lines: RecipeLineInput[];
}

export interface FoodCostSettings {
  /** Target food cost in basis points (3300 = 33%). */
  targetFoodCostBps: number;
  salesTaxBps: number;
  pricesIncludeTax: boolean;
}

export type FoodCostStatus = "on_target" | "above_target";

export interface RecipeCostResult {
  batchFoodCostCents: number;
  foodCostPerPortionCents: number;
  laborCents: number;
  packagingCents: number;
  totalCostPerPortionCents: number;
  priceWithoutTaxCents: number;
  foodCostBps: number;
  suggestedMenuPriceCents: number;
  profitPerPortionCents: number;
  profitMarginBps: number;
  status: FoodCostStatus;
}
