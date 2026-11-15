import type { IngredientStock } from "@/types/database.types";

function stockQuantity(stock: IngredientStock | null) {
  if (!stock) {
    return 0;
  }
  return Number(stock.quantity);
}

function stockMin(stock: IngredientStock | null) {
  if (!stock) {
    return 0;
  }
  return Number(stock.min_stock);
}

function stockUnit(stock: IngredientStock | null, packUnit: string) {
  if (stock?.unit) {
    return stock.unit;
  }
  return packUnit;
}

export function ingredientStockSnapshot(
  stock: IngredientStock | null,
  packUnit: string,
) {
  return {
    stockQuantity: stockQuantity(stock),
    minStock: stockMin(stock),
    stockUnit: stockUnit(stock, packUnit),
  };
}