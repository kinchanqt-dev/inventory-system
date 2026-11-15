import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/session", () => ({
  requireSession: vi.fn(async () => ({
    user: { id: "u1", role: "OWNER" },
    organization: { id: "org-1" },
  })),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn(),
      single: vi.fn(),
    })),
  })),
}));

vi.mock("@/features/kitchen/api/kitchen.actions", () => ({
  createKitchenTicketForSale: vi.fn(async () => ({ skipped: true })),
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
