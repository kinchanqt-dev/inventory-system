import { formDataNumberField, formDataString } from "@/lib/form-data-helpers";
import { pesosToCents } from "@/lib/money";

export function emptyToUndefined(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function readInitialStock(
  formData: FormData,
  includeInitialStock: boolean | undefined,
) {
  if (!includeInitialStock) {
    return undefined;
  }
  return formDataNumberField(formData, "initialStock", 0);
}

export function readIngredientFormData(
  formData: FormData,
  options?: { includeInitialStock?: boolean },
) {
  return {
    name: formData.get("name"),
    categoryId: emptyToUndefined(formData.get("categoryId")),
    supplier: emptyToUndefined(formData.get("supplier")),
    packPricePesos: formData.get("packPricePesos"),
    packSize: formData.get("packSize"),
    packUnit: formDataString(formData, "packUnit", "pc"),
    yieldPercent: formDataNumberField(formData, "yieldPercent", 100),
    minStock: formDataNumberField(formData, "minStock", 0),
    initialStock: readInitialStock(formData, options?.includeInitialStock),
    notes: emptyToUndefined(formData.get("notes")),
  };
}

export function toIngredientWriteData(data: {
  name: string;
  categoryId?: string;
  supplier?: string;
  packPricePesos: number;
  packSize: number;
  packUnit: string;
  yieldPercent: number;
  notes?: string;
}) {
  return {
    name: data.name,
    category_id: data.categoryId || null,
    supplier: data.supplier || null,
    pack_price_cents: pesosToCents(data.packPricePesos),
    pack_size: data.packSize,
    pack_unit: data.packUnit,
    yield_bps: Math.round(data.yieldPercent * 100),
    notes: data.notes || null,
  };
}