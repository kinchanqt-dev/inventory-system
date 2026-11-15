import { describe, expect, it } from "vitest";

import {
  validateCatalogUnit,
  validateCompatibleUnits,
  validateKnownOrCatalogUnit,
} from "@/lib/food-cost/unit-validation";

describe("unit validation", () => {
  it("accepts lean catalog units", () => {
    expect(validateCatalogUnit("kg")).toBeNull();
    expect(validateCatalogUnit("ml")).toBeNull();
    expect(validateCatalogUnit("pc")).toBeNull();
  });

  it("rejects unknown catalog codes", () => {
    expect(validateCatalogUnit("bucket")).toMatch(/Unknown unit/i);
  });

  it("allows legacy codes as known units", () => {
    expect(validateKnownOrCatalogUnit("oz")).toBeNull();
    expect(validateKnownOrCatalogUnit("lb")).toBeNull();
  });

  it("rejects incompatible kinds", () => {
    expect(validateCompatibleUnits("g", "ml")).toMatch(/different measurement/i);
    expect(validateCompatibleUnits("180 g", "kg")).toMatch(/Unknown unit/i);
    expect(validateCompatibleUnits("g", "kg")).toBeNull();
  });
});
