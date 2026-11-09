import { foregroundForBackground, isHexColor } from "@/lib/color-contrast";

import { normalizeBranding } from "@/features/settings/lib/normalize-branding";

import type { ShopBranding } from "@/features/settings/types/settings.types";

function safeBrandColor(value: string, fallback: string): string {
  return isHexColor(value) ? value.trim() : fallback;
}

/**
 * Brand colors as custom properties so light/dark tokens can reference them
 * without inline styles permanently overriding `.dark` surface tokens.
 */
export function brandingCssVariables(
  branding: ShopBranding,
): Record<string, string> {
  const safe = normalizeBranding(branding);
  const primaryColor = safeBrandColor(safe.primaryColor, "#1a1a1a");
  const accentColor = safeBrandColor(safe.accentColor, "#2f5d50");
  const backgroundColor = safeBrandColor(safe.backgroundColor, "#f7f4ef");

  return {
    "--brand-primary": primaryColor,
    "--brand-primary-foreground": foregroundForBackground(primaryColor),
    "--brand-accent": accentColor,
    "--brand-accent-foreground": foregroundForBackground(accentColor),
    "--brand-background": backgroundColor,
    "--brand-foreground": foregroundForBackground(backgroundColor),
  };
}
