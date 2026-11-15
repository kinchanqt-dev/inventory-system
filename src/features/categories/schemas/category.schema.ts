import { z } from "zod";

const categoryKindSchema = z.enum(["menu", "ingredient"]);

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  kind: categoryKindSchema,
});

export type CategoryInput = z.infer<typeof categorySchema>;
