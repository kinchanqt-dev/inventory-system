import { startOfDay } from "date-fns";

import { prisma } from "@/lib/prisma";

export async function listRecentSales(limit = 50) {
  return await prisma.sale.findMany({
    include: {
      cashier: {
        select: { name: true },
      },
      items: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/** Sales history for the Sales page — capped for client filter + pagination. */
export async function listSalesHistory(limit = 250) {
  return await listRecentSales(limit);
}

export async function getDashboardStats() {
  const today = startOfDay(new Date());

  const [todaySales, stockItems, productCount] = await Promise.all([
    prisma.sale.findMany({
      where: {
        createdAt: { gte: today },
        status: "COMPLETED",
      },
      select: {
        totalCents: true,
        paymentMethod: true,
      },
    }),
    prisma.stockItem.findMany({
      select: {
        quantity: true,
        reorderLevel: true,
      },
    }),
    prisma.product.count({ where: { isActive: true } }),
  ]);

  const revenueCents = todaySales.reduce((sum, sale) => sum + sale.totalCents, 0);
  const byMethod = todaySales.reduce<Record<string, number>>((acc, sale) => {
    acc[sale.paymentMethod] = (acc[sale.paymentMethod] ?? 0) + sale.totalCents;
    return acc;
  }, {});
  const lowStockCount = stockItems.filter(
    (item) => item.quantity <= item.reorderLevel,
  ).length;

  return {
    revenueCents,
    completedToday: todaySales.length,
    lowStockCount,
    productCount,
    byMethod,
  };
}
