import { describe, expect, it } from "vitest";

import { slugifyOrgName } from "@/lib/org-cookie";

describe("slugifyOrgName", () => {
  it("slugifies names into hyphenated lowercase tokens", () => {
    expect(slugifyOrgName("  Hello World Café! ")).toBe("hello-world-caf");
  });

  it("collapses punctuation and trims hyphens", () => {
    expect(slugifyOrgName("---Acme!!!Kitchen---")).toBe("acme-kitchen");
  });

  it("caps length at 48 characters", () => {
    const longName = "a".repeat(60);
    expect(slugifyOrgName(longName)).toHaveLength(48);
  });
});
