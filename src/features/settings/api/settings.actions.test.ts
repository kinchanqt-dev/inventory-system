import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/session", () => ({
  requireRole: vi.fn(async () => ({ user: { id: "u1", role: "OWNER" } })),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    shopSettings: {
      findUnique: vi.fn(async () => null),
      upsert: vi.fn(async () => ({ id: "default" })),
    },
  },
}));

vi.mock("@/lib/uploads", () => ({
  getImageFile: vi.fn(() => null),
  removeUploadedImage: vi.fn(),
  saveUploadedImage: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  updateTag: vi.fn(),
}));

import { updateShopSettingsAction } from "@/features/settings/api/settings.actions";

describe("updateShopSettingsAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects invalid branding input", async () => {
    const formData = new FormData();
    formData.set("shopTitle", "");
    formData.set("primaryColor", "nope");
    formData.set("accentColor", "#2f5d50");
    formData.set("backgroundColor", "#f7f4ef");

    await expect(updateShopSettingsAction(formData)).resolves.toEqual({
      error: expect.any(String),
    });
  });

  it("saves valid branding", async () => {
    const formData = new FormData();
    formData.set("shopTitle", "Tapsilog Hub");
    formData.set("tagline", "Fresh daily");
    formData.set("primaryColor", "#1a1a1a");
    formData.set("accentColor", "#2f5d50");
    formData.set("backgroundColor", "#f7f4ef");

    await expect(updateShopSettingsAction(formData)).resolves.toEqual({
      success: true,
    });
  });
});
