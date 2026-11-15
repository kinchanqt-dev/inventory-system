import type { Category } from "@/types/database.types";

export function ingredientCategory(category: Category | null) {
  if (!category) {
    return null;
  }
  return { id: category.id, name: category.name };
}