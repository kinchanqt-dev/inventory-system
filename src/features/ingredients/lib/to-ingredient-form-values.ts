import type {
  IngredientFormValues,
  UiIngredient,
} from "@/features/ingredients/types/ingredient.types";

export function toIngredientFormValues(
  ingredient: UiIngredient,
): IngredientFormValues {
  return {
    id: ingredient.id,
    name: ingredient.name,
    categoryId: ingredient.categoryId,
    supplier: ingredient.supplier,
    packPriceCents: ingredient.packPriceCents,
    packSize: ingredient.packSize,
    packUnit: ingredient.packUnit,
    yieldPercent: ingredient.yieldPercent,
    minStock: ingredient.minStock,
    notes: ingredient.notes,
  };
}
