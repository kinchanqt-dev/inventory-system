export function posStockBadgeVariant(soldOut: boolean, lowStock: boolean) {
  if (soldOut) {
    return "destructive" as const;
  }
  if (lowStock) {
    return "secondary" as const;
  }
  return "outline" as const;
}

export function posStockBadgeLabel(soldOut: boolean, stock: number) {
  if (soldOut) {
    return "Out";
  }
  return String(stock);
}