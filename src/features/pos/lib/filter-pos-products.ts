import { matchesSearchFields } from "@/lib/search-fields";

interface PosFilterProduct {
  name: string;
  sku: string;
  category: { name: string } | null;
}

function productCategoryLabel(product: PosFilterProduct) {
  return product.category?.name ?? "Uncategorized";
}

function matchesSelectedCategory(
  product: PosFilterProduct,
  selectedCategory: string | null,
) {
  if (!selectedCategory) {
    return true;
  }
  return productCategoryLabel(product) === selectedCategory;
}

export function filterPosProducts<T extends PosFilterProduct>(
  products: T[],
  options: { query: string; selectedCategory: string | null },
) {
  const normalized = options.query.trim().toLowerCase();

  return products.filter(
    (product) =>
      matchesSelectedCategory(product, options.selectedCategory) &&
      matchesSearchFields([product.name, product.sku], normalized),
  );
}
