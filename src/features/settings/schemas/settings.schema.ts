import { z } from "zod";

import { isHexColor, isLightBackground } from "@/lib/color-contrast";

import { DEFAULT_CURRENCY_SYMBOL } from "@/features/settings/lib/supported-currencies";

const hexColor = (label: string) =>
  z
    .string()
    .trim()
    .refine(isHexColor, `${label} must be a 6-digit color code`);

export const settingsSchema = z.object({
  shopTitle: z.string().trim().min(1, "Shop name is required").max(80),
  tagline: z.string().trim().max(80).optional(),
  primaryColor: hexColor("Main button color"),
  accentColor: hexColor("Highlight color"),
  backgroundColor: hexColor("Page background").refine(
    isLightBackground,
    "Page background should stay light so text is easy to read",
  ),
  removeLogo: z.boolean().optional(),
  currencySymbol: z.enum(["₱"]).default(DEFAULT_CURRENCY_SYMBOL),
  salesTaxPercent: z.coerce.number().min(0).max(100).default(0),
  pricesIncludeTax: z.coerce.boolean().default(true),
  targetFoodCostPercent: z.coerce.number().min(1).max(100).default(33),
  dashboardYear: z.coerce
    .number()
    .int()
    .min(2020)
    .max(2100)
    .default(new Date().getFullYear()),
});
