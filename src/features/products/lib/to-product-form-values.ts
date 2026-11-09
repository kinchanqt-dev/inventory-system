import type { ProductFormValues } from "@/features/products/types/product.types";

interface ProductWithStock {
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
  stock: { quantity: number; reorderLevel: number } | null;
}

export function toProductFormValues(
  product: ProductWithStock,
): ProductFormValues {
  return {
    id: product.id,
    sku: product.sku,
    barcode: product.barcode,
    name: product.name,
    description: product.description,
    imagePath: product.imagePath,
    categoryId: product.categoryId,
    priceCents: product.priceCents,
    costCents: product.costCents,
    unit: product.unit,
    quantity: product.stock?.quantity,
    reorderLevel: product.stock?.reorderLevel,
    isActive: product.isActive,
  };
}
