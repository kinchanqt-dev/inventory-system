"use client";

import { useMemo } from "react";

import { useStockListControls } from "@/hooks/use-stock-list-controls.hooks";
import { DEFAULT_LIST_PAGE_SIZE, paginateItems } from "@/lib/paginate";
import { getListEmptyMessage } from "@/lib/list-empty-message";

import {
  DataTableShell,
  ListPagination,
  LowStockFilterButton,
  ResponsiveDataList,
  StockAdjustDialog,
  TableSearchToolbar,
} from "@/components/shared";

import {
  buildInventoryCards,
  buildInventoryTableBody,
} from "@/features/inventory/components/inventory-table-body";
import { StockAdjustForm } from "@/features/inventory/components/stock-adjust-form";
import { filterInventoryForStockList } from "@/features/inventory/lib/filter-inventory-list";

import type { InventoryRow } from "@/features/inventory/types/inventory.types";

const INVENTORY_COLUMNS = [
  { label: "Item code" },
  { label: "Product" },
  { label: "In stock" },
  { label: "Alert at" },
  { label: "Stock value", align: "right" as const },
  { label: "Status" },
  { label: "Actions", align: "right" as const },
];

interface InventoryTableProps {
  items: InventoryRow[];
}

function stockAdjustDescription(openItem: InventoryRow | null) {
  if (!openItem) {
    return "";
  }
  return `${openItem.product.name} · current stock ${openItem.quantity}`;
}

export function InventoryTable({ items }: Readonly<InventoryTableProps>) {
  const {
    openId,
    setOpenId,
    lowStockOnly,
    setLowStockOnly,
    query,
    setQuery,
    page,
    setPage,
  } = useStockListControls();

  const visibleItems = useMemo(
    () => filterInventoryForStockList(items, { lowStockOnly, query }),
    [items, lowStockOnly, query],
  );

  const pageItems = paginateItems(visibleItems, page, DEFAULT_LIST_PAGE_SIZE);
  const openItem = items.find((item) => item.id === openId) ?? null;
  const isEmpty = visibleItems.length === 0;
  const message = getListEmptyMessage({
    totalCount: items.length,
    lowStockOnly,
    query,
    emptyCollectionMessage: "No products in inventory yet",
    noSearchMatchMessage: (trimmedQuery) =>
      `No items match “${trimmedQuery}”`,
  });

  const tableBody = buildInventoryTableBody({
    isEmpty,
    message,
    columnCount: INVENTORY_COLUMNS.length,
    pageItems,
    onAdjust: setOpenId,
  });

  const cards = buildInventoryCards({
    isEmpty,
    message,
    pageItems,
    onAdjust: setOpenId,
  });

  return (
    <div className="space-y-3">
      <TableSearchToolbar
        value={query}
        onChange={(value) => {
          setQuery(value);
          setPage(1);
        }}
        placeholder="Search by item code, name, or category"
        aria-label="Search inventory"
        matchedCount={visibleItems.length}
        totalCount={items.length}
        actions={
          <LowStockFilterButton
            active={lowStockOnly}
            onToggle={() => {
              setLowStockOnly((current) => !current);
              setPage(1);
            }}
          />
        }
      />

      <ResponsiveDataList
        cards={cards}
        table={
          <DataTableShell columns={INVENTORY_COLUMNS}>{tableBody}</DataTableShell>
        }
      />

      <ListPagination
        page={page}
        pageSize={DEFAULT_LIST_PAGE_SIZE}
        total={visibleItems.length}
        onPageChange={setPage}
      />

      <StockAdjustDialog
        open={openItem !== null}
        onOpenChange={(open) => {
          if (!open) setOpenId(null);
        }}
        description={stockAdjustDescription(openItem)}
      >
        {openItem ? (
          <StockAdjustForm
            productId={openItem.product.id}
            onSuccess={() => setOpenId(null)}
          />
        ) : null}
      </StockAdjustDialog>
    </div>
  );
}