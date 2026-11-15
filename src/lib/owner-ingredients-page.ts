import { requireRole } from "@/lib/session";

import { listIngredients } from "@/features/ingredients";
import { getShopBranding } from "@/features/settings";

export async function loadOwnerIngredientsPage() {
  const session = await requireRole(["OWNER"]);
  const [ingredients, branding] = await Promise.all([
    listIngredients(),
    getShopBranding(),
  ]);

  return { session, ingredients, branding };
}
