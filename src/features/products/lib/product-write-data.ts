import { pesosToCents } from "@/lib/money";
import {
  formDataBoolean,
  formDataNumberField,
  formDataString,
} from "@/lib/form-data-helpers";

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
  sendsToKitchen?: boolean;
}

function nullableString(value: string | undefined) {
  return value || null;
}

export function toProductWriteData(data: ProductWriteInput) {
  return {
    sku: data.sku.toUpperCase(),
    barcode: nullableString(data.barcode),
    name: data.name,
    description: nullableString(data.description),
    category_id: nullableString(data.categoryId),
    price_cents: pesosToCents(data.price),
    cost_cents: pesosToCents(data.cost),
    unit: data.unit,
    is_active: data.isActive,
    sends_to_kitchen: data.sendsToKitchen ?? true,
  };
}

export function emptyToUndefined(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function readProductQuantity(
  formData: FormData,
  includeQuantity: boolean | undefined,
) {
  if (!includeQuantity) {
    return undefined;
  }
  return formDataNumberField(formData, "quantity", 0);
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
    cost: formDataNumberField(formData, "cost", 0),
    unit: formDataString(formData, "unit", "pc"),
    quantity: readProductQuantity(formData, options?.includeQuantity),
    reorderLevel: formDataNumberField(formData, "reorderLevel", 5),
    isActive: formDataBoolean(formData, "isActive", true, false),
    sendsToKitchen: formDataBoolean(formData, "sendsToKitchen"),
  };
}