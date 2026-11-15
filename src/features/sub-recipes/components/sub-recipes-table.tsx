"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { DEFAULT_LIST_PAGE_SIZE, paginateItems } from "@/lib/paginate";
import { formatPesos } from "@/lib/money";

import {
  DataListCard,
  DataTableShell,
  ListPagination,
  ResponsiveDataList,
  TableSearchToolbar,
} from "@/components/shared";
import {
  Button,
  TableCell,
  TableRow,
} from "@/components/ui";

import type { UiSubRecipe } from "@/features/sub-recipes/types/sub-recipe.types";

const SUB_RECIPE_COLUMNS = [
  { label: "Name" },
  { label: "Batch yield" },
  { label: "Lines" },
  { label: "Batch cost", align: "right" as const },
  { label: "Cost / batch unit", align: "right" as const },
  { label: "Actions", align: "right" as const },
];

interface SubRecipesTableProps {
  subRecipes: UiSubRecipe[];
}

function emptyMessage(itemsLength: number, query: string) {
  if (itemsLength === 0) {
    return "No sub-recipes yet. Build your first prep batch.";
  }

  if (query.trim()) {
    return `No sub-recipes match “${query.trim()}”`;
  }

  return "No sub-recipes yet. Build your first prep batch.";
}

function formatLineSummary(subRecipe: UiSubRecipe) {
  const names = subRecipe.lines.map((line) => line.ingredientName);
  if (names.length <= 2) {
    return names.join(", ") || "—";
  }
  return `${names.slice(0, 2).join(", ")} +${names.length - 2} more`;
}

export function SubRecipesTable({
  subRecipes,
}: Readonly<SubRecipesTableProps>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const visibleItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return subRecipes;
    }

    return subRecipes.filter((item) => {
      const haystack = [
        item.name,
        item.batchUnit,
        ...item.lines.map((line) => line.ingredientName),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [subRecipes, query]);

  const pageItems = paginateItems(visibleItems, page, DEFAULT_LIST_PAGE_SIZE);
  const isEmpty = visibleItems.length === 0;
  const message = emptyMessage(subRecipes.length, query);

  function renderRowCells(item: UiSubRecipe) {
    return (
      <TableRow key={item.id}>
        <TableCell className="font-medium">{item.name}</TableCell>
        <TableCell className="tabular-nums">
          {item.batchQty} {item.batchUnit}
        </TableCell>
        <TableCell>
          <span className="text-sm text-muted-foreground">
            {item.lines.length} · {formatLineSummary(item)}
          </span>
        </TableCell>
        <TableCell className="text-right tabular-nums">
          {formatPesos(item.batchCostCents)}
        </TableCell>
        <TableCell className="text-right font-medium tabular-nums">
          {formatPesos(item.costPerUnitCents)}
        </TableCell>
        <TableCell className="text-right">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="min-h-11"
            nativeButton={false}
            render={
              <Link
                href={`/sub-recipes/${item.id}/edit`}
                aria-label={`Edit ${item.name}`}
              />
            }
          >
            <Pencil className="size-4" aria-hidden />
            Edit
          </Button>
        </TableCell>
      </TableRow>
    );
  }

  const tableBody = isEmpty ? (
    <TableRow>
      <TableCell
        colSpan={SUB_RECIPE_COLUMNS.length}
        className="py-10 text-center text-sm text-muted-foreground"
      >
        {message}
      </TableCell>
    </TableRow>
  ) : (
    pageItems.map((item) => renderRowCells(item))
  );

  const cards = isEmpty ? (
    <p className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
      {message}
    </p>
  ) : (
    pageItems.map((item) => (
      <DataListCard
        key={item.id}
        footer={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-11"
            nativeButton={false}
            render={<Link href={`/sub-recipes/${item.id}/edit`} />}
          >
            <Pencil className="size-4" aria-hidden />
            Edit
          </Button>
        }
      >
        <div className="min-w-0">
          <p className="truncate font-medium">{item.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {item.batchQty} {item.batchUnit} batch · {item.lines.length} lines
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="col-span-2">
            <dt className="text-xs text-muted-foreground">Ingredients</dt>
            <dd>{formatLineSummary(item)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Batch cost</dt>
            <dd className="tabular-nums">{formatPesos(item.batchCostCents)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Cost / batch unit</dt>
            <dd className="font-medium tabular-nums">
              {formatPesos(item.costPerUnitCents)}
            </dd>
          </div>
        </dl>
      </DataListCard>
    ))
  );

  return (
    <div className="space-y-3">
      <TableSearchToolbar
        value={query}
        onChange={(value) => {
          setQuery(value);
          setPage(1);
        }}
        placeholder="Search by name or ingredient"
        aria-label="Search sub-recipes"
        matchedCount={visibleItems.length}
        totalCount={subRecipes.length}
      />

      <ResponsiveDataList
        cards={cards}
        table={
          <DataTableShell columns={SUB_RECIPE_COLUMNS}>{tableBody}</DataTableShell>
        }
      />

      <ListPagination
        page={page}
        pageSize={DEFAULT_LIST_PAGE_SIZE}
        total={visibleItems.length}
        onPageChange={setPage}
      />
    </div>
  );
}