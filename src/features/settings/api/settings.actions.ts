"use server";

import { revalidatePath, updateTag } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import {
  getImageFile,
  removeUploadedImage,
  saveUploadedImage,
} from "@/lib/uploads";

import { SHOP_BRANDING_CACHE_TAG } from "@/features/settings/api/settings.queries";
import { settingsSchema } from "@/features/settings/schemas/settings.schema";

function revalidateBrandingPaths() {
  updateTag(SHOP_BRANDING_CACHE_TAG);
  revalidatePath("/", "layout");
  revalidatePath("/settings");
  revalidatePath("/login");
  revalidatePath("/pos");
}

export async function updateShopSettingsAction(formData: FormData) {
  await requireRole(["OWNER"]);

  const parsed = settingsSchema.safeParse({
    shopTitle: formData.get("shopTitle"),
    tagline: formData.get("tagline") || undefined,
    primaryColor: formData.get("primaryColor"),
    accentColor: formData.get("accentColor"),
    backgroundColor: formData.get("backgroundColor"),
    removeLogo: formData.get("removeLogo") === "true",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid settings" };
  }

  const existing = await prisma.shopSettings.findUnique({
    where: { id: "default" },
  });

  let logoPath = existing?.logoPath ?? null;
  const logoFile = getImageFile(formData, "logo");

  if (parsed.data.removeLogo && logoPath) {
    await removeUploadedImage(logoPath);
    logoPath = null;
  }

  if (logoFile) {
    const saved = await saveUploadedImage(logoFile, "branding", "logo");
    if ("error" in saved) {
      return { error: saved.error };
    }
    if (logoPath && logoPath !== saved.path) {
      await removeUploadedImage(logoPath);
    }
    logoPath = saved.path;
  }

  await prisma.shopSettings.upsert({
    where: { id: "default" },
    update: {
      shopTitle: parsed.data.shopTitle,
      tagline: parsed.data.tagline || null,
      primaryColor: parsed.data.primaryColor,
      accentColor: parsed.data.accentColor,
      backgroundColor: parsed.data.backgroundColor,
      logoPath,
    },
    create: {
      id: "default",
      shopTitle: parsed.data.shopTitle,
      tagline: parsed.data.tagline || null,
      primaryColor: parsed.data.primaryColor,
      accentColor: parsed.data.accentColor,
      backgroundColor: parsed.data.backgroundColor,
      logoPath,
    },
  });

  revalidateBrandingPaths();
  return { success: true };
}
