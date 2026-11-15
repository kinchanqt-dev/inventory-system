import type { PosProduct } from "@/features/pos/types/pos-product.types";

export function posProductStockState(product: PosProduct) {
  const stock = product.stock?.quantity ?? 0;
  const soldOut = stock <= 0;
  const lowStock = !soldOut && stock <= 5;
  const initials = product.name.slice(0, 1).toUpperCase();
  return { stock, soldOut, lowStock, initials };
}