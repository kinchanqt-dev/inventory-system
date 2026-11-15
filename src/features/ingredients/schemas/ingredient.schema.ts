import { z } from "zod";

import { knownUnitSchema } from "@/lib/food-cost/zod-unit";

export const ingredientSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  categoryId: z.string().optional(),
  supplier: z.string().trim().optional(),
  packPricePesos: z.coerce.number().min(0, "Pack price cannot be negative"),
  packSize: z.coerce.number().positive("Pack size must be greater than 0"),
  packUnit: knownUnitSchema.default("pc"),
  yieldPercent: z.coerce
    .number()
    .min(1, "Yield must be at least 1%")
    .max(100, "Yield cannot exceed 100%"),
  minStock: z.coerce.number().min(0).default(0),
  initialStock: z.coerce.number().min(0).default(0),
  notes: z.string().trim().optional(),
});
