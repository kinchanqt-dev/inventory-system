import { describe, expect, it } from "vitest";

import {
  computeRecipeCost,
  expandRecipeToIngredientUsage,
  ingredientUsageCostCents,
  trueCostPerPackUnitCents,
} from "@/lib/food-cost";

describe("food-cost engine", () => {
  const butter = {
    id: "butter",
    packPriceCents: 5400,
    packSize: 200,
    packUnit: "g",
    yieldBps: 10000,
  };

  it("computes true cost per pack unit", () => {
    expect(trueCostPerPackUnitCents(butter)).toBeCloseTo(27, 5);
  });

  it("costs ingredient usage across units", () => {
    expect(ingredientUsageCostCents(butter, 50, "g")).toBe(1350);
  });

  it("computes recipe food cost vs target", () => {
    const ingredients = new Map([["butter", butter]]);
    const result = computeRecipeCost(
      {
        portionsPerBatch: 1,
        menuPriceCents: 11900,
        laborCents: 0,
        packagingCents: 0,
        lines: [{ ingredientId: "butter", qty: 50, unit: "g" }],
      },
      ingredients,
      new Map(),
      {
        targetFoodCostBps: 5000,
        salesTaxBps: 800,
        pricesIncludeTax: true,
      },
    );

    expect(result.foodCostPerPortionCents).toBe(1350);
    expect(result.priceWithoutTaxCents).toBe(
      Math.round((11900 * 10000) / 10800),
    );
    expect(result.status).toBe("on_target");
  });

  it("expands sub-recipes into ingredient stock usage", () => {
    const ingredients = new Map([
      ["butter", butter],
      [
        "flour",
        {
          id: "flour",
          packPriceCents: 9950,
          packSize: 800,
          packUnit: "g",
          yieldBps: 10000,
        },
      ],
    ]);
    const subRecipes = new Map([
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

    const usage = expandRecipeToIngredientUsage(
      [{ subRecipeId: "sauce", qty: 2, unit: "portion" }],
      1,
      1,
      subRecipes,
      ingredients,
    );

    const butterUsage = usage.find((row) => row.ingredientId === "butter");
    expect(butterUsage?.qtyInPackUnit).toBeCloseTo(10, 5);
  });
});
