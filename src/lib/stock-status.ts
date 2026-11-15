export type StockStatus = "out" | "low" | "ok";

export function getStockStatus(
  quantity: number,
  threshold: number,
): StockStatus {
  if (quantity <= 0) return "out";
  if (quantity <= threshold) return "low";
  return "ok";
}