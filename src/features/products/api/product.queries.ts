import { prisma } from "@/lib/prisma";

export async function listProducts() {
  return await prisma.product.findMany({
    include: {
      category: true,
      stock: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getProductById(productId: string) {
  return await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      stock: true,
    },
  });
}

export async function listActiveProductsForPos() {
  return await prisma.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
      stock: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function listCategories() {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}
