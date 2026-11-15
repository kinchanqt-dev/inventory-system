import type { Product } from "@/types/database.types";

export interface ProductCoreCamelFields {
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
  sendsToKitchen: boolean;
}

export function mapProductRowToCoreFields(row: Product): ProductCoreCamelFields {
  return {
    id: row.id,
    sku: row.sku,
    barcode: row.barcode,
    name: row.name,
    description: row.description,
    imagePath: row.image_path,
    categoryId: row.category_id,
    priceCents: row.price_cents,
    costCents: row.cost_cents,
    unit: row.unit,
    isActive: row.is_active,
    sendsToKitchen: row.sends_to_kitchen ?? true,
  };
}

export function pickProductCoreFields(
  source: ProductCoreCamelFields,
): ProductCoreCamelFields {
  return {
    id: source.id,
    sku: source.sku,
    barcode: source.barcode,
    name: source.name,
    description: source.description,
    imagePath: source.imagePath,
    categoryId: source.categoryId,
    priceCents: source.priceCents,
    costCents: source.costCents,
    unit: source.unit,
    isActive: source.isActive,
    sendsToKitchen: source.sendsToKitchen,
  };
}