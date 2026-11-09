import { describe, expect, it } from "vitest";

import { checkoutSchema } from "@/features/pos/schemas/checkout.schema";

describe("checkoutSchema", () => {
  it("accepts a valid QRPh sale", () => {
    const result = checkoutSchema.safeParse({
      items: [{ productId: "p1", quantity: 1 }],
      paymentMethod: "QRPH",
      discountCents: 0,
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty cart", () => {
    const result = checkoutSchema.safeParse({
      items: [],
      paymentMethod: "CASH",
      discountCents: 0,
    });

    expect(result.success).toBe(false);
  });
});
