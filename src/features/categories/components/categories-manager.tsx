"use client";

import { useMemo, useState } from "react";

import { CategoryCreateForm } from "@/features/categories/components/category-create-form";
import { CategoryKindTabs } from "@/features/categories/components/category-kind-tabs";
import { CategoryRow } from "@/features/categories/components/category-row";
import { categoryKindLabel } from "@/features/categories/lib/category-kind-label";

import type { CategoryKind } from "@/types/database.types";
import type { CategoryListItem } from "@/features/categories/types/category.types";

interface CategoriesManagerProps {
  categories: CategoryListItem[];
}

export function CategoriesManager({
  categories,
}: Readonly<CategoriesManagerProps>) {
  const [activeKind, setActiveKind] = useState<CategoryKind>("menu");

  const visibleCategories = useMemo(
    () => categories.filter((category) => category.kind === activeKind),
    [categories, activeKind],
  );

  return (
    <div className="space-y-6">
      <CategoryKindTabs
        activeKind={activeKind}
        onKindChange={setActiveKind}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <aside className="space-y-3">
          <p className="px-1 text-[0.7rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            New
          </p>
          <div className="rounded-lg border border-border/70 bg-card/90 p-4 shadow-[0_18px_40px_-28px_rgba(26,42,36,0.35)] sm:p-5">
            <CategoryCreateForm key={activeKind} kind={activeKind} />
          </div>
        </aside>

        <section className="space-y-3">
          <div className="px-1">
            <p className="text-[0.7rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              List
            </p>
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              {categoryKindLabel(activeKind)} categories
            </h2>
          </div>

          {visibleCategories.length === 0 ? (
            <p className="rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
              No {categoryKindLabel(activeKind).toLowerCase()} categories yet.
              Add one on the left—forms will pick it up automatically.
            </p>
          ) : (
            <ul className="overflow-hidden rounded-lg border border-border/70 bg-card/90 shadow-[0_18px_40px_-28px_rgba(26,42,36,0.28)]">
              {visibleCategories.map((category) => (
                <CategoryRow key={category.id} category={category} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
