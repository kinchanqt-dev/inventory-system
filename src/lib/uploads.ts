import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_BYTES = 2 * 1024 * 1024;

export type UploadKind = "branding" | "products";

function extensionForMime(mime: string): string | null {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return null;
}

function publicPathFor(kind: UploadKind, filename: string): string {
  return `/uploads/${kind}/${filename}`;
}

function absolutePathFor(kind: UploadKind, filename: string): string {
  return path.join(process.cwd(), "public", "uploads", kind, filename);
}

export async function saveUploadedImage(
  file: File,
  kind: UploadKind,
  basename: string,
): Promise<{ path: string } | { error: string }> {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return { error: "Image must be PNG, JPEG, or WebP" };
  }

  if (file.size <= 0 || file.size > MAX_BYTES) {
    return { error: "Image must be under 2MB" };
  }

  const extension = extensionForMime(file.type);
  if (!extension) {
    return { error: "Unsupported image type" };
  }

  const filename = `${basename}.${extension}`;
  const directory = path.join(process.cwd(), "public", "uploads", kind);
  await mkdir(directory, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePathFor(kind, filename), buffer);

  return { path: publicPathFor(kind, filename) };
}

export async function removeUploadedImage(publicPath: string | null | undefined) {
  if (!publicPath?.startsWith("/uploads/")) {
    return;
  }

  const absolute = path.join(process.cwd(), "public", publicPath);
  try {
    await unlink(absolute);
  } catch {
    // File may already be gone
  }
}

export function getImageFile(formData: FormData, fieldName: string): File | null {
  const value = formData.get(fieldName);
  if (!(value instanceof File) || value.size === 0) {
    return null;
  }
  return value;
}
