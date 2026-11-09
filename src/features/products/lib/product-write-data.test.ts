import { describe, expect, it } from "vitest";

import {
  emptyToUndefined,
  readProductFormData,
  toProductWriteData,
} from "@/features/products/lib/product-write-data";

describe("product write helpers", () => {
  it("maps product write data", () => {
    expect(
      toProductWriteData({
        sku: "rice-meal-a",
        name: "Rice Meal A",
        price: 89,
        cost: 45,
        unit: "pc",
        isActive: true,
        barcode: "",
        description: "Hot meal",
        categoryId: "cat-1",
      }),
    ).toEqual({
      sku: "RICE-MEAL-A",
      barcode: null,
      name: "Rice Meal A",
      description: "Hot meal",
      categoryId: "cat-1",
      priceCents: 8900,
      costCents: 4500,
      unit: "pc",
      isActive: true,
    });
  });

  it("normalizes empty form values", () => {
    expect(emptyToUndefined("  ")).toBeUndefined();
    expect(emptyToUndefined("sku")).toBe("sku");
    expect(emptyToUndefined(null)).toBeUndefined();
  });

  it("reads product form data", () => {
    const formData = new FormData();
    formData.set("sku", "ABC");
    formData.set("name", "Item");
    formData.set("price", "10");
    formData.set("isActive", "true");

    expect(readProductFormData(formData, { includeQuantity: true })).toMatchObject({
      sku: "ABC",
      name: "Item",
      price: "10",
      quantity: 0,
      isActive: true,
    });
  });
});
