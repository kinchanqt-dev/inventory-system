interface ListEmptyMessageOptions {
  totalCount: number;
  lowStockOnly: boolean;
  query: string;
  emptyCollectionMessage: string;
  noSearchMatchMessage: (trimmedQuery: string) => string;
}

const LOW_STOCK_EMPTY_MESSAGE = "Nothing is low on stock right now";

function lowStockFilterEmptyMessage(lowStockOnly: boolean, query: string) {
  if (!lowStockOnly) {
    return null;
  }
  if (query.trim()) {
    return null;
  }
  return LOW_STOCK_EMPTY_MESSAGE;
}

export function getListEmptyMessage({
  totalCount,
  lowStockOnly,
  query,
  emptyCollectionMessage,
  noSearchMatchMessage,
}: ListEmptyMessageOptions): string {
  if (totalCount === 0) {
    return emptyCollectionMessage;
  }

  const lowStockMessage = lowStockFilterEmptyMessage(lowStockOnly, query);
  if (lowStockMessage) {
    return lowStockMessage;
  }

  const trimmedQuery = query.trim();
  if (trimmedQuery) {
    return noSearchMatchMessage(trimmedQuery);
  }

  return emptyCollectionMessage;
}
