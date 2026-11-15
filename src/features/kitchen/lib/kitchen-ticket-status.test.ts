import { describe, expect, it } from "vitest";

import {
  buildKitchenTicketNumber,
  isKitchenTicketFinished,
  kitchenStatusTimestampPatch,
  nextKitchenTicketStatus,
} from "@/features/kitchen/lib/kitchen-ticket-status";

describe("kitchen ticket status helpers", () => {
  it("builds kitchen ticket numbers", () => {
    expect(buildKitchenTicketNumber("S123")).toBe("K123");
    expect(buildKitchenTicketNumber("K999")).toBe("K999");
    expect(buildKitchenTicketNumber("ABC")).toBe("KABC");
    expect(buildKitchenTicketNumber("   ").startsWith("K")).toBe(true);
  });

  it("advances statuses in order", () => {
    expect(nextKitchenTicketStatus("NEW")).toBe("IN_PROGRESS");
    expect(nextKitchenTicketStatus("IN_PROGRESS")).toBe("READY");
    expect(nextKitchenTicketStatus("READY")).toBe("DONE");
    expect(nextKitchenTicketStatus("DONE")).toBeNull();
    expect(nextKitchenTicketStatus("CANCELLED")).toBeNull();
  });

  it("builds timestamp patches", () => {
    const now = "2026-01-01T00:00:00.000Z";
    expect(kitchenStatusTimestampPatch("NEW", "IN_PROGRESS", now)).toEqual({
      started_at: now,
    });
    expect(kitchenStatusTimestampPatch("IN_PROGRESS", "READY", now)).toEqual({
      ready_at: now,
    });
    expect(kitchenStatusTimestampPatch("READY", "DONE", now)).toEqual({
      done_at: now,
    });
    expect(kitchenStatusTimestampPatch("NEW", "DONE", now)).toEqual({});
  });

  it("detects finished tickets", () => {
    expect(isKitchenTicketFinished("DONE")).toBe(true);
    expect(isKitchenTicketFinished("CANCELLED")).toBe(true);
    expect(isKitchenTicketFinished("READY")).toBe(false);
  });
});
