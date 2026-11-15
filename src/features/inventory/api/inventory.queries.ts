import { mapCategory, mapProduct } from "@/lib/mappers";
import { requireSession } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { resolveImageSrc } from "@/lib/uploads";

import type { Category, Product, StockItem } from "@/types/database.types";

type StockRow = StockItem & {
  products: (Product & { category: Category | null }) | null;
};

export async function listInventory() {
  const session = await requireSession();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stock_items")
    .select("*, products(*, category:categories(*))")
    .eq("organization_id", session.organization.id);

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as StockRow[];

  return rows
    .map((row) => {
      const product = row.products;
      if (!product) {
        return null;
      }
      const mapped = mapProduct({
        ...product,
        stock_items: row,
        category: product.category,
      });
      return {
        id: row.id,
        productId: row.product_id,
        quantity: row.quantity,
        reorderLevel: row.reorder_level,
        product: {
          ...mapped,
          imagePath: resolveImageSrc(mapped.imagePath),
          category: product.category ? mapCategory(product.category) : null,
        },
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)
    .sort((a, b) => a.product.name.localeCompare(b.product.name));
}

export async function listLowStock() {
  const items = await listInventory();
  return items.filter((item) => item.quantity <= item.reorderLevel);
}
