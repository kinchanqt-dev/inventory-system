import { describe, expect, it } from "vitest";

import { paginateItems } from "@/lib/paginate";

describe("paginateItems", () => {
  it("slices the requested page", () => {
    const items = [1, 2, 3, 4, 5];
    expect(paginateItems(items, 1, 2)).toEqual([1, 2]);
    expect(paginateItems(items, 2, 2)).toEqual([3, 4]);
    expect(paginateItems(items, 3, 2)).toEqual([5]);
  });

  it("treats invalid pages as page 1", () => {
    expect(paginateItems([1, 2, 3], 0, 2)).toEqual([1, 2]);
  });
});
