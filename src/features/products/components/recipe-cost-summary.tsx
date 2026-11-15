"use client";

import type { FoodCostSettings } from "@/lib/food-cost";
import { formatPesos } from "@/lib/money";

import { Badge } from "@/components/ui";

import {
  bpsToPercentLabel,
  recipeCostBadge,
} from "@/features/products/lib/recipe-cost-summary-view";

interface RecipeCostSummaryValues {
  status: "above_target" | "on_target";
  batchFoodCostCents: number;
  foodCostPerPortionCents: number;
  totalCostPerPortionCents: number;
  foodCostBps: number;
  suggestedMenuPriceCents: number;
  profitPerPortionCents: number;
}

interface RecipeCostSummaryProps {
  costSummary: RecipeCostSummaryValues | null;
  foodCostSettings: FoodCostSettings;
}

export function RecipeCostSummary({
  costSummary,
  foodCostSettings,
}: Readonly<RecipeCostSummaryProps>) {
  const badge = recipeCostBadge(costSummary?.status);

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="text-base font-medium">Live cost summary</h3>
        {badge ? <Badge variant={badge.variant}>{badge.label}</Badge> : null}
      </div>

      {costSummary ? (
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Batch food cost</dt>
            <dd className="font-medium">
              {formatPesos(costSummary.batchFoodCostCents)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Food cost / portion</dt>
            <dd className="font-medium">
              {formatPesos(costSummary.foodCostPerPortionCents)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Total cost / portion</dt>
            <dd className="font-medium">
              {formatPesos(costSummary.totalCostPerPortionCents)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Food cost % of menu price</dt>
            <dd className="font-medium">
              {bpsToPercentLabel(costSummary.foodCostBps)}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">
              Suggested menu price for{" "}
              {bpsToPercentLabel(foodCostSettings.targetFoodCostBps)} target food
              cost
            </dt>
            <dd className="font-medium">
              {formatPesos(costSummary.suggestedMenuPriceCents)}
            </dd>
            <p className="mt-1 text-xs text-muted-foreground">
              Advisory only. Your selling price above is not changed by this.
            </p>
          </div>
          <div>
            <dt className="text-muted-foreground">Profit / portion (net)</dt>
            <dd className="font-medium">
              {formatPesos(costSummary.profitPerPortionCents)}
            </dd>
          </div>
        </dl>
      ) : (
        <p className="text-sm text-muted-foreground">
          Add at least one valid ingredient or sub-recipe line to see costing.
        </p>
      )}
    </div>
  );
}
