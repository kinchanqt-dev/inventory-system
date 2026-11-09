import { describe, expect, it } from "vitest";

import { toProductFormValues } from "@/features/products/lib/to-product-form-values";

describe("toProductFormValues", () => {
  it("maps product and stock fields for the edit form", () => {
    const values = toProductFormValues({
      id: "p1",
      sku: "RICE-MEAL-A",
      barcode: null,
      name: "Rice Meal A",
      description: "Popular lunch plate",
      imagePath: null,
      categoryId: "c1",
      priceCents: 8900,
      costCents: 4500,
      unit: "pc",
      isActive: true,
      stock: { quantity: 12, reorderLevel: 5 },
    });

    expect(values).toMatchObject({
      id: "p1",
      name: "Rice Meal A",
      quantity: 12,
      reorderLevel: 5,
      priceCents: 8900,
    });
  });
});
