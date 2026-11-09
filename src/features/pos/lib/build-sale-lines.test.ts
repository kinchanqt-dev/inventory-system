import { describe, expect, it } from "vitest";

import {
  buildSaleLines,
  resolveCashTotals,
} from "@/features/pos/lib/build-sale-lines";

const products = [
  {
    id: "p1",
    name: "Rice Meal A",
    sku: "RICE-MEAL-A",
    priceCents: 8900,
    stock: { quantity: 10 },
  },
];

describe("buildSaleLines", () => {
  it("builds priced lines", () => {
    const result = buildSaleLines([{ productId: "p1", quantity: 2 }], products);

    expect(result.subtotalCents).toBe(17800);
    expect(result.lineItems).toHaveLength(1);
  });

  it("rejects missing products", () => {
    expect(() =>
      buildSaleLines([{ productId: "missing", quantity: 1 }], products),
    ).toThrow(/unavailable|stock is missing/);
  });

  it("rejects insufficient stock", () => {
    expect(() =>
      buildSaleLines([{ productId: "p1", quantity: 20 }], products),
    ).toThrow("Not enough stock");
  });
});

describe("resolveCashTotals", () => {
  it("computes cash change", () => {
    expect(
      resolveCashTotals({
        paymentMethod: "CASH",
        subtotalCents: 10000,
        discountCents: 0,
        amountTenderedCents: 12000,
      }),
    ).toEqual({ totalCents: 10000, changeCents: 2000 });
  });

  it("rejects underpayment", () => {
    expect(() =>
      resolveCashTotals({
        paymentMethod: "CASH",
        subtotalCents: 10000,
        discountCents: 0,
        amountTenderedCents: 5000,
      }),
    ).toThrow("Amount received");
  });

  it("skips change for QR payments", () => {
    expect(
      resolveCashTotals({
        paymentMethod: "QRPH",
        subtotalCents: 10000,
        discountCents: 500,
      }),
    ).toEqual({ totalCents: 9500, changeCents: null });
  });
});
