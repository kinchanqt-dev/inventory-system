import { createClient } from "@/lib/supabase/server";

import { organizationUpdatePayload } from "@/features/settings/lib/organization-update-payload";
import { readSettingsFormData } from "@/features/settings/lib/settings-form-payload";
import { resolveLogoPath } from "@/features/settings/lib/resolve-logo-path";

import type { Organization } from "@/types/database.types";
import type { z } from "zod";
import type { settingsSchema } from "@/features/settings/schemas/settings.schema";

type SettingsValues = z.infer<typeof settingsSchema>;

async function persistOrganizationSettings(
  orgId: string,
  values: SettingsValues,
  logoPath: string | null,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("organizations")
    .update(organizationUpdatePayload(values, logoPath))
    .eq("id", orgId);

  if (error) {
    return { error: error.message };
  }

  return { success: true as const };
}

function settingsValidationError(
  issues: { message: string }[],
): { error: string } {
  const first = issues[0];
  if (first) {
    return { error: first.message };
  }
  return { error: "Invalid settings" };
}

function logoPathForSettingsUpdate(
  formData: FormData,
  orgId: string,
  currentLogoPath: Organization["logo_path"],
  values: SettingsValues,
) {
  const removeLogo = values.removeLogo === true;
  return resolveLogoPath(formData, orgId, currentLogoPath, removeLogo);
}

export async function updateShopSettingsFromForm(
  formData: FormData,
  orgId: string,
  currentLogoPath: Organization["logo_path"],
) {
  const parsed = readSettingsFormData(formData);
  if (!parsed.success) {
    return settingsValidationError(parsed.error.issues);
  }

  const logoResult = await logoPathForSettingsUpdate(
    formData,
    orgId,
    currentLogoPath,
    parsed.data,
  );
  if ("error" in logoResult) {
    return { error: logoResult.error };
  }

  return persistOrganizationSettings(orgId, parsed.data, logoResult.logoPath);
}