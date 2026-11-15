import Link from "next/link";
import { format } from "date-fns";

import { formatPesos } from "@/lib/money";

import { Badge, Button, TableCell, TableRow } from "@/components/ui";

import { saleItemCount } from "@/features/sales/lib/sale-item-count";
import { saleCompletedBadge } from "@/features/sales/lib/sale-status-badge";

import type { UiSale } from "@/lib/mappers";

interface SalesTableRowProps {
  sale: UiSale;
  paymentLabel: (method: string) => string;
  onOpenReceipt: (sale: UiSale) => void;
}

export function SalesTableRow({
  sale,
  paymentLabel,
  onOpenReceipt,
}: Readonly<SalesTableRowProps>) {
  const statusBadge = saleCompletedBadge(sale.status);

  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{sale.saleNumber}</TableCell>
      <TableCell>{format(sale.createdAt, "MMM d, yyyy h:mm a")}</TableCell>
      <TableCell>{sale.cashier?.name ?? "Staff"}</TableCell>
      <TableCell className="tabular-nums">
        {saleItemCount(sale.items)}
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{paymentLabel(sale.paymentMethod)}</Badge>
        {sale.paymentNote ? (
          <div className="mt-1 text-xs text-muted-foreground">
            {sale.paymentNote}
          </div>
        ) : null}
      </TableCell>
      <TableCell>
        <Badge variant={statusBadge.variant}>{sale.status}</Badge>
      </TableCell>
      <TableCell className="text-right font-medium tabular-nums">
        {formatPesos(sale.totalCents)}
      </TableCell>
      <TableCell className="text-right">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-11"
          onClick={() => onOpenReceipt(sale)}
        >
          Receipt
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function SalesTableEmptyRow({
  emptyState,
  query,
  columnCount,
}: Readonly<{
  emptyState: "none" | "no-match";
  query: string;
  columnCount: number;
}>) {
  if (emptyState === "none") {
    return (
      <TableRow>
        <TableCell colSpan={columnCount} className="py-10 text-center">
          <p className="mb-3 text-sm text-muted-foreground">
            No sales recorded yet
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/pos" />}
            className="min-h-11"
          >
            Open POS
          </Button>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell
        colSpan={columnCount}
        className="py-10 text-center text-sm text-muted-foreground"
      >
        No sales match “{query.trim()}”
      </TableCell>
    </TableRow>
  );
}