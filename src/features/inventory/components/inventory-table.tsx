"use client";

import { PackagePlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { DEFAULT_LIST_PAGE_SIZE, paginateItems } from "@/lib/paginate";
import { cn } from "@/lib/utils";
import { formatPesos } from "@/lib/money";

import {
  DataListCard,
  DataTableShell,
  ListPagination,
  ResponsiveDataList,
  TableSearchToolbar,
} from "@/components/shared";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  TableCell,
  TableRow,
} from "@/components/ui";

import { StockAdjustForm } from "@/features/inventory/components/stock-adjust-form";

const INVENTORY_COLUMNS = [
  { label: "Item code" },
  { label: "Product" },
  { label: "In stock" },
  { label: "Alert at" },
  { label: "Stock value", align: "right" as const },
  { label: "Status" },
  { label: "Actions", align: "right" as const },
];

type StockStatus = "out" | "low" | "ok";

interface InventoryRow {
  id: string;
  quantity: number;
  reorderLevel: number;
  product: {
    id: string;
    sku: string;
    name: string;
    priceCents: number;
    costCents: number;
    isActive: boolean;
    category: { name: string } | null;
  };
}

interface InventoryTableProps {
  items: InventoryRow[];
}

function getStockStatus(quantity: number, reorderLevel: number): StockStatus {
  if (quantity <= 0) return "out";
  if (quantity <= reorderLevel) return "low";
  return "ok";
}

function stockStatusBadge(status: StockStatus) {
  if (status === "out") {
    return <Badge variant="destructive">Out</Badge>;
  }

  if (status === "low") {
    return <Badge variant="destructive">Low</Badge>;
  }

  return <Badge variant="secondary">OK</Badge>;
}

function emptyMessage(
  itemsLength: number,
  lowStockOnly: boolean,
  query: string,
) {
  if (itemsLength === 0) {
    return "No products in inventory yet";
  }

  if (lowStockOnly && !query.trim()) {
    return "Nothing is low on stock right now";
  }

  if (query.trim()) {
    return `No items match “${query.trim()}”`;
  }

  return "No products in inventory yet";
}

function AdjustButton({
  productName,
  onClick,
}: Readonly<{ productName: string; onClick: () => void }>) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="min-h-11"
      aria-label={`Adjust stock for ${productName}`}
      onClick={onClick}
    >
      <PackagePlus className="size-4" aria-hidden />
      Adjust
    </Button>
  );
}

export function InventoryTable({ items }: Readonly<InventoryTableProps>) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const visibleItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return items.filter((item) => {
      const isLow = item.quantity <= item.reorderLevel;
      if (lowStockOnly && !isLow) return false;
      if (!normalized) return true;

      return (
        item.product.sku.toLowerCase().includes(normalized) ||
        item.product.name.toLowerCase().includes(normalized) ||
        (item.product.category?.name ?? "").toLowerCase().includes(normalized)
      );
    });
  }, [items, lowStockOnly, query]);

  useEffect(() => {
    setPage(1);
  }, [query, lowStockOnly]);

  const pageItems = paginateItems(visibleItems, page, DEFAULT_LIST_PAGE_SIZE);
  const openItem = items.find((item) => item.id === openId) ?? null;
  const isEmpty = visibleItems.length === 0;
  const message = emptyMessage(items.length, lowStockOnly, query);

  const tableBody = isEmpty ? (
    <TableRow>
      <TableCell
        colSpan={INVENTORY_COLUMNS.length}
        className="py-10 text-center text-sm text-muted-foreground"
      >
        {message}
      </TableCell>
    </TableRow>
  ) : (
    pageItems.map((item) => {
      const status = getStockStatus(item.quantity, item.reorderLevel);
      const needsAttention = status !== "ok";

      return (
        <TableRow
          key={item.id}
          className={cn(
            needsAttention && "bg-destructive/5 hover:bg-destructive/10",
          )}
        >
          <TableCell className="font-mono text-xs">
            {item.product.sku}
          </TableCell>
          <TableCell>
            <div className="font-medium">{item.product.name}</div>
            <div className="text-xs text-muted-foreground">
              {item.product.category?.name ?? "Uncategorized"}
            </div>
          </TableCell>
          <TableCell className="tabular-nums">{item.quantity}</TableCell>
          <TableCell className="tabular-nums">{item.reorderLevel}</TableCell>
          <TableCell className="text-right font-medium tabular-nums">
            {formatPesos(item.quantity * item.product.costCents)}
          </TableCell>
          <TableCell>{stockStatusBadge(status)}</TableCell>
          <TableCell className="text-right">
            <AdjustButton
              productName={item.product.name}
              onClick={() => setOpenId(item.id)}
            />
          </TableCell>
        </TableRow>
      );
    })
  );

  const cards = isEmpty ? (
    <p className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
      {message}
    </p>
  ) : (
    pageItems.map((item) => {
      const status = getStockStatus(item.quantity, item.reorderLevel);
      const needsAttention = status !== "ok";

      return (
        <DataListCard
          key={item.id}
          className={cn(
            needsAttention && "border-destructive/30 bg-destructive/5",
          )}
          footer={
            <AdjustButton
              productName={item.product.name}
              onClick={() => setOpenId(item.id)}
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
            {stockStatusBadge(status)}
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
    })
  );

  return (
    <div className="space-y-3">
      <TableSearchToolbar
        value={query}
        onChange={setQuery}
        placeholder="Search by item code, name, or category"
        aria-label="Search inventory"
        matchedCount={visibleItems.length}
        totalCount={items.length}
        actions={
          <Button
            type="button"
            variant={lowStockOnly ? "default" : "outline"}
            size="sm"
            className="min-h-11 w-full sm:w-auto"
            aria-pressed={lowStockOnly}
            onClick={() => setLowStockOnly((current) => !current)}
          >
            {lowStockOnly ? "Showing low stock" : "Show low stock only"}
          </Button>
        }
      />

      <ResponsiveDataList
        cards={cards}
        table={
          <DataTableShell columns={INVENTORY_COLUMNS}>{tableBody}</DataTableShell>
        }
      />

      <ListPagination
        page={page}
        pageSize={DEFAULT_LIST_PAGE_SIZE}
        total={visibleItems.length}
        onPageChange={setPage}
      />

      <Dialog
        open={openItem !== null}
        onOpenChange={(open) => {
          if (!open) setOpenId(null);
        }}
      >
        {openItem ? (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adjust stock</DialogTitle>
              <DialogDescription>
                {openItem.product.name} · current stock {openItem.quantity}
              </DialogDescription>
            </DialogHeader>
            <StockAdjustForm
              productId={openItem.product.id}
              onSuccess={() => setOpenId(null)}
            />
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  );
}
