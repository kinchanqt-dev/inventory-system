import { describe, expect, it } from "vitest";

import { filterIngredientsForStockList } from "@/features/ingredients/lib/filter-ingredients-list";

import type { UiIngredient } from "@/features/ingredients/types/ingredient.types";

function sampleIngredient(
  overrides: Partial<UiIngredient> = {},
): UiIngredient {
  return {
    id: "ing-1",
    name: "Flour",
    categoryId: "cat-1",
    supplier: "Metro",
    packPriceCents: 1000,
    previousPackPriceCents: null,
    packSize: 1,
    packUnit: "kg",
    yieldPercent: 100,
    yieldBps: 10000,
    trueCostPerPackUnitCents: 1000,
    notes: null,
    stockQuantity: 5,
    stockUnit: "kg",
    minStock: 2,
    category: { id: "cat-1", name: "Dry Goods" },
    ...overrides,
  };
}

describe("filterIngredientsForStockList", () => {
  it("filters low stock when enabled", () => {
    const ingredients = [
      sampleIngredient({ id: "low", stockQuantity: 1, minStock: 2 }),
      sampleIngredient({ id: "ok", stockQuantity: 5, minStock: 2 }),
    ];

    const result = filterIngredientsForStockList(ingredients, {
      lowStockOnly: true,
      query: "",
    });

    expect(result.map((item) => item.id)).toEqual(["low"]);
  });

  it("matches query across name, category, and supplier", () => {
    const ingredients = [
      sampleIngredient({
        id: "a",
        name: "Sugar",
        category: { id: "cat-2", name: "Sweeteners" },
      }),
      sampleIngredient({
        id: "b",
        name: "Flour",
        supplier: "S&R",
        category: { id: "cat-1", name: "Dry Goods" },
      }),
    ];

    const result = filterIngredientsForStockList(ingredients, {
      lowStockOnly: false,
      query: "dry",
    });

    expect(result.map((item) => item.id)).toEqual(["b"]);
  });
});