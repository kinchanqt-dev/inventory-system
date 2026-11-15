import type { CategoryKind } from "@/types/database.types";

export interface CategoryListItem {
  id: string;
  name: string;
  slug: string;
  kind: CategoryKind;
}

export interface CategoryOption {
  id: string;
  name: string;
}

export type { CategoryKind };
