"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import {
  getImageFile,
  removeUploadedImage,
  saveUploadedImage,
} from "@/lib/uploads";

import {
  readProductFormData,
  toProductWriteData,
} from "@/features/products/lib/product-write-data";
import { productSchema } from "@/features/products/schemas/product.schema";

function revalidateCatalogPaths() {
  revalidatePath("/products");
  revalidatePath("/inventory");
  revalidatePath("/pos");
}

async function resolveProductImagePath(
  formData: FormData,
  productId: string,
  currentPath: string | null,
) {
  let imagePath = currentPath;
  const removeImage = formData.get("removeImage") === "true";
  const imageFile = getImageFile(formData, "image");

  if (removeImage && imagePath) {
    await removeUploadedImage(imagePath);
    imagePath = null;
  }

  if (imageFile) {
    const saved = await saveUploadedImage(imageFile, "products", productId);
    if ("error" in saved) {
      return { error: saved.error } as const;
    }
    if (imagePath && imagePath !== saved.path) {
      await removeUploadedImage(imagePath);
    }
    imagePath = saved.path;
  }

  return { imagePath } as const;
}

export async function createProductAction(formData: FormData) {
  await requireRole(["OWNER"]);

  const parsed = productSchema.safeParse(
    readProductFormData(formData, { includeQuantity: true }),
  );

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid product" };
  }

  try {
    const product = await prisma.product.create({
      data: {
        ...toProductWriteData(parsed.data),
        stock: {
          create: {
            quantity: parsed.data.quantity,
            reorderLevel: parsed.data.reorderLevel,
          },
        },
      },
    });

    const imageResult = await resolveProductImagePath(formData, product.id, null);
    if ("error" in imageResult) {
      return { error: imageResult.error };
    }

    if (imageResult.imagePath) {
      await prisma.product.update({
        where: { id: product.id },
        data: { imagePath: imageResult.imagePath },
      });
    }
  } catch {
    return {
      error: "Could not create product. Item code or product code may already be in use.",
    };
  }

  revalidateCatalogPaths();
  return { success: true };
}

export async function updateProductAction(productId: string, formData: FormData) {
  await requireRole(["OWNER"]);

  const parsed = productSchema
    .omit({ quantity: true })
    .safeParse(readProductFormData(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid product" };
  }

  try {
    const existing = await prisma.product.findUniqueOrThrow({
      where: { id: productId },
      select: { imagePath: true },
    });

    const imageResult = await resolveProductImagePath(
      formData,
      productId,
      existing.imagePath,
    );
    if ("error" in imageResult) {
      return { error: imageResult.error };
    }

    await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: {
          ...toProductWriteData(parsed.data),
          imagePath: imageResult.imagePath,
        },
      }),
      prisma.stockItem.update({
        where: { productId },
        data: {
          reorderLevel: parsed.data.reorderLevel,
        },
      }),
    ]);
  } catch {
    return { error: "Could not update product." };
  }

  revalidateCatalogPaths();
  return { success: true };
}

export async function toggleProductActiveAction(productId: string) {
  await requireRole(["OWNER"]);

  const product = await prisma.product.findUniqueOrThrow({
    where: { id: productId },
  });

  await prisma.product.update({
    where: { id: productId },
    data: { isActive: !product.isActive },
  });

  revalidatePath("/products");
  revalidatePath("/pos");
}
