import type { ShopBranding } from "@/features/settings/types/settings.types";

export const DEFAULT_BRANDING: ShopBranding = {
  shopTitle: "Inventory POS",
  tagline: "Local Food",
  logoPath: null,
  primaryColor: "#1a2a24",
  accentColor: "#2f5d50",
  backgroundColor: "#f2f5f3",
  currencySymbol: "₱",
  salesTaxPercent: 0,
  pricesIncludeTax: true,
  targetFoodCostPercent: 33,
  dashboardYear: new Date().getFullYear(),
};

function trimmedString(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return fallback;
  }
  return trimmed;
}

function withOptional<T>(value: T | undefined, fallback: T): T {
  if (value === undefined) {
    return fallback;
  }
  return value;
}

function brandingOverrides(input: Partial<ShopBranding>): ShopBranding {
  return {
    shopTitle: trimmedString(input.shopTitle, DEFAULT_BRANDING.shopTitle),
    tagline: withOptional(input.tagline, DEFAULT_BRANDING.tagline),
    logoPath: withOptional(input.logoPath, DEFAULT_BRANDING.logoPath),
    primaryColor: trimmedString(input.primaryColor, DEFAULT_BRANDING.primaryColor),
    accentColor: trimmedString(input.accentColor, DEFAULT_BRANDING.accentColor),
    backgroundColor: trimmedString(
      input.backgroundColor,
      DEFAULT_BRANDING.backgroundColor,
    ),
    currencySymbol: trimmedString(
      input.currencySymbol,
      DEFAULT_BRANDING.currencySymbol,
    ),
    salesTaxPercent: withOptional(
      input.salesTaxPercent,
      DEFAULT_BRANDING.salesTaxPercent,
    ),
    pricesIncludeTax: withOptional(
      input.pricesIncludeTax,
      DEFAULT_BRANDING.pricesIncludeTax,
    ),
    targetFoodCostPercent: withOptional(
      input.targetFoodCostPercent,
      DEFAULT_BRANDING.targetFoodCostPercent,
    ),
    dashboardYear: withOptional(
      input.dashboardYear,
      DEFAULT_BRANDING.dashboardYear,
    ),
  };
}

export function normalizeBranding(
  branding: Partial<ShopBranding> | null | undefined,
): ShopBranding {
  return brandingOverrides(branding ?? {});
}
