import Link from "next/link";
import { format } from "date-fns";

import { formatPesos } from "@/lib/money";

import { DataListCard } from "@/components/shared";
import { Badge, Button } from "@/components/ui";

import { SalesListCardPayment } from "@/features/sales/components/sales-list-card-payment";
import { saleCompletedBadge } from "@/features/sales/lib/sale-status-badge";

import type { UiSale } from "@/lib/mappers";

interface SalesListCardProps {
  sale: UiSale;
  paymentLabel: (method: string) => string;
  onOpenReceipt: (sale: UiSale) => void;
}

export function SalesListCard({
  sale,
  paymentLabel,
  onOpenReceipt,
}: Readonly<SalesListCardProps>) {
  const statusBadge = saleCompletedBadge(sale.status);

  return (
    <DataListCard>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-xs text-muted-foreground">
            {sale.saleNumber}
          </p>
          <p className="font-medium tabular-nums">
            {formatPesos(sale.totalCents)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {format(sale.createdAt, "MMM d, yyyy h:mm a")}
          </p>
        </div>
        <Badge variant={statusBadge.variant}>{sale.status}</Badge>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <SalesListCardPayment sale={sale} paymentLabel={paymentLabel} />
      </dl>

      <Button
        type="button"
        variant="outline"
        className="min-h-11 w-full"
        onClick={() => onOpenReceipt(sale)}
      >
        View receipt
      </Button>
    </DataListCard>
  );
}

export function SalesListEmptyCards({
  emptyState,
  query,
}: Readonly<{
  emptyState: "none" | "no-match";
  query: string;
}>) {
  if (emptyState === "none") {
    return (
      <div className="space-y-3 rounded-lg border border-dashed py-10 text-center">
        <p className="text-sm text-muted-foreground">No sales recorded yet</p>
        <Button
          nativeButton={false}
          render={<Link href="/pos" />}
          className="min-h-11"
        >
          Open POS
        </Button>
      </div>
    );
  }

  return (
    <p className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
      No sales match “{query.trim()}”
    </p>
  );
}