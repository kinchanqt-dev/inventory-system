import "dotenv/config";

import { hash } from "bcryptjs";

import { createMariadbAdapter } from "../src/lib/create-mariadb-adapter";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({ adapter: createMariadbAdapter() });

interface SeedProduct {
  sku: string;
  name: string;
  categoryId: string;
  priceCents: number;
  costCents: number;
  quantity: number;
  reorderLevel: number;
}

async function upsertProduct(product: SeedProduct) {
  const { quantity, reorderLevel, ...data } = product;

  await prisma.product.upsert({
    where: { sku: data.sku },
    update: {
      name: data.name,
      categoryId: data.categoryId,
      priceCents: data.priceCents,
      costCents: data.costCents,
      isActive: true,
    },
    create: {
      ...data,
      stock: {
        create: {
          quantity,
          reorderLevel,
        },
      },
    },
  });

  const existing = await prisma.product.findUniqueOrThrow({
    where: { sku: data.sku },
    include: { stock: true },
  });

  if (!existing.stock) {
    await prisma.stockItem.create({
      data: {
        productId: existing.id,
        quantity,
        reorderLevel,
      },
    });
  }
}

async function main() {
  const passwordHash = await hash("password123", 10);

  const owner = await prisma.user.upsert({
    where: { email: "owner@local.dev" },
    update: {},
    create: {
      name: "Owner",
      email: "owner@local.dev",
      passwordHash,
      role: "OWNER",
    },
  });

  await prisma.user.upsert({
    where: { email: "cashier@local.dev" },
    update: {},
    create: {
      name: "Cashier",
      email: "cashier@local.dev",
      passwordHash,
      role: "CASHIER",
    },
  });

  const categories = [
    { name: "Meals", slug: "meals" },
    { name: "Drinks", slug: "drinks" },
    { name: "Snacks", slug: "snacks" },
  ];

  await Promise.all(
    categories.map((category) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: { name: category.name },
        create: category,
      }),
    ),
  );

  const [meals, drinks, snacks] = await Promise.all([
    prisma.category.findUniqueOrThrow({ where: { slug: "meals" } }),
    prisma.category.findUniqueOrThrow({ where: { slug: "drinks" } }),
    prisma.category.findUniqueOrThrow({ where: { slug: "snacks" } }),
  ]);

  const products: SeedProduct[] = [
    {
      sku: "RICE-MEAL-A",
      name: "Rice Meal A",
      categoryId: meals.id,
      priceCents: 8900,
      costCents: 4500,
      quantity: 40,
      reorderLevel: 10,
    },
    {
      sku: "RICE-MEAL-B",
      name: "Rice Meal B",
      categoryId: meals.id,
      priceCents: 9900,
      costCents: 5200,
      quantity: 35,
      reorderLevel: 10,
    },
    {
      sku: "SIOPAO-ASADO",
      name: "Siopao Asado",
      categoryId: snacks.id,
      priceCents: 4500,
      costCents: 2200,
      quantity: 50,
      reorderLevel: 15,
    },
    {
      sku: "COFFEE-HOT-S",
      name: "Hot Coffee Small",
      categoryId: drinks.id,
      priceCents: 5500,
      costCents: 1800,
      quantity: 80,
      reorderLevel: 20,
    },
    {
      sku: "COFFEE-HOT-L",
      name: "Hot Coffee Large",
      categoryId: drinks.id,
      priceCents: 7500,
      costCents: 2400,
      quantity: 60,
      reorderLevel: 15,
    },
    {
      sku: "ICED-TEA",
      name: "Iced Tea",
      categoryId: drinks.id,
      priceCents: 4000,
      costCents: 1200,
      quantity: 70,
      reorderLevel: 20,
    },
    {
      sku: "BOTTLED-WATER",
      name: "Bottled Water",
      categoryId: drinks.id,
      priceCents: 2000,
      costCents: 800,
      quantity: 100,
      reorderLevel: 25,
    },
    {
      sku: "LUMPIANG-SHANGHAI",
      name: "Lumpiang Shanghai (6pcs)",
      categoryId: snacks.id,
      priceCents: 6000,
      costCents: 2800,
      quantity: 30,
      reorderLevel: 8,
    },
  ];

  await Promise.all(products.map((product) => upsertProduct(product)));

  await prisma.shopSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      shopTitle: "Inventory POS",
      tagline: "Local Food",
      primaryColor: "#1a1a1a",
      accentColor: "#2f5d50",
      backgroundColor: "#f7f4ef",
    },
  });

  console.log(`Seeded owner ${owner.email} and sample food products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
