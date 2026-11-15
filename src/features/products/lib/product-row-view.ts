import type { ProductRowData } from "@/features/products/types/product.types";

function stockQuantity(product: ProductRowData) {
  if (!product.stock) {
    return 0;
  }
  return product.stock.quantity;
}

function stockReorderLevel(product: ProductRowData) {
  if (!product.stock) {
    return 0;
  }
  return product.stock.reorderLevel;
}

export function getProductRowView(product: ProductRowData) {
  const quantity = stockQuantity(product);
  const reorderLevel = stockReorderLevel(product);

  return {
    quantity,
    reorderLevel,
    isLow: quantity <= reorderLevel,
    initials: product.name.slice(0, 1).toUpperCase(),
  };
}