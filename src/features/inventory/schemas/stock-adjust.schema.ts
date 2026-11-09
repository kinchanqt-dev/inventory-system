import { z } from "zod";

export const stockAdjustSchema = z.object({
  productId: z.string().min(1),
  type: z.enum(["IN", "OUT", "ADJUST"]),
  quantity: z.coerce.number().int().positive("Quantity must be greater than 0"),
  reason: z.string().trim().min(1, "Reason is required").max(255),
});
