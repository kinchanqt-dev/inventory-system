import { describe, expect, it } from "vitest";

import {
  contrastRatio,
  foregroundForBackground,
  isHexColor,
  isLightBackground,
  meetsAaContrast,
} from "@/lib/color-contrast";

describe("color-contrast", () => {
  it("validates hex colors", () => {
    expect(isHexColor("#1a1a1a")).toBe(true);
    expect(isHexColor("#fff")).toBe(false);
  });

  it("computes AA contrast for dark on light", () => {
    expect(meetsAaContrast("#000000", "#ffffff")).toBe(true);
    expect(contrastRatio("#000000", "#ffffff")).toBeGreaterThan(20);
  });

  it("picks readable foreground for brand backgrounds", () => {
    expect(foregroundForBackground("#1a1a1a")).toBe("#ffffff");
    expect(foregroundForBackground("#f5f5f5")).toBe("#000000");
    expect(foregroundForBackground("#a77b5b")).toBe("#ffffff");
  });

  it("detects light page backgrounds", () => {
    expect(isLightBackground("#f7f4ef")).toBe(true);
    expect(isLightBackground("#111111")).toBe(false);
  });
});
