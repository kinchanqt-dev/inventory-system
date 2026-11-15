import { validateCompatibleUnits } from "@/lib/food-cost/unit-validation";

import type { ProductRecipeLineInput } from "@/features/products/schemas/recipe-line.schema";

interface RecipeUnitLookup {
  ingredientPackUnit: (ingredientId: string) => string | null;
  subRecipeBatchUnit: (subRecipeId: string) => string | null;
}

function validateIngredientLineUnit(
  index: number,
  line: ProductRecipeLineInput,
  lookup: RecipeUnitLookup,
) {
  if (!line.ingredientId) {
    return null;
  }
  const packUnit = lookup.ingredientPackUnit(line.ingredientId);
  if (!packUnit) {
    return `Recipe line ${index + 1}: ingredient not found.`;
  }
  const error = validateCompatibleUnits(line.unit, packUnit);
  if (!error) {
    return null;
  }
  return `Recipe line ${index + 1}: ${error}`;
}

function validateSubRecipeLineUnit(
  index: number,
  line: ProductRecipeLineInput,
  lookup: RecipeUnitLookup,
) {
  if (!line.subRecipeId) {
    return null;
  }
  const batchUnit = lookup.subRecipeBatchUnit(line.subRecipeId);
  if (!batchUnit) {
    return `Recipe line ${index + 1}: sub-recipe not found.`;
  }
  const error = validateCompatibleUnits(line.unit, batchUnit);
  if (!error) {
    return null;
  }
  return `Recipe line ${index + 1}: ${error}`;
}

export function validateRecipeLineUnits(
  lines: ProductRecipeLineInput[],
  lookup: RecipeUnitLookup,
): string | null {
  for (const [index, line] of lines.entries()) {
    const ingredientError = validateIngredientLineUnit(index, line, lookup);
    if (ingredientError) {
      return ingredientError;
    }
    const subRecipeError = validateSubRecipeLineUnit(index, line, lookup);
    if (subRecipeError) {
      return subRecipeError;
    }
  }

  return null;
}
