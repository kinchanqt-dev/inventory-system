import { validateCompatibleUnits } from "@/lib/food-cost/unit-validation";

import { loadIngredientPackUnitsById } from "@/features/ingredients/lib/load-ingredient-pack-units";

import type { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

interface SubRecipeLineUnitInput {
  ingredientId: string;
  unit: string;
}

function lineUnitError(
  index: number,
  line: SubRecipeLineUnitInput,
  packById: Map<string, string>,
) {
  const packUnit = packById.get(line.ingredientId);
  if (!packUnit) {
    return `Ingredient line ${index + 1}: ingredient not found.`;
  }
  const error = validateCompatibleUnits(line.unit, packUnit);
  return error ? `Ingredient line ${index + 1}: ${error}` : null;
}

export async function assertSubRecipeLineUnitsCompatible(
  supabase: SupabaseClient,
  orgId: string,
  lines: SubRecipeLineUnitInput[],
) {
  if (lines.length === 0) {
    return null;
  }

  const packById = await loadIngredientPackUnitsById(
    supabase,
    orgId,
    lines.map((line) => line.ingredientId),
  );

  for (const [index, line] of lines.entries()) {
    const error = lineUnitError(index, line, packById);
    if (error) {
      return error;
    }
  }

  return null;
}
