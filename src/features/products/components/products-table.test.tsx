import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ProductRow } from "@/features/products/components/product-row";
import { ProductsTable } from "@/features/products/components/products-table";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("@/features/products/api/product.actions", () => ({
  toggleProductActiveAction: vi.fn(),
  createProductAction: vi.fn(),
  updateProductAction: vi.fn(),
}));

const product = {
  id: "p1",
  sku: "RICE-MEAL-A",
  barcode: null,
  name: "Rice Meal A",
  description: null,
  imagePath: null,
  categoryId: "c1",
  priceCents: 8900,
  costCents: 4500,
  unit: "pc",
  isActive: true,
  category: { name: "Meals" },
  stock: { quantity: 2, reorderLevel: 5 },
};

describe("products table", () => {
  it("renders ProductsTable rows", () => {
    render(<ProductsTable products={[product]} />);
    expect(screen.getAllByText("Rice Meal A").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Low").length).toBeGreaterThan(0);
  });

  it("exposes ProductRow", () => {
    expect(typeof ProductRow).toBe("function");
  });
});
