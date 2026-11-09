import { pesosToCents } from "@/lib/money";

interface ProductWriteInput {
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  categoryId?: string;
  price: number;
  cost: number;
  unit: string;
  isActive: boolean;
}

export function toProductWriteData(data: ProductWriteInput) {
  return {
    sku: data.sku.toUpperCase(),
    barcode: data.barcode || null,
    name: data.name,
    description: data.description || null,
    categoryId: data.categoryId || null,
    priceCents: pesosToCents(data.price),
    costCents: pesosToCents(data.cost),
    unit: data.unit,
    isActive: data.isActive,
  };
}

export function emptyToUndefined(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function readProductFormData(
  formData: FormData,
  options?: { includeQuantity?: boolean },
) {
  return {
    sku: formData.get("sku"),
    barcode: emptyToUndefined(formData.get("barcode")),
    name: formData.get("name"),
    description: emptyToUndefined(formData.get("description")),
    categoryId: emptyToUndefined(formData.get("categoryId")),
    price: formData.get("price"),
    cost: formData.get("cost") || 0,
    unit: formData.get("unit") || "pc",
    quantity: options?.includeQuantity ? formData.get("quantity") || 0 : undefined,
    reorderLevel: formData.get("reorderLevel") || 5,
    isActive: formData.get("isActive") !== "false",
  };
}
