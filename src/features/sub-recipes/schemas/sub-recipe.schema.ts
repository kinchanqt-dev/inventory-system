import { z } from "zod";

import { knownUnitSchema } from "@/lib/food-cost/zod-unit";

const subRecipeLineSchema = z.object({
  ingredientId: z.uuid("Choose an ingredient"),
  qty: z.coerce.number().positive("Quantity must be greater than 0"),
  unit: knownUnitSchema,
});

export const subRecipeSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(120),
    batchQty: z.coerce
      .number()
      .positive("Batch quantity must be greater than 0"),
    batchUnit: knownUnitSchema.default("portion"),
    notes: z.string().trim().optional(),
    lines: z
      .array(subRecipeLineSchema)
      .min(1, "Add at least one ingredient line"),
  })
  .superRefine((data, ctx) => {
    const seen = new Set<string>();
    for (const [index, line] of data.lines.entries()) {
      if (seen.has(line.ingredientId)) {
        ctx.addIssue({
          code: "custom",
          message: "Each ingredient can only appear once",
          path: ["lines", index, "ingredientId"],
        });
      }
      seen.add(line.ingredientId);
    }
  });
