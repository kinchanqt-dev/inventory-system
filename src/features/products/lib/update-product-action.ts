import type { createClient } from "@/lib/supabase/server";

import { resolveProductImagePath } from "@/features/products/lib/resolve-product-image";
import {
  loadProductImagePath,
  parseProductUpdateFormData,
  saveProductUpdate,
} from "@/features/products/lib/update-product-core";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function runProductUpdate(
  productId: string,
  formData: FormData,
  orgId: string,
  supabase: SupabaseClient,
) {
  const parsed = parseProductUpdateFormData(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const existing = await loadProductImagePath(supabase, orgId, productId);
  if ("error" in existing) {
    return { error: existing.error };
  }

  const imageResult = await resolveProductImagePath(
    formData,
    orgId,
    productId,
    existing.imagePath,
  );
  if ("error" in imageResult) {
    return { error: imageResult.error };
  }

  return saveProductUpdate(
    supabase,
    orgId,
    productId,
    parsed.data,
    imageResult.imagePath,
  );
}