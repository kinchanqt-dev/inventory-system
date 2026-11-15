"use client";

import { formatPesos } from "@/lib/money";
import { getStockStatus } from "@/lib/stock-status";
import { cn } from "@/lib/utils";

import { DataListCard, StockStatusBadge } from "@/components/shared";

import { IngredientActionsMenu } from "@/features/ingredients/components/ingredient-actions-menu";

import type { UiIngredient } from "@/features/ingredients/types/ingredient.types";

interface IngredientListCardProps {
  item: UiIngredient;
  onAdjust: (ingredientId: string) => void;
}

function ingredientSubtitle(item: UiIngredient) {
  const category = item.category?.name ?? "Uncategorized";
  if (item.supplier) {
    return `${category} · ${item.supplier}`;
  }
  return category;
}

export function IngredientListCard({
  item,
  onAdjust,
}: Readonly<IngredientListCardProps>) {
  const status = getStockStatus(item.stockQuantity, item.minStock);
  const needsAttention = status !== "ok";

  return (
    <DataListCard
      className={cn(
        needsAttention && "border-destructive/30 bg-destructive/5",
      )}
      footer={
        <IngredientActionsMenu
          ingredientId={item.id}
          ingredientName={item.name}
          onAdjust={() => onAdjust(item.id)}
        />
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">{item.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {ingredientSubtitle(item)}
          </p>
        </div>
        <StockStatusBadge status={status} />
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Pack price</dt>
          <dd className="tabular-nums">{formatPesos(item.packPriceCents)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Pack</dt>
          <dd className="tabular-nums">
            {item.packSize} {item.packUnit}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Yield</dt>
          <dd className="tabular-nums">{item.yieldPercent}%</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">True cost / unit</dt>
          <dd className="font-medium tabular-nums">
            {formatPesos(item.trueCostPerPackUnitCents)}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs text-muted-foreground">In stock</dt>
          <dd className="tabular-nums">
            {item.stockQuantity} {item.stockUnit}
          </dd>
        </div>
      </dl>
    </DataListCard>
  );
}
