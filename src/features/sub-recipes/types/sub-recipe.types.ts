export interface UiSubRecipeLine {
  id: string;
  ingredientId: string;
  ingredientName: string;
  qty: number;
  unit: string;
  sortOrder: number;
}

export interface UiSubRecipe {
  id: string;
  name: string;
  batchQty: number;
  batchUnit: string;
  notes: string | null;
  lines: UiSubRecipeLine[];
  batchCostCents: number;
  costPerUnitCents: number;
}

export interface SubRecipeLineFormValues {
  ingredientId: string;
  qty: number;
  unit: string;
}

export interface SubRecipeFormValues {
  id?: string;
  name: string;
  batchQty: number;
  batchUnit: string;
  notes?: string | null;
  lines: SubRecipeLineFormValues[];
}

export interface SubRecipeIngredientOption {
  id: string;
  name: string;
  packUnit: string;
}