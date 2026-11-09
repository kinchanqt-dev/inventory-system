import { describe, expect, it } from "vitest";

import { getImageFile } from "@/lib/uploads";

describe("getImageFile", () => {
  it("returns null for missing or empty files", () => {
    const formData = new FormData();
    expect(getImageFile(formData, "image")).toBeNull();

    formData.set("image", new File([], "empty.png", { type: "image/png" }));
    expect(getImageFile(formData, "image")).toBeNull();
  });

  it("returns a non-empty file", () => {
    const formData = new FormData();
    const file = new File([new Uint8Array([1, 2, 3])], "logo.png", {
      type: "image/png",
    });
    formData.set("image", file);
    expect(getImageFile(formData, "image")).toBe(file);
  });
});
