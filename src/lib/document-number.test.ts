import { describe, expect, it } from "vitest";

import { buildTimedDocumentNumber } from "@/lib/document-number";

describe("buildTimedDocumentNumber", () => {
  it("prefixes a timed stamp", () => {
    const value = buildTimedDocumentNumber("S", new Date("2026-01-15T12:34:56.000Z"));
    expect(value.startsWith("S20260115123456")).toBe(true);
    expect(value).toHaveLength("S20260115123456".length + 3);
  });
});
