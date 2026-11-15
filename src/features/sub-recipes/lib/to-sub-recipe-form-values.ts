import type {
  SubRecipeFormValues,
  UiSubRecipe,
} from "@/features/sub-recipes/types/sub-recipe.types";

export function toSubRecipeFormValues(
  subRecipe: UiSubRecipe,
): SubRecipeFormValues {
  return {
    id: subRecipe.id,
    name: subRecipe.name,
    batchQty: subRecipe.batchQty,
    batchUnit: subRecipe.batchUnit,
    notes: subRecipe.notes,
    lines: subRecipe.lines.map((line) => ({
      ingredientId: line.ingredientId,
      qty: line.qty,
      unit: line.unit,
    })),
  };
}