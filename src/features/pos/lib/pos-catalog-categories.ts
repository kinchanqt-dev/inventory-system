interface CatalogCategorySource {
  category: { name: string } | null;
}

export function posCatalogCategories(products: CatalogCategorySource[]) {
  const names = new Set<string>();
  for (const product of products) {
    if (product.category?.name) {
      names.add(product.category.name);
    }
  }
  return [...names].sort((a, b) => a.localeCompare(b));
}
