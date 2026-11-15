import { describe, expect, it, vi } from "vitest";

import {
  bindRemoveBomLine,
  isFilledRecipeLine,
} from "@/lib/bom-line-list";

describe("bom-line-list", () => {
  it("detects filled recipe lines", () => {
    expect(
      isFilledRecipeLine({
        lineKind: "ingredient",
        ingredientId: "i1",
        subRecipeId: "",
      }),
    ).toBe(true);
    expect(
      isFilledRecipeLine({
        lineKind: "ingredient",
        ingredientId: "  ",
        subRecipeId: "",
      }),
    ).toBe(false);
    expect(
      isFilledRecipeLine({
        lineKind: "sub_recipe",
        ingredientId: "",
        subRecipeId: "s1",
      }),
    ).toBe(true);
  });

  it("binds remove helper", () => {
    const setLines = vi.fn((updater: (current: string[]) => string[]) => {
      expect(updater(["a", "b"])).toEqual(["b"]);
    });
    bindRemoveBomLine(setLines)(0);
    expect(setLines).toHaveBeenCalledOnce();
  });
});
