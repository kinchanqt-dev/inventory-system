import { describe, expect, it } from "vitest";

import { loginSchema } from "@/features/auth/schemas/login.schema";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    expect(
      loginSchema.safeParse({
        email: "owner@local.dev",
        password: "password123",
      }).success,
    ).toBe(true);
  });

  it("rejects empty password", () => {
    expect(
      loginSchema.safeParse({
        email: "owner@local.dev",
        password: "",
      }).success,
    ).toBe(false);
  });
});
