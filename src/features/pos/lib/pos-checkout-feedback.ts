import { formatPesos } from "@/lib/money";
import { PAYMENT_METHOD_LABELS } from "@/enums";

import type { PaymentMethodValue } from "@/enums";
import type { checkoutAction } from "@/features/pos/api/pos.actions";
import type { SaleReceiptData } from "@/features/sales/types/sale-receipt.types";

type CheckoutSale = NonNullable<
  Awaited<ReturnType<typeof checkoutAction>>["sale"]
>;

function paymentMethodLabel(method: string | undefined) {
  if (!method) {
    return "";
  }
  return PAYMENT_METHOD_LABELS[method as PaymentMethodValue] ?? method;
}

export function posCheckoutSuccessMessage(sale: {
  saleNumber?: string;
  totalCents?: number;
  paymentMethod?: string;
}) {
  const total = formatPesos(sale.totalCents ?? 0);
  const method = paymentMethodLabel(sale.paymentMethod);
  return `Sale ${sale.saleNumber} recorded · ${total} via ${method}`;
}

export function receiptFromCheckoutSale(sale: CheckoutSale): SaleReceiptData {
  return {
    saleNumber: sale.saleNumber,
    status: sale.status,
    createdAt: sale.createdAt,
    subtotalCents: sale.subtotalCents,
    discountCents: sale.discountCents,
    totalCents: sale.totalCents,
    paymentMethod: sale.paymentMethod,
    paymentNote: sale.paymentNote,
    amountTenderedCents: sale.amountTenderedCents,
    changeCents: sale.changeCents,
    kitchenTicketNumber: sale.kitchenTicketNumber ?? null,
    items: sale.items,
  };
}
