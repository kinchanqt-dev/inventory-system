import { describe, expect, it } from "vitest";

import {
  DEFAULT_BRANDING,
  normalizeBranding,
} from "@/features/settings/lib/normalize-branding";

describe("normalizeBranding", () => {
  it("returns defaults for empty input", () => {
    expect(normalizeBranding(null)).toEqual({
      ...DEFAULT_BRANDING,
      logoPath: null,
    });
  });

  it("applies overrides and trims titles", () => {
    expect(
      normalizeBranding({
        shopTitle: "  Cafe  ",
        salesTaxPercent: 12,
        pricesIncludeTax: false,
        logoPath: "/logo.png",
      }),
    ).toMatchObject({
      shopTitle: "Cafe",
      salesTaxPercent: 12,
      pricesIncludeTax: false,
      logoPath: "/logo.png",
      currencySymbol: DEFAULT_BRANDING.currencySymbol,
    });
  });
});
