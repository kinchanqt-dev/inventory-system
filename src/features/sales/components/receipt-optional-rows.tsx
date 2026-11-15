import { formatPesos } from "@/lib/money";

import type { SaleReceiptData } from "@/features/sales/types/sale-receipt.types";

export function ReceiptOptionalRows({
  receipt,
}: Readonly<{ receipt: SaleReceiptData }>) {
  return (
    <>
      {receipt.paymentNote ? (
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Note</dt>
          <dd className="text-right">{receipt.paymentNote}</dd>
        </div>
      ) : null}
      {receipt.amountTenderedCents != null ? (
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Tendered</dt>
          <dd className="tabular-nums">
            {formatPesos(receipt.amountTenderedCents)}
          </dd>
        </div>
      ) : null}
      {receipt.changeCents != null ? (
        <div className="flex justify-between gap-4 font-medium">
          <dt>Change</dt>
          <dd className="tabular-nums">{formatPesos(receipt.changeCents)}</dd>
        </div>
      ) : null}
    </>
  );
}