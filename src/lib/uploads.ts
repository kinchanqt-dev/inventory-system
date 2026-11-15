import { createClient } from "@/lib/supabase/server";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_BYTES = 2 * 1024 * 1024;
const BUCKET = "uploads";

export type UploadKind = "branding" | "products";

function extensionForMime(mime: string): string | null {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return null;
}

function publicUrlForStoragePath(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}

function isAbsoluteOrLocalUploadPath(path: string) {
  return (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("/uploads/")
  );
}

export function resolveImageSrc(path: string | null | undefined): string | null {
  if (!path) {
    return null;
  }
  if (isAbsoluteOrLocalUploadPath(path)) {
    return path;
  }
  return publicUrlForStoragePath(path);
}

function validateImageFile(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return "Image must be PNG, JPEG, or WebP";
  }
  if (file.size <= 0 || file.size > MAX_BYTES) {
    return "Image must be under 2MB";
  }
  return null;
}

export async function saveUploadedImage(
  file: File,
  organizationId: string,
  kind: UploadKind,
  basename: string,
): Promise<{ path: string } | { error: string }> {
  const validationError = validateImageFile(file);
  if (validationError) {
    return { error: validationError };
  }

  const extension = extensionForMime(file.type);
  if (!extension) {
    return { error: "Unsupported image type" };
  }

  const storagePath = `${organizationId}/${kind}/${basename}.${extension}`;
  const supabase = await createClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, {
    contentType: file.type,
    upsert: true,
  });

  if (error) {
    return { error: error.message };
  }

  return { path: storagePath };
}

export async function removeUploadedImage(storagePath: string | null | undefined) {
  if (!storagePath) {
    return;
  }

  // Skip legacy local paths and absolute URLs.
  if (storagePath.startsWith("http") || storagePath.startsWith("/")) {
    return;
  }

  const supabase = await createClient();
  await supabase.storage.from(BUCKET).remove([storagePath]);
}

export function getImageFile(formData: FormData, fieldName: string): File | null {
  const value = formData.get(fieldName);
  if (!(value instanceof File) || value.size === 0) {
    return null;
  }
  return value;
}
