import { buildTimedDocumentNumber } from "@/lib/document-number";

import type { CheckoutInput } from "@/features/pos/schemas/checkout.schema";

interface SaleRecordInput {
  orgId: string;
  cashierId: string;
  paymentMethod: CheckoutInput["paymentMethod"];
  paymentNote?: string;
  amountTenderedCents?: number;
  discountCents: number;
  subtotalCents: number;
  totalCents: number;
  changeCents: number | null;
}

function tenderedCentsForSale(input: SaleRecordInput) {
  if (input.paymentMethod !== "CASH") {
    return null;
  }
  return input.amountTenderedCents ?? input.totalCents;
}

export function buildSaleRecordRow(input: SaleRecordInput) {
  return {
    organization_id: input.orgId,
    sale_number: buildTimedDocumentNumber("S"),
    status: "COMPLETED" as const,
    subtotal_cents: input.subtotalCents,
    discount_cents: input.discountCents,
    total_cents: input.totalCents,
    payment_method: input.paymentMethod,
    payment_note: input.paymentNote || null,
    amount_tendered_cents: tenderedCentsForSale(input),
    change_cents: input.changeCents,
    cashier_id: input.cashierId,
  };
}