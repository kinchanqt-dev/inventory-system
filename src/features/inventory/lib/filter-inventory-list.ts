import { matchesSearchFields } from "@/lib/search-fields";

interface InventoryFilterRow {
  quantity: number;
  reorderLevel: number;
  product: {
    sku: string;
    name: string;
    category: { name: string } | null;
  };
}

function passesLowStockFilter(
  item: InventoryFilterRow,
  lowStockOnly: boolean,
) {
  if (!lowStockOnly) {
    return true;
  }
  return item.quantity <= item.reorderLevel;
}

function inventoryMatchesQuery(
  item: InventoryFilterRow,
  normalizedQuery: string,
) {
  return matchesSearchFields(
    [item.product.sku, item.product.name, item.product.category?.name],
    normalizedQuery,
  );
}

export function filterInventoryForStockList<T extends InventoryFilterRow>(
  items: T[],
  options: { lowStockOnly: boolean; query: string },
) {
  const normalized = options.query.trim().toLowerCase();

  return items.filter(
    (item) =>
      passesLowStockFilter(item, options.lowStockOnly) &&
      inventoryMatchesQuery(item, normalized),
  );
}
