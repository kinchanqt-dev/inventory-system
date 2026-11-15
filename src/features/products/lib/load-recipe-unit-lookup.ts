import { loadIngredientPackUnitsById } from "@/features/ingredients/lib/load-ingredient-pack-units";
import { validateRecipeLineUnits } from "@/features/products/lib/validate-recipe-line-units";

import type { createClient } from "@/lib/supabase/server";
import type { ProductRecipeLineInput } from "@/features/products/schemas/recipe-line.schema";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function loadSubRecipeBatchUnits(
  supabase: SupabaseClient,
  orgId: string,
  subRecipeIds: string[],
) {
  if (subRecipeIds.length === 0) {
    return new Map<string, string>();
  }

  const { data } = await supabase
    .from("sub_recipes")
    .select("id, batch_unit")
    .eq("organization_id", orgId)
    .in("id", subRecipeIds);

  return new Map((data ?? []).map((row) => [row.id, row.batch_unit]));
}

export async function assertRecipeLineUnitsCompatible(
  supabase: SupabaseClient,
  orgId: string,
  lines: ProductRecipeLineInput[],
) {
  const ingredientIds = lines
    .map((line) => line.ingredientId)
    .filter((id): id is string => Boolean(id));
  const subRecipeIds = lines
    .map((line) => line.subRecipeId)
    .filter((id): id is string => Boolean(id));

  const [packById, batchById] = await Promise.all([
    loadIngredientPackUnitsById(supabase, orgId, ingredientIds),
    loadSubRecipeBatchUnits(supabase, orgId, subRecipeIds),
  ]);

  return validateRecipeLineUnits(lines, {
    ingredientPackUnit: (id) => packById.get(id) ?? null,
    subRecipeBatchUnit: (id) => batchById.get(id) ?? null,
  });
}
