import type { RecipeLineInput } from "@/lib/food-cost";

import type { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

function isMissingRecipeTableError(message: string) {
  return message.toLowerCase().includes("recipe_lines");
}

function mapRecipeLineRow(line: {
  ingredient_id: string | null;
  sub_recipe_id: string | null;
  qty: number;
  unit: string;
}): RecipeLineInput {
  return {
    ingredientId: line.ingredient_id,
    subRecipeId: line.sub_recipe_id,
    qty: Number(line.qty),
    unit: line.unit,
  };
}

function recipeLinesOrNull<T>(lines: T[] | null) {
  if (!lines || lines.length === 0) {
    return null;
  }
  return lines;
}

export async function loadRecipeLines(
  supabase: SupabaseClient,
  orgId: string,
  productId: string,
) {
  const { data: recipeLines, error: recipeError } = await supabase
    .from("recipe_lines")
    .select("ingredient_id, sub_recipe_id, qty, unit")
    .eq("organization_id", orgId)
    .eq("product_id", productId)
    .order("sort_order", { ascending: true });

  if (recipeError) {
    if (isMissingRecipeTableError(recipeError.message)) {
      return null;
    }
    throw new Error(recipeError.message);
  }

  const lines = recipeLinesOrNull(recipeLines);
  if (!lines) {
    return null;
  }

  return lines.map(mapRecipeLineRow);
}