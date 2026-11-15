"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui";

import { PosCategoryTabs } from "@/features/pos/components/pos-category-tabs";
import { PosProductTile } from "@/features/pos/components/pos-product-tile";

import type { PosProduct } from "@/features/pos/types/pos-product.types";

interface PosProductGridProps {
  products: PosProduct[];
  query: string;
  categories: string[];
  selectedCategory: string | null;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string | null) => void;
  onAdd: (product: PosProduct) => void;
}

function PosProductGridBody({
  products,
  onAdd,
}: Readonly<Pick<PosProductGridProps, "products" | "onAdd">>) {
  if (products.length === 0) {
    return (
      <p className="col-span-full rounded-2xl border border-dashed bg-card/50 p-8 text-center text-sm text-muted-foreground">
        No products match this search
      </p>
    );
  }

  return products.map((product, index) => (
    <PosProductTile
      key={product.id}
      product={product}
      onAdd={onAdd}
      imagePriority={index < 8}
      highFetchPriority={index === 0}
    />
  ));
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
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          className="min-h-12 rounded-xl border-border/70 bg-card/80 pl-10 text-base shadow-sm md:min-h-14"
          placeholder="Search by name or item code"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          aria-label="Search products"
        />
      </div>

      <PosCategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 xl:grid-cols-4">
        <PosProductGridBody products={products} onAdd={onAdd} />
      </div>
    </section>
  );
}