export interface UiRecipeLine {
  id: string;
  ingredientId: string | null;
  subRecipeId: string | null;
  ingredientName: string | null;
  subRecipeName: string | null;
  qty: number;
  unit: string;
  sortOrder: number;
}

export interface ProductRecipeData {
  lines: UiRecipeLine[];
  portionsPerBatch: number;
  menuPriceCents: number;
  laborCents: number;
  packagingCents: number;
}

export type RecipeLineKind = "ingredient" | "sub_recipe";

export interface RecipeLineFormValues {
  lineKind: RecipeLineKind;
  ingredientId: string;
  subRecipeId: string;
  qty: number;
  unit: string;
}

export interface RecipeEditorIngredientOption {
  id: string;
  name: string;
  packUnit: string;
  stockQuantity: number;
  stockUnit: string;
}

export interface RecipeEditorSubRecipeOption {
  id: string;
  name: string;
  batchUnit: string;
}

/** Serializable inputs for {@link computeRecipeCost} on the client. */
export interface RecipeIngredientCostInput {
  id: string;
  packPriceCents: number;
  packSize: number;
  packUnit: string;
  yieldBps: number;
}

export interface RecipeSubRecipeCostInput {
  id: string;
  batchQty: number;
  batchUnit: string;
  lines: Array<{ ingredientId: string; qty: number; unit: string }>;
}