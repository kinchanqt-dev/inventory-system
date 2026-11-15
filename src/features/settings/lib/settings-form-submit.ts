import { updateShopSettingsAction } from "@/features/settings/api/settings.actions";

export async function submitShopSettings(formData: FormData) {
  const result = await updateShopSettingsAction(formData);
  if (result?.error) {
    return { error: result.error ?? "Could not save settings" } as const;
  }
  return { message: "Shop look saved" } as const;
}