import type { UiIngredient } from "@/features/ingredients/types/ingredient.types";

function ingredientSearchFields(item: UiIngredient) {
  return [
    item.name,
    item.category?.name ?? "",
    item.supplier ?? "",
  ];
}

function ingredientMatchesQuery(item: UiIngredient, normalizedQuery: string) {
  if (!normalizedQuery) {
    return true;
  }

  const needle = normalizedQuery.toLowerCase();
  return ingredientSearchFields(item).some((field) =>
    field.toLowerCase().includes(needle),
  );
}

function passesLowStockFilter(
  item: UiIngredient,
  lowStockOnly: boolean,
) {
  if (!lowStockOnly) {
    return true;
  }
  return item.stockQuantity <= item.minStock;
}

export function filterIngredientsForStockList(
  ingredients: UiIngredient[],
  options: { lowStockOnly: boolean; query: string },
) {
  const normalized = options.query.trim().toLowerCase();

  return ingredients.filter(
    (item) =>
      passesLowStockFilter(item, options.lowStockOnly) &&
      ingredientMatchesQuery(item, normalized),
  );
}