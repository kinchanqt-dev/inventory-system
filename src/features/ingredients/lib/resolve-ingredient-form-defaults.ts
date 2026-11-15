import { centsToPesos } from "@/lib/money";

import type { IngredientFormValues } from "@/features/ingredients/types/ingredient.types";

export interface IngredientFormDefaults {
  name: string;
  supplier: string;
  packPrice: string;
  packSize: number;
  packUnit: string;
  yieldPercent: number;
  minStock: number;
  notes: string;
  showInitialStock: boolean;
}

export function resolveIngredientFormDefaults(
  ingredient?: IngredientFormValues,
): IngredientFormDefaults {
  if (!ingredient) {
    return {
      name: "",
      supplier: "",
      packPrice: "",
      packSize: 1,
      packUnit: "pc",
      yieldPercent: 100,
      minStock: 0,
      notes: "",
      showInitialStock: true,
    };
  }

  return {
    name: ingredient.name,
    supplier: ingredient.supplier ?? "",
    packPrice: String(centsToPesos(ingredient.packPriceCents)),
    packSize: ingredient.packSize,
    packUnit: ingredient.packUnit,
    yieldPercent: ingredient.yieldPercent,
    minStock: ingredient.minStock,
    notes: ingredient.notes ?? "",
    showInitialStock: !ingredient.id,
  };
}
