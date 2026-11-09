"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";

import { DEFAULT_LIST_PAGE_SIZE, paginateItems } from "@/lib/paginate";
import { formatPesos } from "@/lib/money";
import { PAYMENT_METHOD_LABELS } from "@/enums";

import {
  DataListCard,
  DataTableShell,
  ListPagination,
  ResponsiveDataList,
  TableSearchToolbar,
} from "@/components/shared";
import { Badge, Button, TableCell, TableRow } from "@/components/ui";

import type { PaymentMethodValue } from "@/enums";

interface SaleRow {
  id: string;
  saleNumber: string;
  status: string;
  totalCents: number;
  paymentMethod: PaymentMethodValue;
  paymentNote: string | null;
  createdAt: Date;
  cashier: { name: string };
  items: { quantity: number }[];
}

interface SalesTableProps {
  sales: SaleRow[];
}

const SALE_COLUMNS = [
  { label: "Sale #" },
  { label: "When" },
  { label: "Staff" },
  { label: "Items" },
  { label: "Payment" },
  { label: "Status" },
  { label: "Total", align: "right" as const },
];

function saleItemCount(items: { quantity: number }[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function SalesTable({ sales }: Readonly<SalesTableProps>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return sales;

    return sales.filter(
      (sale) =>
        sale.saleNumber.toLowerCase().includes(normalized) ||
        sale.cashier.name.toLowerCase().includes(normalized) ||
        PAYMENT_METHOD_LABELS[sale.paymentMethod]
          .toLowerCase()
          .includes(normalized),
    );
  }, [sales, query]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const pageItems = paginateItems(filtered, page, DEFAULT_LIST_PAGE_SIZE);

  let emptyState: "none" | "no-match" | null = null;
  if (sales.length === 0) {
    emptyState = "none";
  } else if (filtered.length === 0) {
    emptyState = "no-match";
  }

  const emptyTable = emptyState === "none" ? (
    <TableRow>
      <TableCell colSpan={SALE_COLUMNS.length} className="py-10 text-center">
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
  ) : (
    <TableRow>
      <TableCell
        colSpan={SALE_COLUMNS.length}
        className="py-10 text-center text-sm text-muted-foreground"
      >
        No sales match “{query.trim()}”
      </TableCell>
    </TableRow>
  );

  const emptyCards = emptyState === "none" ? (
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
  ) : (
    <p className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
      No sales match “{query.trim()}”
    </p>
  );

  const tableBody = emptyState
    ? emptyTable
    : pageItems.map((sale) => (
        <TableRow key={sale.id}>
          <TableCell className="font-mono text-xs">{sale.saleNumber}</TableCell>
          <TableCell>{format(sale.createdAt, "MMM d, yyyy h:mm a")}</TableCell>
          <TableCell>{sale.cashier.name}</TableCell>
          <TableCell className="tabular-nums">
            {saleItemCount(sale.items)}
          </TableCell>
          <TableCell>
            <Badge variant="secondary">
              {PAYMENT_METHOD_LABELS[sale.paymentMethod]}
            </Badge>
            {sale.paymentNote ? (
              <div className="mt-1 text-xs text-muted-foreground">
                {sale.paymentNote}
              </div>
            ) : null}
          </TableCell>
          <TableCell>
            <Badge
              variant={sale.status === "COMPLETED" ? "default" : "secondary"}
            >
              {sale.status}
            </Badge>
          </TableCell>
          <TableCell className="text-right font-medium tabular-nums">
            {formatPesos(sale.totalCents)}
          </TableCell>
        </TableRow>
      ));

  const cards = emptyState
    ? emptyCards
    : pageItems.map((sale) => (
        <DataListCard key={sale.id}>
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
            <Badge
              variant={sale.status === "COMPLETED" ? "default" : "secondary"}
            >
              {sale.status}
            </Badge>
          </div>

          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Staff</dt>
              <dd>{sale.cashier.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Items</dt>
              <dd className="tabular-nums">{saleItemCount(sale.items)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs text-muted-foreground">Payment</dt>
              <dd className="mt-1 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                  {PAYMENT_METHOD_LABELS[sale.paymentMethod]}
                </Badge>
                {sale.paymentNote ? (
                  <span className="text-xs text-muted-foreground">
                    {sale.paymentNote}
                  </span>
                ) : null}
              </dd>
            </div>
          </dl>
        </DataListCard>
      ));

  return (
    <div className="space-y-3">
      <TableSearchToolbar
        value={query}
        onChange={setQuery}
        placeholder="Search sale #, staff name, or payment"
        aria-label="Search sales"
        matchedCount={filtered.length}
        totalCount={sales.length}
      />

      <ResponsiveDataList
        cards={cards}
        table={
          <DataTableShell columns={SALE_COLUMNS}>{tableBody}</DataTableShell>
        }
      />

      <ListPagination
        page={page}
        pageSize={DEFAULT_LIST_PAGE_SIZE}
        total={filtered.length}
        onPageChange={setPage}
      />
    </div>
  );
}
