import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/session", () => ({
  requireRole: vi.fn(async () => ({
    user: { id: "u1", role: "OWNER" },
    organization: { id: "org-1" },
  })),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({ from: vi.fn() })),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import {
  createProductAction,
  toggleProductActiveAction,
  updateProductAction,
} from "@/features/products/api/product.actions";

describe("product actions", () => {
  it("exposes action entry points", () => {
    expect(typeof createProductAction).toBe("function");
    expect(typeof updateProductAction).toBe("function");
    expect(typeof toggleProductActiveAction).toBe("function");
  });

  it("rejects invalid create payloads", async () => {
    const formData = new FormData();
    formData.set("sku", "");
    formData.set("name", "");
    formData.set("price", "0");

    await expect(createProductAction(formData)).resolves.toEqual({
      error: expect.any(String),
    });
  });
});
