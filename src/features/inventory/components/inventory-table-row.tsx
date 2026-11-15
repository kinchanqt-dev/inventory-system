import { formatPesos } from "@/lib/money";
import { getStockStatus } from "@/lib/stock-status";
import { cn } from "@/lib/utils";

import { StockAdjustButton, StockStatusBadge } from "@/components/shared";
import { TableCell, TableRow } from "@/components/ui";

import type { InventoryRow } from "@/features/inventory/types/inventory.types";

interface InventoryTableRowProps {
  item: InventoryRow;
  onAdjust: (id: string) => void;
}

export function InventoryTableRow({
  item,
  onAdjust,
}: Readonly<InventoryTableRowProps>) {
  const status = getStockStatus(item.quantity, item.reorderLevel);
  const needsAttention = status !== "ok";

  return (
    <TableRow
      className={cn(
        needsAttention && "bg-destructive/5 hover:bg-destructive/10",
      )}
    >
      <TableCell className="font-mono text-xs">{item.product.sku}</TableCell>
      <TableCell>
        <div className="font-medium">{item.product.name}</div>
        <div className="text-xs text-muted-foreground">
          {item.product.category?.name ?? "Uncategorized"}
        </div>
      </TableCell>
      <TableCell className="tabular-nums">{item.quantity}</TableCell>
      <TableCell className="tabular-nums">{item.reorderLevel}</TableCell>
      <TableCell className="text-right font-medium tabular-nums">
        {formatPesos(item.quantity * item.product.costCents)}
      </TableCell>
      <TableCell>
        <StockStatusBadge status={status} />
      </TableCell>
      <TableCell className="text-right">
        <StockAdjustButton
          itemName={item.product.name}
          onClick={() => onAdjust(item.id)}
        />
      </TableCell>
    </TableRow>
  );
}