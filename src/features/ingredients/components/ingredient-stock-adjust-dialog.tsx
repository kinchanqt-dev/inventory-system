"use client";

import { StockAdjustDialog } from "@/components/shared";

import { IngredientStockForm } from "@/features/ingredients/components/ingredient-stock-form";

import type { UiIngredient } from "@/features/ingredients/types/ingredient.types";

interface IngredientStockAdjustDialogProps {
  openItem: UiIngredient | null;
  onClose: () => void;
}

function adjustDialogDescription(item: UiIngredient | null) {
  if (!item) {
    return "";
  }
  return `${item.name} · current stock ${item.stockQuantity} ${item.stockUnit}`;
}

export function IngredientStockAdjustDialog({
  openItem,
  onClose,
}: Readonly<IngredientStockAdjustDialogProps>) {
  return (
    <StockAdjustDialog
      open={openItem !== null}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      description={adjustDialogDescription(openItem)}
    >
      {openItem ? (
        <IngredientStockForm
          ingredientId={openItem.id}
          onSuccess={onClose}
        />
      ) : null}
    </StockAdjustDialog>
  );
}
