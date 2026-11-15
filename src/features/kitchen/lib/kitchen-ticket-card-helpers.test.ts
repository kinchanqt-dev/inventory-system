import { describe, expect, it } from "vitest";

import {
  formatKitchenTicketAge,
  kitchenAgeToneClass,
  kitchenBumpLabel,
} from "@/features/kitchen/lib/kitchen-ticket-card-helpers";

describe("kitchen ticket card helpers", () => {
  it("formats ages", () => {
    expect(formatKitchenTicketAge(5_000)).toBe("0:05");
    expect(formatKitchenTicketAge(65_000)).toBe("1:05");
    expect(formatKitchenTicketAge(3_661_000)).toBe("1h 1m");
  });

  it("labels bump actions", () => {
    expect(kitchenBumpLabel("NEW")).toBe("Start cooking");
    expect(kitchenBumpLabel("IN_PROGRESS")).toBe("Mark ready");
    expect(kitchenBumpLabel("READY")).toBe("Picked up");
    expect(kitchenBumpLabel("DONE")).toBe("Bump");
  });

  it("picks age tone classes", () => {
    expect(kitchenAgeToneClass(0)).toBe("text-muted-foreground");
    expect(kitchenAgeToneClass(10 * 60 * 1000)).toBe(
      "text-amber-600 dark:text-amber-400",
    );
    expect(kitchenAgeToneClass(20 * 60 * 1000)).toBe("text-destructive");
  });
});
