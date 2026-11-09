import type { ShopBranding } from "@/features/settings/types/settings.types";

export const DEFAULT_BRANDING: ShopBranding = {
  shopTitle: "Inventory POS",
  tagline: "Local Food",
  logoPath: null,
  primaryColor: "#1a1a1a",
  accentColor: "#2f5d50",
  backgroundColor: "#f7f4ef",
};

export function normalizeBranding(
  branding: Partial<ShopBranding> | null | undefined,
): ShopBranding {
  return {
    shopTitle: branding?.shopTitle?.trim() || DEFAULT_BRANDING.shopTitle,
    tagline: branding?.tagline ?? DEFAULT_BRANDING.tagline,
    logoPath: branding?.logoPath ?? null,
    primaryColor: branding?.primaryColor || DEFAULT_BRANDING.primaryColor,
    accentColor: branding?.accentColor || DEFAULT_BRANDING.accentColor,
    backgroundColor:
      branding?.backgroundColor || DEFAULT_BRANDING.backgroundColor,
  };
}
