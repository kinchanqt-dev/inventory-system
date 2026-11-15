export function productsListEmptyMessage(
  productsCount: number,
  filteredCount: number,
  query: string,
): string | null {
  if (productsCount === 0) {
    return "No products yet. Add your first item to start selling.";
  }
  if (filteredCount === 0) {
    return `No products match “${query.trim()}”`;
  }
  return null;
}