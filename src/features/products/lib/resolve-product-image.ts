import {
  getImageFile,
  removeUploadedImage,
  saveUploadedImage,
} from "@/lib/uploads";

async function clearExistingImage(
  removeImage: boolean,
  currentPath: string | null,
) {
  if (!removeImage || !currentPath) {
    return currentPath;
  }
  await removeUploadedImage(currentPath);
  return null;
}

async function uploadProductImage(
  imageFile: File,
  organizationId: string,
  productId: string,
  previousPath: string | null,
) {
  const saved = await saveUploadedImage(
    imageFile,
    organizationId,
    "products",
    productId,
  );
  if ("error" in saved) {
    return { error: saved.error } as const;
  }
  if (previousPath && previousPath !== saved.path) {
    await removeUploadedImage(previousPath);
  }
  return { imagePath: saved.path } as const;
}

export async function resolveProductImagePath(
  formData: FormData,
  organizationId: string,
  productId: string,
  currentPath: string | null,
) {
  const removeImage = formData.get("removeImage") === "true";
  const imageFile = getImageFile(formData, "image");

  let imagePath = await clearExistingImage(removeImage, currentPath);

  if (!imageFile) {
    return { imagePath } as const;
  }

  return await uploadProductImage(
    imageFile,
    organizationId,
    productId,
    imagePath,
  );
}