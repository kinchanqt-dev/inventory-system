import { z } from "zod";

import { strongPasswordSchema } from "@/features/auth/schemas/password.schema";

const staffRoleSchema = z.enum(["CASHIER", "COOK"]);

export const createStaffSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  email: z.email("Enter a valid email"),
  password: strongPasswordSchema,
  role: staffRoleSchema,
});
