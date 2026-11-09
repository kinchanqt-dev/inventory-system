import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("next-auth", () => ({
  default: (config: { providers: Array<{ authorize?: unknown }> }) => {
    const authorize = config.providers[0]?.authorize;
    return {
      handlers: {},
      auth: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      authorize,
    };
  },
}));

vi.mock("next-auth/providers/credentials", () => ({
  default: (options: { authorize: unknown }) => options,
}));

import * as authModule from "@/lib/auth";

describe("auth module", () => {
  it("exports auth handlers", () => {
    expect(authModule.handlers).toBeDefined();
    expect(authModule.auth).toBeTypeOf("function");
    expect(authModule.signIn).toBeTypeOf("function");
    expect(authModule.signOut).toBeTypeOf("function");
  });
});
