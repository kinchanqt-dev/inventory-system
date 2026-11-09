import { cacheLife, cacheTag } from "next/cache";

import { prisma } from "@/lib/prisma";

import {
  DEFAULT_BRANDING,
  normalizeBranding,
} from "@/features/settings/lib/normalize-branding";

import type { ShopBranding } from "@/features/settings/types/settings.types";

export const SHOP_BRANDING_CACHE_TAG = "shop-branding";

async function readShopBranding(): Promise<ShopBranding> {
  "use cache";
  cacheTag(SHOP_BRANDING_CACHE_TAG);
  cacheLife("hours");

  const settings = await prisma.shopSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    return DEFAULT_BRANDING;
  }

  return normalizeBranding({
    shopTitle: settings.shopTitle,
    tagline: settings.tagline,
    logoPath: settings.logoPath,
    primaryColor: settings.primaryColor,
    accentColor: settings.accentColor,
    backgroundColor: settings.backgroundColor,
  });
}

/** Always normalize so stale cache entries without newer fields stay safe. */
export async function getShopBranding(): Promise<ShopBranding> {
  return normalizeBranding(await readShopBranding());
}
