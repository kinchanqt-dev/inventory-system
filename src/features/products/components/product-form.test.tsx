import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ProductForm } from "@/features/products/components/product-form";
import { ProductFormFields } from "@/features/products/components/product-form-fields";
import { ProductIdentityFields } from "@/features/products/components/product-identity-fields";
import { ProductPricingFields } from "@/features/products/components/product-pricing-fields";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/features/products/api/product.actions", () => ({
  createProductAction: vi.fn(),
  updateProductAction: vi.fn(),
}));

afterEach(() => {
  cleanup();
});

describe("product form components", () => {
  const categories = [{ id: "c1", name: "Meals" }];

  it("renders ProductForm", () => {
    render(<ProductForm categories={categories} />);
    expect(screen.getByLabelText("Item code")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add product" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("renders ProductFormFields", () => {
    render(
      <ProductFormFields
        categories={categories}
        categoryId="c1"
        onCategoryChange={() => undefined}
        isEdit={false}
      />,
    );
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Item details" }),
    ).toBeInTheDocument();
  });

  it("renders identity and pricing field groups", () => {
    render(
      <ProductIdentityFields
        categories={categories}
        categoryId="c1"
        onCategoryChange={() => undefined}
      />,
    );
    render(<ProductPricingFields isEdit={false} />);

    expect(screen.getByLabelText("Sold as")).toBeInTheDocument();
    expect(screen.getByLabelText("Price (₱)")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("RICE-MEAL-A")).toBeInTheDocument();
  });
});
