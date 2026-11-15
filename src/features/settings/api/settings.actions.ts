"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/session";

import { updateShopSettingsFromForm } from "@/features/settings/lib/update-shop-settings";

function revalidateBrandingPaths() {
  revalidatePath("/", "layout");
  revalidatePath("/settings");
  revalidatePath("/login");
  revalidatePath("/pos");
}

export async function updateShopSettingsAction(formData: FormData) {
  const session = await requireRole(["OWNER"]);
  const result = await updateShopSettingsFromForm(
    formData,
    session.organization.id,
    session.organization.logo_path,
  );

  if ("error" in result) {
    return { error: result.error };
  }

  revalidateBrandingPaths();
  return { success: true };
}