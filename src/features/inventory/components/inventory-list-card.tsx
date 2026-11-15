import { formatPesos } from "@/lib/money";
import { getStockStatus } from "@/lib/stock-status";
import { cn } from "@/lib/utils";

import {
  DataListCard,
  StockAdjustButton,
  StockStatusBadge,
} from "@/components/shared";

import type { InventoryRow } from "@/features/inventory/types/inventory.types";

interface InventoryListCardProps {
  item: InventoryRow;
  onAdjust: (id: string) => void;
}

export function InventoryListCard({
  item,
  onAdjust,
}: Readonly<InventoryListCardProps>) {
  const status = getStockStatus(item.quantity, item.reorderLevel);
  const needsAttention = status !== "ok";

  return (
    <DataListCard
      className={cn(
        needsAttention && "border-destructive/30 bg-destructive/5",
      )}
      footer={
        <StockAdjustButton
          itemName={item.product.name}
          onClick={() => onAdjust(item.id)}
        />
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">{item.product.name}</p>
          <p className="font-mono text-xs text-muted-foreground">
            {item.product.sku}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {item.product.category?.name ?? "Uncategorized"}
          </p>
        </div>
        <StockStatusBadge status={status} />
      </div>

      <dl className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">In stock</dt>
          <dd className="tabular-nums">{item.quantity}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Alert at</dt>
          <dd className="tabular-nums">{item.reorderLevel}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Value</dt>
          <dd className="font-medium tabular-nums">
            {formatPesos(item.quantity * item.product.costCents)}
          </dd>
        </div>
      </dl>
    </DataListCard>
  );
}