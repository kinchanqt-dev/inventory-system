import { z } from "zod";

import { knownUnitSchema } from "@/lib/food-cost/zod-unit";

const recipeLineSchema = z
  .object({
    ingredientId: z.uuid().optional(),
    subRecipeId: z.uuid().optional(),
    qty: z.coerce.number().positive("Quantity must be greater than 0"),
    unit: knownUnitSchema,
  })
  .superRefine((line, ctx) => {
    const hasIngredient = Boolean(line.ingredientId);
    const hasSubRecipe = Boolean(line.subRecipeId);

    if (hasIngredient === hasSubRecipe) {
      ctx.addIssue({
        code: "custom",
        message: "Each line needs an ingredient or a sub-recipe",
        path: ["ingredientId"],
      });
    }
  });

export const productRecipeSchema = z.object({
  lines: z.array(recipeLineSchema),
});

export type ProductRecipeLineInput = z.infer<typeof recipeLineSchema>;
