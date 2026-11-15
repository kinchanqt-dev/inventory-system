"use client";

import { formatPesos } from "@/lib/money";
import { getStockStatus } from "@/lib/stock-status";
import { cn } from "@/lib/utils";

import { StockStatusBadge } from "@/components/shared";
import { TableCell, TableRow } from "@/components/ui";

import { IngredientActionsMenu } from "@/features/ingredients/components/ingredient-actions-menu";

import type { UiIngredient } from "@/features/ingredients/types/ingredient.types";

interface IngredientTableRowProps {
  item: UiIngredient;
  onAdjust: (ingredientId: string) => void;
}

function displayOrDash(value: string | null | undefined) {
  if (value) {
    return value;
  }
  return "—";
}

function attentionRowClass(needsAttention: boolean) {
  if (!needsAttention) {
    return undefined;
  }
  return "bg-destructive/5 hover:bg-destructive/10";
}

export function IngredientTableRow({
  item,
  onAdjust,
}: Readonly<IngredientTableRowProps>) {
  const status = getStockStatus(item.stockQuantity, item.minStock);
  const needsAttention = status !== "ok";

  return (
    <TableRow className={cn(attentionRowClass(needsAttention))}>
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell>{displayOrDash(item.category?.name)}</TableCell>
      <TableCell>{displayOrDash(item.supplier)}</TableCell>
      <TableCell className="text-right tabular-nums">
        {formatPesos(item.packPriceCents)}
      </TableCell>
      <TableCell className="tabular-nums">
        {item.packSize} {item.packUnit}
      </TableCell>
      <TableCell className="tabular-nums">{item.yieldPercent}%</TableCell>
      <TableCell className="text-right font-medium tabular-nums">
        {formatPesos(item.trueCostPerPackUnitCents)}
      </TableCell>
      <TableCell className="tabular-nums">
        {item.stockQuantity} {item.stockUnit}
      </TableCell>
      <TableCell>
        <StockStatusBadge status={status} />
      </TableCell>
      <TableCell className="text-right">
        <IngredientActionsMenu
          ingredientId={item.id}
          ingredientName={item.name}
          onAdjust={() => onAdjust(item.id)}
        />
      </TableCell>
    </TableRow>
  );
}
