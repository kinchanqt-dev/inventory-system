import { requireSession } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

import {
  mapSubRecipe,
  type SubRecipeLineRow,
} from "@/features/sub-recipes/lib/map-sub-recipe";

import type { UiSubRecipe } from "@/features/sub-recipes/types/sub-recipe.types";

import type { SubRecipe } from "@/types/database.types";

const SUB_RECIPE_SELECT =
  "*, sub_recipe_lines (*, ingredient:ingredients(id, name, pack_price_cents, pack_size, pack_unit, yield_bps))";

type SubRecipeRow = SubRecipe & {
  sub_recipe_lines: SubRecipeLineRow[] | null;
};

function mapSubRecipeRow(row: SubRecipeRow): UiSubRecipe {
  return mapSubRecipe(row, row.sub_recipe_lines ?? []);
}

async function orgSubRecipesQuery() {
  const session = await requireSession();
  const supabase = await createClient();
  return {
    orgId: session.organization.id,
    query: supabase.from("sub_recipes").select(SUB_RECIPE_SELECT),
  };
}

export async function listSubRecipes(): Promise<UiSubRecipe[]> {
  const { orgId, query } = await orgSubRecipesQuery();
  const { data, error } = await query
    .eq("organization_id", orgId)
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as SubRecipeRow[]).map(mapSubRecipeRow);
}

export async function getSubRecipe(
  subRecipeId: string,
): Promise<UiSubRecipe | null> {
  const { orgId, query } = await orgSubRecipesQuery();
  const { data, error } = await query
    .eq("organization_id", orgId)
    .eq("id", subRecipeId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapSubRecipeRow(data as SubRecipeRow) : null;
}
