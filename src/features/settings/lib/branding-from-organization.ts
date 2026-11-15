import { resolveImageSrc } from "@/lib/uploads";

import {
  DEFAULT_BRANDING,
  normalizeBranding,
} from "@/features/settings/lib/normalize-branding";

import type { ShopBranding } from "@/features/settings/types/settings.types";
import type { Organization } from "@/types/database.types";

function orgPercentFromBps(bps: number | null | undefined, fallback: number) {
  return (bps ?? fallback) / 100;
}

export function brandingFromOrganization(org: Organization): ShopBranding {
  return normalizeBranding({
    shopTitle: org.shop_title,
    tagline: org.tagline,
    logoPath: resolveImageSrc(org.logo_path),
    primaryColor: org.primary_color,
    accentColor: org.accent_color,
    backgroundColor: org.background_color,
    currencySymbol: org.currency_symbol,
    salesTaxPercent: orgPercentFromBps(org.sales_tax_bps, 0),
    pricesIncludeTax: org.prices_include_tax ?? true,
    targetFoodCostPercent: orgPercentFromBps(org.target_food_cost_bps, 3300),
    dashboardYear: org.dashboard_year ?? new Date().getFullYear(),
  });
}

export function defaultShopBranding(): ShopBranding {
  return DEFAULT_BRANDING;
}