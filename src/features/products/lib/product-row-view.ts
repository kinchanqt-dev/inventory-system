import type { ProductRowData } from "@/features/products/types/product.types";

export function getProductRowView(product: ProductRowData) {
  const quantity = product.stock?.quantity ?? 0;
  const reorderLevel = product.stock?.reorderLevel ?? 0;

  return {
    quantity,
    reorderLevel,
    isLow: quantity <= reorderLevel,
    initials: product.name.slice(0, 1).toUpperCase(),
  };
}
