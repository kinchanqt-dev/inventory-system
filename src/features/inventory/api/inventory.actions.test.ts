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

import { adjustStockAction } from "@/features/inventory/api/inventory.actions";

describe("adjustStockAction", () => {
  it("exposes inventory adjustment entry point", () => {
    expect(typeof adjustStockAction).toBe("function");
  });

  it("rejects invalid payloads", async () => {
    const formData = new FormData();
    formData.set("productId", "");
    formData.set("type", "IN");
    formData.set("quantity", "0");
    formData.set("reason", "");

    await expect(adjustStockAction(formData)).resolves.toEqual({
      error: expect.any(String),
    });
  });
});
