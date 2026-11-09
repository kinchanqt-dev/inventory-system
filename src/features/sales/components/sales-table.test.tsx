import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SalesTable } from "@/features/sales/components/sales-table";

describe("SalesTable", () => {
  it("renders empty state", () => {
    render(<SalesTable sales={[]} />);
    expect(screen.getAllByText("No sales recorded yet").length).toBeGreaterThan(
      0,
    );
  });

  it("renders sale rows", () => {
    render(
      <SalesTable
        sales={[
          {
            id: "s1",
            saleNumber: "S123",
            status: "COMPLETED",
            totalCents: 8900,
            paymentMethod: "QRPH",
            paymentNote: "ref-1",
            createdAt: new Date("2026-11-09T10:00:00Z"),
            cashier: { name: "Owner" },
            items: [{ quantity: 2 }],
          },
        ]}
      />,
    );

    expect(screen.getAllByText("S123").length).toBeGreaterThan(0);
    expect(screen.getAllByText("QRPh").length).toBeGreaterThan(0);
  });
});
