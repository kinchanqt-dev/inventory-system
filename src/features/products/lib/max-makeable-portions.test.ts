import { describe, expect, it } from "vitest";

import { maxMakeablePortions } from "@/features/products/lib/max-makeable-portions";

import type {
  IngredientCostInput,
  SubRecipeCostInput,
} from "@/lib/food-cost";
import type { IngredientStockInput } from "@/features/products/lib/max-makeable-portions";

function ingredient(
  id: string,
  packUnit: string,
): IngredientCostInput {
  return {
    id,
    packPriceCents: 1000,
    packSize: 1,
    packUnit,
    yieldBps: 10000,
  };
}

function stock(
  id: string,
  stockQuantity: number,
  stockUnit: string,
): IngredientStockInput {
  return { id, stockQuantity, stockUnit };
}

describe("maxMakeablePortions", () => {
  it("returns null when recipe has no lines", () => {
    expect(
      maxMakeablePortions(
        [],
        1,
        new Map(),
        new Map(),
        new Map(),
      ),
    ).toBeNull();
  });

  it("returns the limiting ingredient floor", () => {
    const ingredients = new Map([
      ["chicken", ingredient("chicken", "g")],
      ["rice", ingredient("rice", "g")],
    ]);
    const stocks = new Map([
      ["chicken", stock("chicken", 500, "g")],
      ["rice", stock("rice", 1000, "g")],
    ]);

    const max = maxMakeablePortions(
      [
        { ingredientId: "chicken", qty: 100, unit: "g" },
        { ingredientId: "rice", qty: 200, unit: "g" },
      ],
      1,
      ingredients,
      new Map(),
      stocks,
    );

    // chicken → 5, rice → 5
    expect(max).toBe(5);
  });

  it("converts stock units into pack units", () => {
    const ingredients = new Map([["chicken", ingredient("chicken", "g")]]);
    const stocks = new Map([["chicken", stock("chicken", 1, "kg")]]);

    const max = maxMakeablePortions(
      [{ ingredientId: "chicken", qty: 250, unit: "g" }],
      1,
      ingredients,
      new Map(),
      stocks,
    );

    expect(max).toBe(4);
  });

  it("expands sub-recipes and fail-closes on missing stock", () => {
    const ingredients = new Map([
      ["butter", ingredient("butter", "g")],
      ["flour", ingredient("flour", "g")],
    ]);
    const subRecipes = new Map<string, SubRecipeCostInput>([
      [
        "sauce",
        {
          id: "sauce",
          batchQty: 10,
          batchUnit: "portion",
          lines: [
            { ingredientId: "butter", qty: 50, unit: "g" },
            { ingredientId: "flour", qty: 30, unit: "g" },
          ],
        },
      ],
    ]);
    const stocks = new Map([
      ["butter", stock("butter", 100, "g")],
      // flour missing → 0 makeable
    ]);

    const max = maxMakeablePortions(
      [{ subRecipeId: "sauce", qty: 1, unit: "portion" }],
      1,
      ingredients,
      subRecipes,
      stocks,
    );

    expect(max).toBe(0);
  });
});
