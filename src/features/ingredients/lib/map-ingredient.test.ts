import { describe, expect, it } from "vitest";

import { mapIngredient } from "@/features/ingredients/lib/map-ingredient";

describe("mapIngredient", () => {
  const row = {
    id: "ing-1",
    organization_id: "org-1",
    name: "Flour",
    category_id: "cat-1",
    supplier: "Acme",
    pack_price_cents: 1000,
    pack_size: 1,
    pack_unit: "kg",
    yield_bps: 10000,
    previous_pack_price_cents: null,
    notes: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  };

  it("maps with stock and category", () => {
    const mapped = mapIngredient(
      row,
      {
        id: "stock-1",
        organization_id: "org-1",
        ingredient_id: "ing-1",
        quantity: 4,
        unit: "kg",
        min_stock: 1,
        updated_at: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "cat-1",
        organization_id: "org-1",
        name: "Dry",
        slug: "dry",
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
      },
    );

    expect(mapped).toMatchObject({
      id: "ing-1",
      name: "Flour",
      category: { id: "cat-1", name: "Dry" },
      stockQuantity: 4,
      minStock: 1,
      stockUnit: "kg",
      yieldPercent: 100,
    });
  });

  it("falls back when stock and category are missing", () => {
    const mapped = mapIngredient(row, null, null);
    expect(mapped.category).toBeNull();
    expect(mapped.stockQuantity).toBe(0);
    expect(mapped.minStock).toBe(0);
    expect(mapped.stockUnit).toBe("kg");
  });
});
