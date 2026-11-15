import { describe, expect, it } from "vitest";

import {
  emptyToUndefined,
  readIngredientFormData,
  toIngredientWriteData,
} from "@/features/ingredients/lib/ingredient-form-data";

describe("ingredient form data helpers", () => {
  it("emptyToUndefined trims and drops blanks", () => {
    expect(emptyToUndefined(null)).toBeUndefined();
    expect(emptyToUndefined("  ")).toBeUndefined();
    expect(emptyToUndefined(" flour ")).toBe("flour");
  });

  it("reads form data with optional initial stock", () => {
    const formData = new FormData();
    formData.set("name", "Sugar");
    formData.set("packPricePesos", "10");
    formData.set("packSize", "1");
    formData.set("packUnit", "kg");
    formData.set("yieldPercent", "100");
    formData.set("minStock", "2");
    formData.set("initialStock", "5");
    formData.set("notes", "  ");

    expect(readIngredientFormData(formData, { includeInitialStock: true })).toEqual(
      expect.objectContaining({
        name: "Sugar",
        packUnit: "kg",
        initialStock: "5",
        notes: undefined,
      }),
    );

    expect(readIngredientFormData(formData).initialStock).toBeUndefined();
  });

  it("maps write data to snake_case columns", () => {
    expect(
      toIngredientWriteData({
        name: "Sugar",
        packPricePesos: 12.5,
        packSize: 1,
        packUnit: "kg",
        yieldPercent: 90,
        categoryId: "cat-1",
        supplier: "Acme",
        notes: "dry",
      }),
    ).toEqual({
      name: "Sugar",
      category_id: "cat-1",
      supplier: "Acme",
      pack_price_cents: 1250,
      pack_size: 1,
      pack_unit: "kg",
      yield_bps: 9000,
      notes: "dry",
    });
  });
});
