import { describe, expect, it } from "vitest";

import { settingsSchema } from "@/features/settings/schemas/settings.schema";

describe("settingsSchema", () => {
  it("accepts valid branding input", () => {
    const result = settingsSchema.safeParse({
      shopTitle: "Tapsilog Hub",
      tagline: "Fresh daily",
      primaryColor: "#1a1a1a",
      accentColor: "#2f5d50",
      backgroundColor: "#f7f4ef",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid hex colors", () => {
    const result = settingsSchema.safeParse({
      shopTitle: "Shop",
      primaryColor: "red",
      accentColor: "#2f5d50",
      backgroundColor: "#f7f4ef",
    });
    expect(result.success).toBe(false);
  });

  it("rejects dark page backgrounds", () => {
    const result = settingsSchema.safeParse({
      shopTitle: "Shop",
      primaryColor: "#1a1a1a",
      accentColor: "#2f5d50",
      backgroundColor: "#111111",
    });
    expect(result.success).toBe(false);
  });
});
