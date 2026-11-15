import { resolveActiveOrganization, getAuthUser } from "@/lib/session";

import {
  brandingFromOrganization,
  defaultShopBranding,
} from "@/features/settings/lib/resolve-shop-branding";

import type { ShopBranding } from "@/features/settings/types/settings.types";

/** Branding for the active organization, or defaults when logged out. */
export async function getShopBranding(): Promise<ShopBranding> {
  const user = await getAuthUser();
  if (!user) {
    return defaultShopBranding();
  }

  const active = await resolveActiveOrganization(user.id);
  if (!active) {
    return defaultShopBranding();
  }

  return brandingFromOrganization(active.organization);
}