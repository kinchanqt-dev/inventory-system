import type {
  RecipeLineFormValues,
  UiRecipeLine,
} from "@/features/products/types/recipe.types";

function createEmptyRecipeLine(): RecipeLineFormValues {
  return {
    lineKind: "ingredient",
    ingredientId: "",
    subRecipeId: "",
    qty: 0,
    unit: "pc",
  };
}

export function toRecipeLineFormValues(
  lines: UiRecipeLine[],
): RecipeLineFormValues[] {
  if (lines.length === 0) {
    return [createEmptyRecipeLine()];
  }

  return lines.map((line) => {
    if (line.subRecipeId) {
      return {
        lineKind: "sub_recipe" as const,
        ingredientId: "",
        subRecipeId: line.subRecipeId,
        qty: line.qty,
        unit: line.unit,
      };
    }

    return {
      lineKind: "ingredient" as const,
      ingredientId: line.ingredientId ?? "",
      subRecipeId: "",
      qty: line.qty,
      unit: line.unit,
    };
  });
}

export { createEmptyRecipeLine };