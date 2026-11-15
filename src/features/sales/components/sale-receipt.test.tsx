import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SaleReceipt } from "@/features/sales/components/sale-receipt";

describe("SaleReceipt", () => {
  it("shows items, tendered amount, and change", () => {
    render(
      <SaleReceipt
        shopName="Kinchan Kitchen"
        receipt={{
          saleNumber: "S-100",
          createdAt: new Date("2026-11-15T10:00:00Z"),
          subtotalCents: 25000,
          discountCents: 0,
          totalCents: 25000,
          paymentMethod: "CASH",
          paymentNote: null,
          amountTenderedCents: 30000,
          changeCents: 5000,
          cashierName: "Ada",
          items: [
            {
              id: "1",
              productName: "Rice Meal",
              productSku: "RICE",
              quantity: 1,
              unitPriceCents: 25000,
              lineTotalCents: 25000,
            },
          ],
        }}
      />,
    );

    expect(screen.getByText("Kinchan Kitchen")).toBeInTheDocument();
    expect(screen.getByText("S-100")).toBeInTheDocument();
    expect(screen.getByText("Rice Meal")).toBeInTheDocument();
    expect(screen.getByText("Tendered")).toBeInTheDocument();
    expect(screen.getByText("Change")).toBeInTheDocument();
  });
});
