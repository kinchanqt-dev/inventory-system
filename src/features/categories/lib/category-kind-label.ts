import type { CategoryKind } from "@/types/database.types";

export function categoryKindLabel(kind: CategoryKind) {
  if (kind === "ingredient") {
    return "Ingredients";
  }
  return "Products";
}

export function categoryKindDescription(kind: CategoryKind) {
  if (kind === "ingredient") {
    return "Used when adding purchased goods.";
  }
  return "Used when adding menu products.";
}
