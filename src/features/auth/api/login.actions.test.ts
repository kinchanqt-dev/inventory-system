import { beforeEach, describe, expect, it, vi } from "vitest";

const signInWithPassword = vi.fn();
const signOut = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      signInWithPassword,
      signOut,
    },
  })),
}));

vi.mock("@/lib/session", () => ({
  clearSupportOrganizationId: vi.fn(),
  ensurePlatformAdminMetadata: vi.fn(),
  ensureUserProfile: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("login actions", () => {
  beforeEach(() => {
    vi.resetModules();
    signInWithPassword.mockReset();
    signOut.mockReset();
  });

  it("exposes auth actions and rejects invalid payloads", async () => {
    const { loginAction, logoutAction } = await import(
      "@/features/auth/api/login.actions"
    );

    expect(typeof loginAction).toBe("function");
    expect(typeof logoutAction).toBe("function");

    const formData = new FormData();
    formData.set("email", "bad");
    formData.set("password", "");

    await expect(loginAction(undefined, formData)).resolves.toEqual({
      error: expect.any(String),
    });
  });
});
