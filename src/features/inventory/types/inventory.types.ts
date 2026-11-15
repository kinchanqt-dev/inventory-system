export interface InventoryRow {
  id: string;
  quantity: number;
  reorderLevel: number;
  product: {
    id: string;
    sku: string;
    name: string;
    priceCents: number;
    costCents: number;
    isActive: boolean;
    category: { name: string } | null;
  };
}
