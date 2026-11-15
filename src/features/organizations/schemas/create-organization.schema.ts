import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(2, "Business name is required").max(80),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(48)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
});
