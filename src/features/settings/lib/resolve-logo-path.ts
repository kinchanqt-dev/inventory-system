import {
  getImageFile,
  removeUploadedImage,
  saveUploadedImage,
} from "@/lib/uploads";

async function clearExistingLogo(logoPath: string) {
  await removeUploadedImage(logoPath);
}

async function applyLogoRemoval(
  removeLogo: boolean,
  logoPath: string | null,
): Promise<string | null> {
  if (!removeLogo || !logoPath) {
    return logoPath;
  }
  await clearExistingLogo(logoPath);
  return null;
}

async function replaceStoredLogo(
  logoFile: File,
  orgId: string,
  currentLogoPath: string | null,
) {
  const logoBasename = `logo-${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}`;
  const saved = await saveUploadedImage(
    logoFile,
    orgId,
    "branding",
    logoBasename,
  );
  if ("error" in saved) {
    return { error: saved.error } as const;
  }
  if (currentLogoPath && currentLogoPath !== saved.path) {
    await removeUploadedImage(currentLogoPath);
  }
  return { logoPath: saved.path } as const;
}

export async function resolveLogoPath(
  formData: FormData,
  orgId: string,
  currentLogoPath: string | null,
  removeLogo: boolean,
) {
  let logoPath = await applyLogoRemoval(removeLogo, currentLogoPath);
  const logoFile = getImageFile(formData, "logo");

  if (!logoFile) {
    return { logoPath };
  }

  const saved = await replaceStoredLogo(logoFile, orgId, logoPath);
  if ("error" in saved) {
    return saved;
  }
  return { logoPath: saved.logoPath };
}