import { firstZodIssueMessage } from "@/lib/first-zod-issue";

import {
  emptyToUndefined,
  readIngredientFormData,
} from "@/features/ingredients/lib/ingredient-form-data";
import { ingredientStockAdjustSchema } from "@/features/ingredients/schemas/ingredient-stock.schema";
import { ingredientSchema } from "@/features/ingredients/schemas/ingredient.schema";

export function parseCreateIngredientForm(formData: FormData) {
  const parsed = ingredientSchema.safeParse(
    readIngredientFormData(formData, { includeInitialStock: true }),
  );
  if (!parsed.success) {
    throw new Error(
      firstZodIssueMessage(parsed.error.issues, "Invalid ingredient"),
    );
  }
  return parsed.data;
}

export function parseUpdateIngredientForm(formData: FormData) {
  const parsed = ingredientSchema
    .omit({ initialStock: true })
    .safeParse(readIngredientFormData(formData));
  if (!parsed.success) {
    throw new Error(
      firstZodIssueMessage(parsed.error.issues, "Invalid ingredient"),
    );
  }
  return parsed.data;
}

export function parseAdjustIngredientStockForm(formData: FormData) {
  const parsed = ingredientStockAdjustSchema.safeParse({
    ingredientId: formData.get("ingredientId"),
    type: formData.get("type"),
    quantity: formData.get("quantity"),
    reason: emptyToUndefined(formData.get("reason")),
  });
  if (!parsed.success) {
    throw new Error(
      firstZodIssueMessage(parsed.error.issues, "Invalid adjustment"),
    );
  }
  return parsed.data;
}
