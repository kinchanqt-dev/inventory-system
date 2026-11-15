import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { RecipeCostSummary } from "@/features/products/components/recipe-cost-summary";

afterEach(() => {
  cleanup();
});

describe("RecipeCostSummary", () => {
  it("shows empty guidance when there is no summary", () => {
    render(
      <RecipeCostSummary
        costSummary={null}
        foodCostSettings={{
          targetFoodCostBps: 3300,
          salesTaxBps: 0,
          pricesIncludeTax: true,
        }}
      />,
    );

    expect(
      screen.getByText(/Add at least one valid ingredient/i),
    ).toBeInTheDocument();
  });

  it("renders cost figures and badge", () => {
    render(
      <RecipeCostSummary
        costSummary={{
          status: "above_target",
          batchFoodCostCents: 1000,
          foodCostPerPortionCents: 250,
          totalCostPerPortionCents: 300,
          foodCostBps: 4000,
          suggestedMenuPriceCents: 800,
          profitPerPortionCents: 500,
        }}
        foodCostSettings={{
          targetFoodCostBps: 3300,
          salesTaxBps: 0,
          pricesIncludeTax: true,
        }}
      />,
    );

    expect(screen.getByText("Above target food cost")).toBeInTheDocument();
    expect(screen.getByText("40.0%")).toBeInTheDocument();
  });
});
