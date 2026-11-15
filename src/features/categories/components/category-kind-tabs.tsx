"use client";

import { cn } from "@/lib/utils";

import {
  categoryKindDescription,
  categoryKindLabel,
} from "@/features/categories/lib/category-kind-label";

import type { CategoryKind } from "@/types/database.types";

const KINDS: CategoryKind[] = ["menu", "ingredient"];

interface CategoryKindTabsProps {
  activeKind: CategoryKind;
  onKindChange: (kind: CategoryKind) => void;
}

function tabClass(active: boolean) {
  return cn(
    "min-h-11 rounded-xl px-4 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
    active
      ? "bg-primary font-medium text-primary-foreground shadow-sm"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
  );
}

export function CategoryKindTabs({
  activeKind,
  onKindChange,
}: Readonly<CategoryKindTabsProps>) {
  return (
    <div className="space-y-2">
      <div
        role="tablist"
        aria-label="Category type"
        className="inline-flex flex-wrap gap-1 rounded-2xl border border-border/70 bg-card/70 p-1"
      >
        {KINDS.map((kind) => {
          const active = activeKind === kind;
          return (
            <button
              key={kind}
              type="button"
              role="tab"
              aria-selected={active}
              className={tabClass(active)}
              onClick={() => onKindChange(kind)}
            >
              {categoryKindLabel(kind)}
            </button>
          );
        })}
      </div>
      <p className="text-sm text-muted-foreground">
        {categoryKindDescription(activeKind)}
      </p>
    </div>
  );
}
