import { matchesSearchFields } from "@/lib/search-fields";

interface ProductFilterRow {
  name: string;
  sku: string;
  category: { name: string } | null;
}

export function filterProductsList<T extends ProductFilterRow>(
  products: T[],
  query: string,
) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return products;
  }

  return products.filter((product) =>
    matchesSearchFields(
      [product.name, product.sku, product.category?.name],
      normalized,
    ),
  );
}
