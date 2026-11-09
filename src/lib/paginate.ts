export const DEFAULT_LIST_PAGE_SIZE = 20;

export function paginateItems<T>(
  items: readonly T[],
  page: number,
  pageSize: number = DEFAULT_LIST_PAGE_SIZE,
): T[] {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
