import { describe, expect, it } from "vitest";

import { nextStockQuantity } from "@/features/inventory/lib/next-stock-quantity";

describe("nextStockQuantity", () => {
  it("adds stock for IN", () => {
    expect(
      nextStockQuantity({ currentQuantity: 10, type: "IN", quantity: 5 }),
    ).toBe(15);
  });

  it("subtracts stock for OUT", () => {
    expect(
      nextStockQuantity({ currentQuantity: 10, type: "OUT", quantity: 4 }),
    ).toBe(6);
  });

  it("sets exact quantity for ADJUST", () => {
    expect(
      nextStockQuantity({ currentQuantity: 10, type: "ADJUST", quantity: 3 }),
    ).toBe(3);
  });
});
