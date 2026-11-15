"use client";

import { useMemo, useState } from "react";

import { DEFAULT_LIST_PAGE_SIZE, paginateItems } from "@/lib/paginate";
import { PAYMENT_METHOD_LABELS } from "@/enums";

import {
  DataTableShell,
  ListPagination,
  ResponsiveDataList,
  TableSearchToolbar,
} from "@/components/shared";

import { SaleReceiptDialog } from "@/features/sales/components/sale-receipt-dialog";
import { SalesListCard, SalesListEmptyCards } from "@/features/sales/components/sales-list-card";
import {
  SalesTableEmptyRow,
  SalesTableRow,
} from "@/features/sales/components/sales-table-row";
import { filterSalesList } from "@/features/sales/lib/filter-sales-list";
import { saleReceiptFromUiSale } from "@/features/sales/lib/sale-receipt-from-ui-sale";
import { salesListEmptyState } from "@/features/sales/lib/sales-list-empty-state";

import type { PaymentMethodValue } from "@/enums";
import type { UiSale } from "@/lib/mappers";
import type { SaleReceiptData } from "@/features/sales/types/sale-receipt.types";

interface SalesTableProps {
  sales: UiSale[];
  shopName: string;
}

function paymentLabel(method: string) {
  return PAYMENT_METHOD_LABELS[method as PaymentMethodValue] ?? method;
}

const SALE_COLUMNS = [
  { label: "Sale #" },
  { label: "When" },
  { label: "Staff" },
  { label: "Items" },
  { label: "Payment" },
  { label: "Status" },
  { label: "Total", align: "right" as const },
  { label: "", align: "right" as const },
];

function buildSalesTableBody(
  emptyState: ReturnType<typeof salesListEmptyState>,
  query: string,
  pageItems: UiSale[],
  openReceipt: (sale: UiSale) => void,
) {
  if (emptyState) {
    return (
      <SalesTableEmptyRow
        emptyState={emptyState}
        query={query}
        columnCount={SALE_COLUMNS.length}
      />
    );
  }

  return pageItems.map((sale) => (
    <SalesTableRow
      key={sale.id}
      sale={sale}
      paymentLabel={paymentLabel}
      onOpenReceipt={openReceipt}
    />
  ));
}

function buildSalesCards(
  emptyState: ReturnType<typeof salesListEmptyState>,
  query: string,
  pageItems: UiSale[],
  openReceipt: (sale: UiSale) => void,
) {
  if (emptyState) {
    return <SalesListEmptyCards emptyState={emptyState} query={query} />;
  }

  return pageItems.map((sale) => (
    <SalesListCard
      key={sale.id}
      sale={sale}
      paymentLabel={paymentLabel}
      onOpenReceipt={openReceipt}
    />
  ));
}

export function SalesTable({ sales, shopName }: Readonly<SalesTableProps>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [receipt, setReceipt] = useState<SaleReceiptData | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const filtered = useMemo(
    () => filterSalesList(sales, query, paymentLabel),
    [sales, query],
  );

  const pageItems = paginateItems(filtered, page, DEFAULT_LIST_PAGE_SIZE);
  const emptyState = salesListEmptyState(sales.length, filtered.length);

  function openReceipt(sale: UiSale) {
    setReceipt(saleReceiptFromUiSale(sale));
    setReceiptOpen(true);
  }

  const tableBody = buildSalesTableBody(emptyState, query, pageItems, openReceipt);
  const cards = buildSalesCards(emptyState, query, pageItems, openReceipt);

  return (
    <div className="space-y-3">
      <TableSearchToolbar
        value={query}
        onChange={(value) => {
          setQuery(value);
          setPage(1);
        }}
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

      <SaleReceiptDialog
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        receipt={receipt}
        shopName={shopName}
      />
    </div>
  );
}