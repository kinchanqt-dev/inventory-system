import type { SubRecipeFormValues } from "@/features/sub-recipes/types/sub-recipe.types";

export interface SubRecipeFormDefaults {
  name: string;
  batchQty: number;
  batchUnit: string;
  notes: string;
}

export function resolveSubRecipeFormDefaults(
  subRecipe?: SubRecipeFormValues,
): SubRecipeFormDefaults {
  if (!subRecipe) {
    return {
      name: "",
      batchQty: 1,
      batchUnit: "portion",
      notes: "",
    };
  }

  return {
    name: subRecipe.name,
    batchQty: subRecipe.batchQty,
    batchUnit: subRecipe.batchUnit,
    notes: subRecipe.notes ?? "",
  };
}
