import { prisma } from "@/lib/prisma";

export async function listInventory() {
  return await prisma.stockItem.findMany({
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      product: {
        name: "asc",
      },
    },
  });
}

export async function listLowStock() {
  const items = await listInventory();
  return items.filter((item) => item.quantity <= item.reorderLevel);
}
