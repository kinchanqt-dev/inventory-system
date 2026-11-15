import { requireSession } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

import { listCategoryOptions } from "@/features/categories/api/category.queries";
import { mapIngredient } from "@/features/ingredients/lib/map-ingredient";

import type { IngredientCategoryOption, UiIngredient } from "@/features/ingredients/types/ingredient.types";

import type { Category, Ingredient, IngredientStock } from "@/types/database.types";

type IngredientRow = Ingredient & {
  category: Category | null;
  ingredient_stock: IngredientStock | IngredientStock[] | null;
};

function resolveIngredientStock(
  stock: IngredientStock | IngredientStock[] | null,
): IngredientStock | null {
  if (!stock) {
    return null;
  }
  if (Array.isArray(stock)) {
    return stock[0] ?? null;
  }
  return stock;
}

function mapIngredientRow(row: IngredientRow): UiIngredient {
  return mapIngredient(
    row,
    resolveIngredientStock(row.ingredient_stock),
    row.category,
  );
}

export async function listIngredients(): Promise<UiIngredient[]> {
  const session = await requireSession();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ingredients")
    .select("*, category:categories(*), ingredient_stock(*)")
    .eq("organization_id", session.organization.id)
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as IngredientRow[]).map(mapIngredientRow);
}

export async function getIngredient(ingredientId: string): Promise<UiIngredient | null> {
  const session = await requireSession();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ingredients")
    .select("*, category:categories(*), ingredient_stock(*)")
    .eq("organization_id", session.organization.id)
    .eq("id", ingredientId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return mapIngredientRow(data as IngredientRow);
}

export async function listIngredientCategories(): Promise<IngredientCategoryOption[]> {
  return listCategoryOptions("ingredient");
}