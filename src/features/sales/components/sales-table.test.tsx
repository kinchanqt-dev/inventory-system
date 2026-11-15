import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SalesTable } from "@/features/sales/components/sales-table";

describe("SalesTable", () => {
  it("renders empty state", () => {
    render(<SalesTable sales={[]} shopName="Test Shop" />);
    expect(screen.getAllByText("No sales recorded yet").length).toBeGreaterThan(
      0,
    );
  });

  it("renders sale rows", () => {
    render(
      <SalesTable
        shopName="Test Shop"
        sales={[
          {
            id: "s1",
            saleNumber: "S123",
            status: "COMPLETED",
            subtotalCents: 8900,
            discountCents: 0,
            totalCents: 8900,
            paymentMethod: "QRPH",
            paymentNote: "ref-1",
            amountTenderedCents: null,
            changeCents: null,
            cashierId: "u1",
            createdAt: new Date("2026-11-09T10:00:00Z"),
            cashier: { id: "u1", name: "Owner" },
            items: [
              {
                id: "i1",
                productName: "Rice Meal",
                productSku: "RICE",
                quantity: 2,
                unitPriceCents: 4450,
                lineTotalCents: 8900,
              },
            ],
          },
        ]}
      />,
    );

    expect(screen.getAllByText("S123").length).toBeGreaterThan(0);
    expect(screen.getAllByText("QRPh").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /receipt/i }).length).toBeGreaterThan(
      0,
    );
  });
});
