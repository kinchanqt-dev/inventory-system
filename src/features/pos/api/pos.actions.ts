"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

import {
  buildSaleLines,
  resolveCashTotals,
} from "@/features/pos/lib/build-sale-lines";
import { checkoutSchema } from "@/features/pos/schemas/checkout.schema";

import type { CheckoutInput } from "@/features/pos/schemas/checkout.schema";

function buildSaleNumber(date = new Date()) {
  const stamp = date
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  const suffix = Math.floor(Math.random() * 900 + 100);
  return `S${stamp}${suffix}`;
}

export async function checkoutAction(input: CheckoutInput) {
  const session = await requireSession();
  const parsed = checkoutSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Could not complete the sale",
    };
  }

  const { items, paymentMethod, paymentNote, amountTenderedCents, discountCents } =
    parsed.data;

  try {
    const sale = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: {
          id: { in: items.map((item) => item.productId) },
          isActive: true,
        },
        include: { stock: true },
      });

      const { lineItems, subtotalCents } = buildSaleLines(items, products);
      const { totalCents, changeCents } = resolveCashTotals({
        paymentMethod,
        subtotalCents,
        discountCents,
        amountTenderedCents,
      });

      const createdSale = await tx.sale.create({
        data: {
          saleNumber: buildSaleNumber(),
          status: "COMPLETED",
          subtotalCents,
          discountCents,
          totalCents,
          paymentMethod,
          paymentNote: paymentNote || null,
          amountTenderedCents:
            paymentMethod === "CASH" ? amountTenderedCents ?? totalCents : null,
          changeCents,
          cashierId: session.user.id,
          items: {
            create: lineItems.map(({ product, quantity, lineTotalCents }) => ({
              productId: product.id,
              productName: product.name,
              productSku: product.sku,
              quantity,
              unitPriceCents: product.priceCents,
              lineTotalCents,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      await Promise.all(
        lineItems.flatMap(({ product, quantity }) => [
          tx.stockItem.update({
            where: { productId: product.id },
            data: {
              quantity: {
                decrement: quantity,
              },
            },
          }),
          tx.stockMovement.create({
            data: {
              productId: product.id,
              type: "SALE",
              quantity,
              reason: `Sale ${createdSale.saleNumber}`,
              userId: session.user.id,
              saleId: createdSale.id,
            },
          }),
        ]),
      );

      return createdSale;
    });

    revalidatePath("/pos");
    revalidatePath("/inventory");
    revalidatePath("/products");
    revalidatePath("/sales");
    revalidatePath("/");

    return {
      success: true,
      sale: {
        id: sale.id,
        saleNumber: sale.saleNumber,
        totalCents: sale.totalCents,
        paymentMethod: sale.paymentMethod,
        changeCents: sale.changeCents,
      },
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Checkout failed",
    };
  }
}
