import { trueCostPerPackUnitCents } from "@/lib/food-cost";

import { ingredientCategory } from "@/features/ingredients/lib/ingredient-category";
import { ingredientStockSnapshot } from "@/features/ingredients/lib/ingredient-stock-snapshot";

import type { UiIngredient } from "@/features/ingredients/types/ingredient.types";

import type { Category, Ingredient, IngredientStock } from "@/types/database.types";

export function mapIngredient(
  row: Ingredient,
  stock: IngredientStock | null,
  category: Category | null,
): UiIngredient {
  const yieldBps = row.yield_bps;
  const yieldPercent = yieldBps / 100;
  const trueCost = trueCostPerPackUnitCents({
    id: row.id,
    packPriceCents: row.pack_price_cents,
    packSize: Number(row.pack_size),
    packUnit: row.pack_unit,
    yieldBps,
  });

  return {
    id: row.id,
    name: row.name,
    categoryId: row.category_id,
    category: ingredientCategory(category),
    supplier: row.supplier,
    packPriceCents: row.pack_price_cents,
    previousPackPriceCents: row.previous_pack_price_cents,
    packSize: Number(row.pack_size),
    packUnit: row.pack_unit,
    yieldPercent,
    yieldBps,
    trueCostPerPackUnitCents: Math.round(trueCost),
    notes: row.notes,
    ...ingredientStockSnapshot(stock, row.pack_unit),
  };
}