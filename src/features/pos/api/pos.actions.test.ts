import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/session", () => ({
  requireSession: vi.fn(async () => ({ user: { id: "u1", role: "OWNER" } })),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn(),
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { checkoutAction } from "@/features/pos/api/pos.actions";

describe("checkoutAction", () => {
  it("exposes checkout entry point", () => {
    expect(typeof checkoutAction).toBe("function");
  });

  it("rejects empty carts", async () => {
    await expect(
      checkoutAction({
        items: [],
        paymentMethod: "QRPH",
        discountCents: 0,
      }),
    ).resolves.toEqual({
      error: expect.any(String),
    });
  });
});
