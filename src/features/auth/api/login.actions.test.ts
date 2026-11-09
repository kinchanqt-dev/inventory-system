import { beforeEach, describe, expect, it, vi } from "vitest";

const signIn = vi.fn();
const signOut = vi.fn();

vi.mock("@/lib/auth", () => ({
  signIn,
  signOut,
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("next-auth", () => ({
  AuthError: class AuthError extends Error {},
}));

describe("login actions", () => {
  beforeEach(() => {
    vi.resetModules();
    signIn.mockReset();
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
