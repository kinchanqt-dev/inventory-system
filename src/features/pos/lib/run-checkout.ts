import { createKitchenTicketForSale } from "@/features/kitchen/api/kitchen.actions";
import {
  buildSaleLines,
  resolveCashTotals,
} from "@/features/pos/lib/build-sale-lines";
import { deductCheckoutStock } from "@/features/pos/lib/checkout-stock";
import { createCompletedSale } from "@/features/pos/lib/create-completed-sale";

import type { createClient } from "@/lib/supabase/server";
import type { CheckoutInput } from "@/features/pos/schemas/checkout.schema";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

interface CheckoutProduct {
  id: string;
  name: string;
  sku: string;
  priceCents: number;
  sendsToKitchen: boolean;
  stock: { quantity: number } | null;
}

interface RunCheckoutInput {
  supabase: SupabaseClient;
  orgId: string;
  cashierId: string;
  products: CheckoutProduct[];
  parsed: CheckoutInput;
}

function kitchenTicketNumberFromResult(
  kitchenResult: Awaited<ReturnType<typeof createKitchenTicketForSale>>,
) {
  if ("ticketNumber" in kitchenResult) {
    return kitchenResult.ticketNumber;
  }
  return undefined;
}

export async function runCheckout(input: RunCheckoutInput) {
  const {
    items,
    paymentMethod,
    paymentNote,
    amountTenderedCents,
    discountCents,
  } = input.parsed;

  const productById = new Map(
    input.products.map((product) => [product.id, product]),
  );
  const { lineItems, subtotalCents } = buildSaleLines(items, input.products);
  const { totalCents, changeCents } = resolveCashTotals({
    paymentMethod,
    subtotalCents,
    discountCents,
    amountTenderedCents,
  });

  const { createdSale, insertedSaleItems } = await createCompletedSale({
    supabase: input.supabase,
    orgId: input.orgId,
    cashierId: input.cashierId,
    paymentMethod,
    paymentNote,
    amountTenderedCents,
    discountCents,
    subtotalCents,
    totalCents,
    changeCents,
    lineItems,
  });

  const kitchenResult = await createKitchenTicketForSale({
    orgId: input.orgId,
    saleId: createdSale.id,
    saleNumber: createdSale.sale_number,
    items: insertedSaleItems.map((row) => ({
      saleItemId: row.id,
      productId: row.product_id,
      productName: row.product_name,
      quantity: row.quantity,
      lineNote: row.line_note,
      sendsToKitchen: productById.get(row.product_id)?.sendsToKitchen ?? true,
    })),
  });

  if ("error" in kitchenResult) {
    throw new Error(kitchenResult.error);
  }

  await deductCheckoutStock({
    supabase: input.supabase,
    orgId: input.orgId,
    userId: input.cashierId,
    saleId: createdSale.id,
    saleNumber: createdSale.sale_number,
    lineItems,
  });

  return {
    id: createdSale.id,
    saleNumber: createdSale.sale_number,
    status: "COMPLETED" as const,
    subtotalCents: createdSale.subtotal_cents,
    discountCents: createdSale.discount_cents,
    totalCents: createdSale.total_cents,
    paymentMethod: createdSale.payment_method,
    paymentNote: createdSale.payment_note,
    amountTenderedCents: createdSale.amount_tendered_cents,
    changeCents: createdSale.change_cents,
    createdAt: createdSale.created_at,
    kitchenTicketNumber: kitchenTicketNumberFromResult(kitchenResult),
    items: insertedSaleItems.map((row) => ({
      id: row.id,
      productName: row.product_name,
      productSku: row.product_sku,
      quantity: row.quantity,
      unitPriceCents: row.unit_price_cents,
      lineTotalCents: row.line_total_cents,
    })),
  };
}
