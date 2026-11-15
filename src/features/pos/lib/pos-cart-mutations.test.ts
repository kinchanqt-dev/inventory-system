import { describe, expect, it } from "vitest";

import { applySaleToCatalogStock } from "@/features/pos/lib/pos-cart-mutations";

describe("applySaleToCatalogStock", () => {
  it("reduces stock for sold products", () => {
    const products = [
      {
        id: "p1",
        name: "Meal",
        sku: "M1",
        priceCents: 15000,
        stock: { quantity: 50 },
        category: { name: "Mains" },
      },
      {
        id: "p2",
        name: "Side",
        sku: "S1",
        priceCents: 5000,
        stock: { quantity: 10 },
        category: null,
      },
    ];

    const next = applySaleToCatalogStock(products, [
      { productId: "p1", quantity: 1 },
    ]);

    expect(next[0]?.stock?.quantity).toBe(49);
    expect(next[1]?.stock?.quantity).toBe(10);
  });

  it("leaves products without stock unchanged", () => {
    const products = [
      {
        id: "p1",
        name: "Meal",
        sku: "M1",
        priceCents: 15000,
        stock: null,
      },
    ];

    const next = applySaleToCatalogStock(products, [
      { productId: "p1", quantity: 2 },
    ]);

    expect(next[0]?.stock).toBeNull();
  });
});
