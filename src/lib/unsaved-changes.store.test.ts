import { afterEach, describe, expect, it, vi } from "vitest";

import {
  cancelUnsavedLeave,
  confirmUnsavedLeave,
  getUnsavedChangesSnapshot,
  navigateWithUnsavedGuard,
  requestUnsavedLeave,
  setUnsavedChangesGuard,
  subscribeUnsavedChanges,
} from "@/lib/unsaved-changes.store";

function leaveActions() {
  return { navigate: vi.fn(), traverse: vi.fn() };
}

afterEach(() => {
  setUnsavedChangesGuard(false);
});

describe("unsaved-changes store", () => {
  it("ignores leave requests while the guard is off", () => {
    expect(requestUnsavedLeave({ kind: "href", href: "/products" })).toBe(
      false,
    );
    expect(getUnsavedChangesSnapshot().pendingLeave).toBeNull();
  });

  it("queues a leave request while the guard is on and notifies subscribers", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeUnsavedChanges(listener);
    setUnsavedChangesGuard(true);

    expect(requestUnsavedLeave({ kind: "traverse", delta: -1 })).toBe(true);
    expect(getUnsavedChangesSnapshot().pendingLeave).toEqual({
      kind: "traverse",
      delta: -1,
    });
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
  });

  it("keeps the guard on but drops the request on cancel", () => {
    setUnsavedChangesGuard(true);
    requestUnsavedLeave({ kind: "href", href: "/products" });

    cancelUnsavedLeave();

    expect(getUnsavedChangesSnapshot()).toEqual({
      enabled: true,
      pendingLeave: null,
    });
  });

  it("clears a pending request when the guard turns off", () => {
    setUnsavedChangesGuard(true);
    requestUnsavedLeave({ kind: "href", href: "/products" });

    setUnsavedChangesGuard(false);

    expect(getUnsavedChangesSnapshot().pendingLeave).toBeNull();
  });

  it("replays a blocked link with navigate and turns the guard off first", () => {
    const actions = leaveActions();
    actions.navigate.mockImplementation(() => {
      expect(getUnsavedChangesSnapshot().enabled).toBe(false);
    });
    setUnsavedChangesGuard(true);
    requestUnsavedLeave({ kind: "href", href: "/products" });

    confirmUnsavedLeave(actions);

    expect(actions.navigate).toHaveBeenCalledWith("/products");
    expect(actions.traverse).not.toHaveBeenCalled();
  });

  it("replays a blocked Back/Forward with traverse", () => {
    const actions = leaveActions();
    setUnsavedChangesGuard(true);
    requestUnsavedLeave({ kind: "traverse", delta: -2 });

    confirmUnsavedLeave(actions);

    expect(actions.traverse).toHaveBeenCalledWith(-2);
    expect(actions.navigate).not.toHaveBeenCalled();
  });

  it("does nothing on confirm when no leave is pending", () => {
    const actions = leaveActions();

    confirmUnsavedLeave(actions);

    expect(actions.navigate).not.toHaveBeenCalled();
    expect(actions.traverse).not.toHaveBeenCalled();
  });

  it("navigateWithUnsavedGuard queues when enabled and navigates when off", () => {
    const navigate = vi.fn();
    setUnsavedChangesGuard(true);
    navigateWithUnsavedGuard("/products", navigate);
    expect(navigate).not.toHaveBeenCalled();
    expect(getUnsavedChangesSnapshot().pendingLeave).toEqual({
      kind: "href",
      href: "/products",
    });

    setUnsavedChangesGuard(false);
    navigateWithUnsavedGuard("/ingredients", navigate);
    expect(navigate).toHaveBeenCalledWith("/ingredients");
  });
});
