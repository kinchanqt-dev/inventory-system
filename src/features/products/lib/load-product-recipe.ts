import type { createClient } from "@/lib/supabase/server";

import type {
  ProductRecipeData,
  UiRecipeLine,
} from "@/features/products/types/recipe.types";

import type { Ingredient, Product, RecipeLine, SubRecipe } from "@/types/database.types";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

type RecipeLineRow = RecipeLine & {
  ingredient: Pick<Ingredient, "id" | "name"> | null;
  sub_recipe: Pick<SubRecipe, "id" | "name"> | null;
};

type ProductRecipeMeta = Pick<
  Product,
  | "id"
  | "price_cents"
  | "portions_per_batch"
  | "labor_cents"
  | "packaging_cents"
>;

function mapRecipeLine(row: RecipeLineRow): UiRecipeLine {
  const ingredientName = row.ingredient ? row.ingredient.name : null;
  const subRecipeName = row.sub_recipe ? row.sub_recipe.name : null;
  return {
    id: row.id,
    ingredientId: row.ingredient_id,
    subRecipeId: row.sub_recipe_id,
    ingredientName,
    subRecipeName,
    qty: Number(row.qty),
    unit: row.unit,
    sortOrder: row.sort_order,
  };
}

export async function loadProductRecipeMeta(
  supabase: SupabaseClient,
  orgId: string,
  productId: string,
): Promise<ProductRecipeMeta | null> {
  const { data: product, error: productError } = await supabase
    .from("products")
    .select(
      "id, price_cents, portions_per_batch, labor_cents, packaging_cents",
    )
    .eq("organization_id", orgId)
    .eq("id", productId)
    .maybeSingle();

  if (productError) {
    throw new Error(productError.message);
  }

  return product;
}

export async function loadProductRecipeLines(
  supabase: SupabaseClient,
  orgId: string,
  productId: string,
) {
  const { data: lineRows, error: linesError } = await supabase
    .from("recipe_lines")
    .select(
      "*, ingredient:ingredients(id, name), sub_recipe:sub_recipes(id, name)",
    )
    .eq("organization_id", orgId)
    .eq("product_id", productId)
    .order("sort_order");

  if (linesError) {
    throw new Error(linesError.message);
  }

  return (lineRows ?? []) as RecipeLineRow[];
}

export function toProductRecipeData(
  product: ProductRecipeMeta,
  lineRows: RecipeLineRow[],
): ProductRecipeData {
  return {
    lines: lineRows.map(mapRecipeLine),
    portionsPerBatch: Number(product.portions_per_batch ?? 1),
    menuPriceCents: product.price_cents,
    laborCents: product.labor_cents ?? 0,
    packagingCents: product.packaging_cents ?? 0,
  };
}