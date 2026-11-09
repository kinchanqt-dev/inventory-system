import { describe, expect, it } from "vitest";

import { centsToPesos, formatPesos, pesosToCents } from "@/lib/money";

describe("money helpers", () => {
  it("converts pesos to cents", () => {
    expect(pesosToCents(12.5)).toBe(1250);
    expect(pesosToCents("99.99")).toBe(9999);
  });

  it("converts cents to pesos", () => {
    expect(centsToPesos(1250)).toBe(12.5);
  });

  it("formats pesos for PH locale", () => {
    expect(formatPesos(1250)).toContain("12.50");
  });
});
