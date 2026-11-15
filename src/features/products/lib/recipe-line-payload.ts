import { isFilledRecipeLine } from "@/lib/bom-line-list";

import type { RecipeLineInput } from "@/lib/food-cost";
import type { RecipeLineFormValues } from "@/features/products/types/recipe.types";

export function linesToCostInputs(
  lines: RecipeLineFormValues[],
): RecipeLineInput[] {
  return lines.filter(isFilledRecipeLine).map((line) => ({
    ingredientId: line.lineKind === "ingredient" ? line.ingredientId : null,
    subRecipeId: line.lineKind === "sub_recipe" ? line.subRecipeId : null,
    qty: Number(line.qty),
    unit: line.unit.trim(),
  }));
}

export function linesToSubmitPayload(lines: RecipeLineFormValues[]) {
  return lines.filter(isFilledRecipeLine).map((line) => {
    if (line.lineKind === "ingredient") {
      return {
        ingredientId: line.ingredientId,
        qty: Number(line.qty),
        unit: line.unit.trim(),
      };
    }

    return {
      subRecipeId: line.subRecipeId,
      qty: Number(line.qty),
      unit: line.unit.trim(),
    };
  });
}
