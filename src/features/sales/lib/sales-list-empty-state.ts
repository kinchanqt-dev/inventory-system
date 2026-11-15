export function salesListEmptyState(
  salesCount: number,
  filteredCount: number,
): "none" | "no-match" | null {
  if (salesCount === 0) {
    return "none";
  }
  if (filteredCount === 0) {
    return "no-match";
  }
  return null;
}