import { requireSession } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

import {
  loadProductRecipeLines,
  loadProductRecipeMeta,
  toProductRecipeData,
} from "@/features/products/lib/load-product-recipe";

import type { ProductRecipeData } from "@/features/products/types/recipe.types";

export async function getProductRecipe(
  productId: string,
): Promise<ProductRecipeData | null> {
  const session = await requireSession();
  const supabase = await createClient();
  const orgId = session.organization.id;

  const product = await loadProductRecipeMeta(supabase, orgId, productId);
  if (!product) {
    return null;
  }

  const lineRows = await loadProductRecipeLines(supabase, orgId, productId);
  return toProductRecipeData(product, lineRows);
}