import { describe, expect, it } from "vitest";

import { strongPasswordSchema } from "@/features/auth/schemas/password.schema";

describe("strongPasswordSchema", () => {
  it("accepts a password that meets all rules", () => {
    const result = strongPasswordSchema.safeParse("Kitchen1!");
    expect(result.success).toBe(true);
  });

  it.each([
    ["missing a capital letter", "kitchen1!"],
    ["missing a number", "Kitchen!!"],
    ["missing a special character", "Kitchen12"],
  ] as const)("rejects passwords %s", (_reason, password) => {
    const result = strongPasswordSchema.safeParse(password);
    expect(result.success).toBe(false);
  });
});
