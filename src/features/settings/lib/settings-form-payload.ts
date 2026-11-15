import { formDataBoolean, formDataString } from "@/lib/form-data-helpers";

import { settingsSchema } from "@/features/settings/schemas/settings.schema";

export function readSettingsFormData(formData: FormData) {
  const currentYear = new Date().getFullYear();

  return settingsSchema.safeParse({
    shopTitle: formData.get("shopTitle"),
    tagline: formDataString(formData, "tagline", "") || undefined,
    primaryColor: formData.get("primaryColor"),
    accentColor: formData.get("accentColor"),
    backgroundColor: formData.get("backgroundColor"),
    removeLogo: formDataBoolean(formData, "removeLogo"),
    currencySymbol: formDataString(formData, "currencySymbol", "₱"),
    salesTaxPercent: formDataString(formData, "salesTaxPercent", "0"),
    pricesIncludeTax: formDataBoolean(formData, "pricesIncludeTax"),
    targetFoodCostPercent: formDataString(
      formData,
      "targetFoodCostPercent",
      "33",
    ),
    dashboardYear: formDataString(
      formData,
      "dashboardYear",
      String(currentYear),
    ),
  });
}