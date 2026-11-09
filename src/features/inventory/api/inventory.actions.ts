"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

import { nextStockQuantity } from "@/features/inventory/lib/next-stock-quantity";
import { stockAdjustSchema } from "@/features/inventory/schemas/stock-adjust.schema";

export async function adjustStockAction(formData: FormData) {
  const session = await requireRole(["OWNER"]);

  const parsed = stockAdjustSchema.safeParse({
    productId: formData.get("productId"),
    type: formData.get("type"),
    quantity: formData.get("quantity"),
    reason: formData.get("reason"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid adjustment" };
  }

  const { productId, type, quantity, reason } = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      const stock = await tx.stockItem.findUnique({
        where: { productId },
      });

      if (!stock) {
        throw new Error("Stock record not found");
      }

      const updatedQuantity = nextStockQuantity({
        currentQuantity: stock.quantity,
        type,
        quantity,
      });

      if (updatedQuantity < 0) {
        throw new Error("Insufficient stock for this adjustment");
      }

      await tx.stockItem.update({
        where: { productId },
        data: { quantity: updatedQuantity },
      });

      await tx.stockMovement.create({
        data: {
          productId,
          type,
          quantity: type === "ADJUST" ? updatedQuantity : quantity,
          reason,
          userId: session.user.id,
        },
      });
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not adjust stock",
    };
  }

  revalidatePath("/inventory");
  revalidatePath("/products");
  revalidatePath("/pos");
  return { success: true };
}
