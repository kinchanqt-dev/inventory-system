import { describe, expect, it } from "vitest";

import { asCredentialPair, normalizeEmail } from "@/lib/credentials";

describe("credentials helpers", () => {
  it("normalizes email", () => {
    expect(normalizeEmail("  Owner@Local.DEV ")).toBe("owner@local.dev");
  });

  it("validates credential pairs", () => {
    expect(asCredentialPair("a@b.com", "secret")).toEqual({
      email: "a@b.com",
      password: "secret",
    });
    expect(asCredentialPair(undefined, "secret")).toBeNull();
    expect(asCredentialPair("a@b.com", undefined)).toBeNull();
  });
});
