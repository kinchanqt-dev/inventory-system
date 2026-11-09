"use client";

import Image from "next/image";
import { Search } from "lucide-react";

import { formatPesos } from "@/lib/money";
import { cn } from "@/lib/utils";

import { Badge, Input } from "@/components/ui";

interface PosProduct {
  id: string;
  sku: string;
  name: string;
  priceCents: number;
  imagePath?: string | null;
  stock: { quantity: number } | null;
  category: { name: string } | null;
}

interface PosProductGridProps {
  products: PosProduct[];
  query: string;
  categories: string[];
  selectedCategory: string | null;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string | null) => void;
  onAdd: (product: PosProduct) => void;
}

export function PosProductGrid({
  products,
  query,
  categories,
  selectedCategory,
  onQueryChange,
  onCategoryChange,
  onAdd,
}: Readonly<PosProductGridProps>) {
  return (
    <section className="space-y-4" aria-label="Products">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          className="min-h-12 pl-9 text-base md:min-h-14"
          placeholder="Search by name or item code"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          aria-label="Search products"
        />
      </div>

      {categories.length > 0 ? (
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Categories"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === null}
            onClick={() => onCategoryChange(null)}
            className={cn(
              "min-h-10 shrink-0 rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              selectedCategory === null
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-muted",
            )}
          >
            All
          </button>
          {categories.map((category) => {
            const selected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => onCategoryChange(category)}
                className={cn(
                  "min-h-10 shrink-0 rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <p className="col-span-full rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No products match this search
          </p>
        ) : (
          products.map((product) => {
            const stock = product.stock?.quantity ?? 0;
            const soldOut = stock <= 0;
            const initials = product.name.slice(0, 1).toUpperCase();

            return (
              <button
                key={product.id}
                type="button"
                disabled={soldOut}
                onClick={() => onAdd(product)}
                className={cn(
                  "min-h-28 overflow-hidden rounded-xl border bg-card text-left transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:min-h-36",
                  soldOut
                    ? "cursor-not-allowed opacity-55"
                    : "hover:border-foreground/25",
                )}
              >
                <div className="aspect-product-tile bg-muted">
                  {product.imagePath ? (
                    <Image
                      src={product.imagePath}
                      alt=""
                      width={480}
                      height={360}
                      className="size-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-3xl font-semibold text-muted-foreground">
                      {initials}
                    </div>
                  )}
                </div>
                <div className="space-y-2 p-3 md:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{product.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {product.sku}
                      </p>
                    </div>
                    <Badge variant={soldOut ? "destructive" : "secondary"}>
                      {soldOut ? "Sold out" : `${stock} left`}
                    </Badge>
                  </div>
                  <p className="text-lg font-semibold tabular-nums">
                    {formatPesos(product.priceCents)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {product.category?.name ?? "Uncategorized"}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}
