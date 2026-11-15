import { formatPesos } from "@/lib/money";
import { PAYMENT_METHOD_LABELS } from "@/enums";

import { ReceiptOptionalRows } from "@/features/sales/components/receipt-optional-rows";

import type { PaymentMethodValue } from "@/enums";
import type { SaleReceiptData } from "@/features/sales/types/sale-receipt.types";

function paymentLabel(method: string) {
  return PAYMENT_METHOD_LABELS[method as PaymentMethodValue] ?? method;
}

export function ReceiptTotals({ receipt }: Readonly<{ receipt: SaleReceiptData }>) {
  return (
    <dl className="space-y-1.5 text-sm">
      <div className="flex justify-between gap-4">
        <dt className="text-muted-foreground">Subtotal</dt>
        <dd className="tabular-nums">{formatPesos(receipt.subtotalCents)}</dd>
      </div>
      {receipt.discountCents > 0 ? (
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Discount</dt>
          <dd className="tabular-nums">−{formatPesos(receipt.discountCents)}</dd>
        </div>
      ) : null}
      <div className="flex justify-between gap-4 border-t pt-2 text-base font-semibold">
        <dt>Total</dt>
        <dd className="tabular-nums">{formatPesos(receipt.totalCents)}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-muted-foreground">Payment</dt>
        <dd>{paymentLabel(receipt.paymentMethod)}</dd>
      </div>
      <ReceiptOptionalRows receipt={receipt} />
    </dl>
  );
}