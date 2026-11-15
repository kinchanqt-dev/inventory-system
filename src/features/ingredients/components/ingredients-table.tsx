"use client";

import { useMemo } from "react";

import { useStockListControls } from "@/hooks/use-stock-list-controls.hooks";
import { DEFAULT_LIST_PAGE_SIZE, paginateItems } from "@/lib/paginate";
import { getListEmptyMessage } from "@/lib/list-empty-message";

import {
  DataListEmptyState,
  DataTableShell,
  ListPagination,
  LowStockFilterButton,
  ResponsiveDataList,
  TableEmptyRow,
  TableSearchToolbar,
} from "@/components/shared";

import { IngredientListCard } from "@/features/ingredients/components/ingredient-list-card";
import { IngredientStockAdjustDialog } from "@/features/ingredients/components/ingredient-stock-adjust-dialog";
import { IngredientTableRow } from "@/features/ingredients/components/ingredient-table-row";
import { filterIngredientsForStockList } from "@/features/ingredients/lib/filter-ingredients-list";

import type { UiIngredient } from "@/features/ingredients/types/ingredient.types";

const INGREDIENT_COLUMNS = [
  { label: "Name" },
  { label: "Category" },
  { label: "Supplier" },
  { label: "Pack price", align: "right" as const },
  { label: "Pack" },
  { label: "Yield" },
  { label: "True cost / unit", align: "right" as const },
  { label: "In stock" },
  { label: "Status" },
  { label: "Actions", align: "right" as const },
];

interface IngredientsTableProps {
  ingredients: UiIngredient[];
}

function IngredientsTableBody({
  isEmpty,
  message,
  pageItems,
  onAdjust,
}: Readonly<{
  isEmpty: boolean;
  message: string;
  pageItems: UiIngredient[];
  onAdjust: (ingredientId: string) => void;
}>) {
  if (isEmpty) {
    return (
      <TableEmptyRow colSpan={INGREDIENT_COLUMNS.length} message={message} />
    );
  }

  return pageItems.map((item) => (
    <IngredientTableRow key={item.id} item={item} onAdjust={onAdjust} />
  ));
}

function IngredientsTableCards({
  isEmpty,
  message,
  pageItems,
  onAdjust,
}: Readonly<{
  isEmpty: boolean;
  message: string;
  pageItems: UiIngredient[];
  onAdjust: (ingredientId: string) => void;
}>) {
  if (isEmpty) {
    return <DataListEmptyState message={message} />;
  }

  return pageItems.map((item) => (
    <IngredientListCard key={item.id} item={item} onAdjust={onAdjust} />
  ));
}

export function IngredientsTable({
  ingredients,
}: Readonly<IngredientsTableProps>) {
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
    () => filterIngredientsForStockList(ingredients, { lowStockOnly, query }),
    [ingredients, lowStockOnly, query],
  );

  const pageItems = paginateItems(visibleItems, page, DEFAULT_LIST_PAGE_SIZE);
  const openItem = ingredients.find((item) => item.id === openId) ?? null;
  const isEmpty = visibleItems.length === 0;
  const message = getListEmptyMessage({
    totalCount: ingredients.length,
    lowStockOnly,
    query,
    emptyCollectionMessage: "No ingredients yet. Add your first purchase item.",
    noSearchMatchMessage: (trimmedQuery) =>
      `No ingredients match “${trimmedQuery}”`,
  });

  return (
    <div className="space-y-3">
      <TableSearchToolbar
        value={query}
        onChange={(value) => {
          setQuery(value);
          setPage(1);
        }}
        placeholder="Search by name, category, or supplier"
        aria-label="Search ingredients"
        matchedCount={visibleItems.length}
        totalCount={ingredients.length}
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
        cards={
          <IngredientsTableCards
            isEmpty={isEmpty}
            message={message}
            pageItems={pageItems}
            onAdjust={setOpenId}
          />
        }
        table={
          <DataTableShell columns={INGREDIENT_COLUMNS}>
            <IngredientsTableBody
              isEmpty={isEmpty}
              message={message}
              pageItems={pageItems}
              onAdjust={setOpenId}
            />
          </DataTableShell>
        }
      />

      <ListPagination
        page={page}
        pageSize={DEFAULT_LIST_PAGE_SIZE}
        total={visibleItems.length}
        onPageChange={setPage}
      />

      <IngredientStockAdjustDialog
        openItem={openItem}
        onClose={() => setOpenId(null)}
      />
    </div>
  );
}
