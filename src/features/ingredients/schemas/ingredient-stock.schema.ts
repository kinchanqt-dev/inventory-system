import { z } from "zod";

export const ingredientStockAdjustSchema = z.object({
  ingredientId: z.string().min(1),
  type: z.enum(["IN", "OUT", "ADJUST"]),
  quantity: z.coerce.number().positive("Quantity must be greater than 0"),
  reason: z.string().trim().max(255).optional(),
});