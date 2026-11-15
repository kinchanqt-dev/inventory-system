import { Badge } from "@/components/ui";

import { SalesListCardChange } from "@/features/sales/components/sales-list-card-change";
import { saleItemCount } from "@/features/sales/lib/sale-item-count";

import type { UiSale } from "@/lib/mappers";

interface SalesListCardPaymentProps {
  sale: UiSale;
  paymentLabel: (method: string) => string;
}

function staffName(sale: UiSale) {
  if (sale.cashier?.name) {
    return sale.cashier.name;
  }
  return "Staff";
}

export function SalesListCardPayment({
  sale,
  paymentLabel,
}: Readonly<SalesListCardPaymentProps>) {
  return (
    <>
      <div>
        <dt className="text-xs text-muted-foreground">Staff</dt>
        <dd>{staffName(sale)}</dd>
      </div>
      <div>
        <dt className="text-xs text-muted-foreground">Items</dt>
        <dd className="tabular-nums">{saleItemCount(sale.items)}</dd>
      </div>
      <div className="col-span-2">
        <dt className="text-xs text-muted-foreground">Payment</dt>
        <dd className="mt-1 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{paymentLabel(sale.paymentMethod)}</Badge>
          {sale.paymentNote ? (
            <span className="text-xs text-muted-foreground">
              {sale.paymentNote}
            </span>
          ) : null}
        </dd>
      </div>
      {sale.changeCents != null ? (
        <SalesListCardChange changeCents={sale.changeCents} />
      ) : null}
    </>
  );
}