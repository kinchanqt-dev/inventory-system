import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PosCartItems } from "@/features/pos/components/pos-cart-items";
import { PosCartPanel } from "@/features/pos/components/pos-cart-panel";
import { PosPaymentFields } from "@/features/pos/components/pos-payment-fields";
import { PosProductGrid } from "@/features/pos/components/pos-product-grid";
import { PosTerminal } from "@/features/pos/components/pos-terminal";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

vi.mock("@/features/pos/api/pos.actions", () => ({
  checkoutAction: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const products = [
  {
    id: "p1",
    sku: "RICE-MEAL-A",
    name: "Rice Meal A",
    priceCents: 8900,
    stock: { quantity: 5 },
    category: { name: "Meals" },
  },
];

describe("POS components", () => {
  it("renders PosTerminal", () => {
    render(<PosTerminal products={products} shopName="Test Shop" />);
    expect(screen.getByText("Rice Meal A")).toBeInTheDocument();
    expect(screen.getAllByText(/New sale|Cart/i).length).toBeGreaterThan(0);
  });

  it("renders product grid and cart pieces", () => {
    render(
      <PosProductGrid
        products={products}
        query=""
        categories={["Meals"]}
        selectedCategory={null}
        onQueryChange={() => undefined}
        onCategoryChange={() => undefined}
        onAdd={() => undefined}
      />,
    );
    render(
      <PosCartItems
        cart={[]}
        onQuantityChange={() => undefined}
        onRemove={() => undefined}
      />,
    );
    render(
      <PosPaymentFields
        paymentMethod="CASH"
        paymentNote=""
        amountTendered=""
        onPaymentMethodChange={() => undefined}
        onPaymentNoteChange={() => undefined}
        onAmountTenderedChange={() => undefined}
      />,
    );
    render(
      <PosCartPanel
        cart={[]}
        subtotalCents={0}
        paymentMethod="CASH"
        paymentNote=""
        amountTendered=""
        isPending={false}
        onPaymentMethodChange={() => undefined}
        onPaymentNoteChange={() => undefined}
        onAmountTenderedChange={() => undefined}
        onQuantityChange={() => undefined}
        onRemove={() => undefined}
        onCheckout={() => undefined}
      />,
    );

    expect(screen.getAllByText("Rice Meal A").length).toBeGreaterThan(0);
    expect(screen.getAllByText("New sale").length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("button", { name: /Charge/i }).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "Cash" }).length).toBeGreaterThan(
      0,
    );
  });
});
