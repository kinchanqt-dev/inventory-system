import { describe, expect, it } from "vitest";

import { authConfig } from "@/lib/auth.config";

describe("authConfig.authorized", () => {
  const authorized = authConfig.callbacks?.authorized;

  it("blocks anonymous users away from login", () => {
    expect(
      authorized?.({
        auth: null,
        request: { nextUrl: new URL("http://localhost/pos") },
      } as never),
    ).toBe(false);
  });

  it("allows the login page for anonymous users", () => {
    expect(
      authorized?.({
        auth: null,
        request: { nextUrl: new URL("http://localhost/login") },
      } as never),
    ).toBe(true);
  });

  it("redirects authenticated users away from login", () => {
    const result = authorized?.({
      auth: { user: { id: "1", role: "OWNER" } },
      request: { nextUrl: new URL("http://localhost/login") },
    } as never);

    expect(result).toBeInstanceOf(Response);
  });
});
