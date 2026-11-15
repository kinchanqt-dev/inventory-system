import { describe, expect, it } from "vitest";

import { resolveSubRecipeFormDefaults } from "@/features/sub-recipes/lib/resolve-sub-recipe-form-defaults";

describe("resolveSubRecipeFormDefaults", () => {
  it("returns create defaults when sub-recipe is missing", () => {
    expect(resolveSubRecipeFormDefaults()).toEqual({
      name: "",
      batchQty: 1,
      batchUnit: "portion",
      notes: "",
    });
  });

  it("maps an existing sub-recipe", () => {
    expect(
      resolveSubRecipeFormDefaults({
        id: "sr-1",
        name: "Sauce",
        batchQty: 4,
        batchUnit: "L",
        notes: null,
        lines: [],
      }),
    ).toEqual({
      name: "Sauce",
      batchQty: 4,
      batchUnit: "L",
      notes: "",
    });
  });
});
