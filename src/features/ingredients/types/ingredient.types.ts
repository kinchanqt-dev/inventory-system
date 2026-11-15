export interface IngredientCategoryOption {
  id: string;
  name: string;
}

export interface UiIngredientCategory {
  id: string;
  name: string;
}

export interface UiIngredient {
  id: string;
  name: string;
  categoryId: string | null;
  category: UiIngredientCategory | null;
  supplier: string | null;
  packPriceCents: number;
  previousPackPriceCents: number | null;
  packSize: number;
  packUnit: string;
  yieldPercent: number;
  yieldBps: number;
  trueCostPerPackUnitCents: number;
  notes: string | null;
  stockQuantity: number;
  minStock: number;
  stockUnit: string;
}

export interface IngredientFormValues {
  id?: string;
  name: string;
  categoryId?: string | null;
  supplier?: string | null;
  packPriceCents: number;
  packSize: number;
  packUnit: string;
  yieldPercent: number;
  minStock: number;
  initialStock?: number;
  notes?: string | null;
}