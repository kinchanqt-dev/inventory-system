export interface CategoryOption {
  id: string;
  name: string;
}

export interface ProductFormValues {
  id?: string;
  sku: string;
  barcode?: string | null;
  name: string;
  description?: string | null;
  imagePath?: string | null;
  categoryId?: string | null;
  priceCents: number;
  costCents: number;
  unit: string;
  quantity?: number;
  reorderLevel?: number;
  isActive: boolean;
}

export interface ProductRowData {
  id: string;
  sku: string;
  barcode: string | null;
  name: string;
  description: string | null;
  imagePath: string | null;
  categoryId: string | null;
  priceCents: number;
  costCents: number;
  unit: string;
  isActive: boolean;
  category: { name: string } | null;
  stock: { quantity: number; reorderLevel: number } | null;
}
