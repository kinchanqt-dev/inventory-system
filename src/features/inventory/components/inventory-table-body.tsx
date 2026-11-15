import { DataListEmptyState, TableEmptyRow } from "@/components/shared";

import { InventoryListCard } from "@/features/inventory/components/inventory-list-card";
import { InventoryTableRow } from "@/features/inventory/components/inventory-table-row";

import type { InventoryRow } from "@/features/inventory/types/inventory.types";

interface InventoryTableBodyProps {
  isEmpty: boolean;
  message: string;
  columnCount: number;
  pageItems: InventoryRow[];
  onAdjust: (id: string) => void;
}

export function buildInventoryTableBody({
  isEmpty,
  message,
  columnCount,
  pageItems,
  onAdjust,
}: InventoryTableBodyProps) {
  if (isEmpty) {
    return <TableEmptyRow colSpan={columnCount} message={message} />;
  }
  return pageItems.map((item) => (
    <InventoryTableRow key={item.id} item={item} onAdjust={onAdjust} />
  ));
}

export function buildInventoryCards({
  isEmpty,
  message,
  pageItems,
  onAdjust,
}: Omit<InventoryTableBodyProps, "columnCount">) {
  if (isEmpty) {
    return <DataListEmptyState message={message} />;
  }
  return pageItems.map((item) => (
    <InventoryListCard key={item.id} item={item} onAdjust={onAdjust} />
  ));
}