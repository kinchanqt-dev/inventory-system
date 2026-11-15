import { describe, expect, it } from "vitest";

import { resolveIngredientFormDefaults } from "@/features/ingredients/lib/resolve-ingredient-form-defaults";

describe("resolveIngredientFormDefaults", () => {
  it("returns create defaults when ingredient is missing", () => {
    expect(resolveIngredientFormDefaults()).toEqual({
      name: "",
      supplier: "",
      packPrice: "",
      packSize: 1,
      packUnit: "pc",
      yieldPercent: 100,
      minStock: 0,
      notes: "",
      showInitialStock: true,
    });
  });

  it("maps an existing ingredient for edit", () => {
    expect(
      resolveIngredientFormDefaults({
        id: "ing-1",
        name: "Flour",
        categoryId: "cat-1",
        supplier: null,
        packPriceCents: 2500,
        packSize: 2,
        packUnit: "kg",
        yieldPercent: 95,
        minStock: 3,
        notes: null,
      }),
    ).toEqual({
      name: "Flour",
      supplier: "",
      packPrice: "25",
      packSize: 2,
      packUnit: "kg",
      yieldPercent: 95,
      minStock: 3,
      notes: "",
      showInitialStock: false,
    });
  });
});
