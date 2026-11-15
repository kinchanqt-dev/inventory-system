import { mapProduct } from "@/lib/mappers";
import { requireSession } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { resolveImageSrc } from "@/lib/uploads";

import { listCategoryOptions } from "@/features/categories/api/category.queries";

import type { Category, Product, StockItem } from "@/types/database.types";

type ProductRow = Product & {
  category: Category | null;
  stock_items: StockItem | StockItem[] | null;
};

function withResolvedImage<T extends { imagePath: string | null }>(product: T): T {
  return {
    ...product,
    imagePath: resolveImageSrc(product.imagePath),
  };
}

export async function listProducts() {
  const session = await requireSession();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), stock_items(*)")
    .eq("organization_id", session.organization.id)
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ProductRow[]).map((row) =>
    withResolvedImage(mapProduct(row)),
  );
}

export async function getProductById(productId: string) {
  const session = await requireSession();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), stock_items(*)")
    .eq("organization_id", session.organization.id)
    .eq("id", productId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return withResolvedImage(mapProduct(data as ProductRow));
}

export async function listActiveProductsForPos() {
  const products = await listProducts();
  return products.filter((product) => product.isActive);
}

export async function listMenuCategories() {
  return listCategoryOptions("menu");
}
