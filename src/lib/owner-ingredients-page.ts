import { requireRole } from "@/lib/session";

import { listIngredients } from "@/features/ingredients";

export async function loadOwnerIngredientsPage() {
  const session = await requireRole(["OWNER"]);
  const ingredients = await listIngredients();
  return { session, ingredients };
}
