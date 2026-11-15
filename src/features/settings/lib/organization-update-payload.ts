import { settingsSchema } from "@/features/settings/schemas/settings.schema";

import type { z } from "zod";

type SettingsValues = z.infer<typeof settingsSchema>;

export function organizationUpdatePayload(
  parsed: SettingsValues,
  logoPath: string | null,
) {
  return {
    shop_title: parsed.shopTitle,
    name: parsed.shopTitle,
    tagline: parsed.tagline || null,
    primary_color: parsed.primaryColor,
    accent_color: parsed.accentColor,
    background_color: parsed.backgroundColor,
    logo_path: logoPath,
    currency_symbol: parsed.currencySymbol,
    sales_tax_bps: Math.round(parsed.salesTaxPercent * 100),
    prices_include_tax: parsed.pricesIncludeTax,
    target_food_cost_bps: Math.round(parsed.targetFoodCostPercent * 100),
    dashboard_year: parsed.dashboardYear,
  };
}