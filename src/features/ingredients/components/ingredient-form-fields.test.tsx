import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { IngredientFormFields } from "@/features/ingredients/components/ingredient-form-fields";

afterEach(() => {
  cleanup();
});

describe("IngredientFormFields", () => {
  it("renders create defaults", () => {
    render(
      <IngredientFormFields
        categories={[{ id: "c1", name: "Dry" }]}
        categoryId=""
        onCategoryChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Starting stock")).toBeInTheDocument();
  });

  it("hides starting stock when editing", () => {
    render(
      <IngredientFormFields
        categories={[]}
        categoryId="c1"
        onCategoryChange={vi.fn()}
        ingredient={{
          id: "ing-1",
          name: "Flour",
          categoryId: "c1",
          supplier: "Acme",
          packPriceCents: 1000,
          packSize: 1,
          packUnit: "kg",
          yieldPercent: 100,
          minStock: 2,
          notes: "note",
        }}
      />,
    );

    expect(screen.queryByLabelText("Starting stock")).not.toBeInTheDocument();
    expect(screen.getByDisplayValue("Flour")).toBeInTheDocument();
  });
});
