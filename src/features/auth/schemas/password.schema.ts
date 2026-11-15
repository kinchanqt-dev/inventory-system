import { z } from "zod";

const PASSWORD_RULES = [
  {
    test: (value: string) => value.length >= 8,
    message: "Password must be at least 8 characters",
  },
  {
    test: (value: string) => /[A-Z]/.test(value),
    message: "Password must include at least one capital letter",
  },
  {
    test: (value: string) => /[a-z]/.test(value),
    message: "Password must include at least one letter",
  },
  {
    test: (value: string) => /\d/.test(value),
    message: "Password must include at least one number",
  },
  {
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
    message: "Password must include at least one special character",
  },
] as const;

export const PASSWORD_REQUIREMENTS_HINT =
  "At least 8 characters, with a capital letter, a lowercase letter, a number, and a special character";

export const strongPasswordSchema = z.string().superRefine((value, ctx) => {
  for (const rule of PASSWORD_RULES) {
    if (!rule.test(value)) {
      ctx.addIssue({
        code: "custom",
        message: rule.message,
      });
      return;
    }
  }
});
