import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/session", () => ({
  requireRole: vi.fn(async () => ({ user: { id: "u1", role: "OWNER" } })),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    product: {
      create: vi.fn(),
      update: vi.fn(),
      findUniqueOrThrow: vi.fn(),
    },
    stockItem: {
      update: vi.fn(),
    },
    $transaction: vi.fn(async (ops: unknown) => ops),
  },
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
