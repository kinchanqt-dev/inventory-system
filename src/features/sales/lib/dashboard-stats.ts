interface SaleTotalRow {
  total_cents: number;
  payment_method: string;
}

interface StockLevelRow {
  quantity: number;
  reorder_level: number;
}

export function aggregateDashboardStats(
  todaySales: SaleTotalRow[],
  stockItems: StockLevelRow[],
  productCount: number,
) {
  const revenueCents = todaySales.reduce(
    (sum, sale) => sum + sale.total_cents,
    0,
  );
  const byMethod = todaySales.reduce<Record<string, number>>((acc, sale) => {
    acc[sale.payment_method] =
      (acc[sale.payment_method] ?? 0) + sale.total_cents;
    return acc;
  }, {});
  const lowStockCount = stockItems.filter(
    (item) => item.quantity <= item.reorder_level,
  ).length;

  return {
    revenueCents,
    completedToday: todaySales.length,
    lowStockCount,
    productCount,
    byMethod,
  };
}