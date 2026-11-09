"use client";

import { useEffect, useMemo, useState } from "react";

import { DEFAULT_LIST_PAGE_SIZE, paginateItems } from "@/lib/paginate";

import {
  DataTableShell,
  ListPagination,
  ResponsiveDataList,
  TableSearchToolbar,
} from "@/components/shared";
import { TableCell, TableRow } from "@/components/ui";

import { ProductListCard } from "@/features/products/components/product-list-card";
import { ProductRow } from "@/features/products/components/product-row";

import type { ProductRowData } from "@/features/products/types/product.types";

interface ProductsTableProps {
  products: ProductRowData[];
}

const PRODUCT_COLUMNS = [
  { label: "Item code" },
  { label: "Name" },
  { label: "Category" },
  { label: "Price" },
  { label: "Stock" },
  { label: "Status" },
  { label: "Actions", align: "right" as const },
];

export function ProductsTable({ products }: Readonly<ProductsTableProps>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return products;

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(normalized) ||
        product.sku.toLowerCase().includes(normalized) ||
        (product.category?.name ?? "").toLowerCase().includes(normalized),
    );
  }, [products, query]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const pageItems = paginateItems(filtered, page, DEFAULT_LIST_PAGE_SIZE);

  let emptyMessage: string | null = null;
  if (products.length === 0) {
    emptyMessage = "No products yet. Add your first item to start selling.";
  } else if (filtered.length === 0) {
    emptyMessage = `No products match “${query.trim()}”`;
  }

  const tableBody = emptyMessage ? (
    <TableRow>
      <TableCell
        colSpan={PRODUCT_COLUMNS.length}
        className="py-10 text-center text-sm text-muted-foreground"
      >
        {emptyMessage}
      </TableCell>
    </TableRow>
  ) : (
    pageItems.map((product) => (
      <ProductRow key={product.id} product={product} />
    ))
  );

  const cards = emptyMessage ? (
    <p className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
      {emptyMessage}
    </p>
  ) : (
    pageItems.map((product) => (
      <ProductListCard key={product.id} product={product} />
    ))
  );

  return (
    <div className="space-y-3">
      <TableSearchToolbar
        value={query}
        onChange={setQuery}
        placeholder="Search by name, item code, or category"
        aria-label="Search products"
        matchedCount={filtered.length}
        totalCount={products.length}
      />

      <ResponsiveDataList
        cards={cards}
        table={
          <DataTableShell columns={PRODUCT_COLUMNS}>{tableBody}</DataTableShell>
        }
      />

      <ListPagination
        page={page}
        pageSize={DEFAULT_LIST_PAGE_SIZE}
        total={filtered.length}
        onPageChange={setPage}
      />
    </div>
  );
}
