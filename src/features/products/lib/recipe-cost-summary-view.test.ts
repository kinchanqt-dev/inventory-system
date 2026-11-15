import { describe, expect, it } from "vitest";

import {
  bpsToPercentLabel,
  recipeCostBadge,
} from "@/features/products/lib/recipe-cost-summary-view";

describe("recipe cost summary view helpers", () => {
  it("formats bps as percent labels", () => {
    expect(bpsToPercentLabel(3300)).toBe("33.0%");
  });

  it("builds badge copy", () => {
    expect(recipeCostBadge(null)).toBeNull();
    expect(recipeCostBadge("above_target")).toEqual({
      variant: "destructive",
      label: "Above target food cost",
    });
    expect(recipeCostBadge("on_target")).toEqual({
      variant: "secondary",
      label: "On target",
    });
  });
});
