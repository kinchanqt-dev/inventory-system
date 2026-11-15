import { format } from "date-fns";

import { formatPesos } from "@/lib/money";
import { cn } from "@/lib/utils";

import { ReceiptTotals } from "@/features/sales/components/receipt-totals";

import type { SaleReceiptData } from "@/features/sales/types/sale-receipt.types";

interface SaleReceiptProps {
  receipt: SaleReceiptData;
  shopName: string;
  className?: string;
}

function receiptDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  return format(date, "MMM d, yyyy h:mm a");
}

export function SaleReceipt({
  receipt,
  shopName,
  className,
}: Readonly<SaleReceiptProps>) {
  return (
    <div
      data-sale-receipt-print
      className={cn("space-y-4 text-foreground", className)}
    >
      <header className="space-y-1 text-center">
        <p className="text-base font-semibold tracking-tight">{shopName}</p>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          E-receipt
        </p>
        <p className="font-mono text-sm">{receipt.saleNumber}</p>
        <p className="text-xs text-muted-foreground">
          {receiptDate(receipt.createdAt)}
        </p>
        {receipt.cashierName ? (
          <p className="text-xs text-muted-foreground">
            Cashier · {receipt.cashierName}
          </p>
        ) : null}
        {receipt.kitchenTicketNumber ? (
          <p className="text-xs text-muted-foreground">
            Kitchen · {receipt.kitchenTicketNumber}
          </p>
        ) : null}
      </header>

      <ul className="divide-y border-y">
        {receipt.items.map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-3 py-2.5">
            <div className="min-w-0">
              <p className="font-medium">{item.productName}</p>
              <p className="text-xs text-muted-foreground">
                {item.quantity} × {formatPesos(item.unitPriceCents)}
                {item.productSku ? ` · ${item.productSku}` : ""}
              </p>
            </div>
            <p className="shrink-0 tabular-nums">
              {formatPesos(item.lineTotalCents)}
            </p>
          </li>
        ))}
      </ul>

      <ReceiptTotals receipt={receipt} />
    </div>
  );
}
