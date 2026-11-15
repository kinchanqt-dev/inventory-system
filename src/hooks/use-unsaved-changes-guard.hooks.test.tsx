import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  getUnsavedChangesSnapshot,
  setUnsavedChangesGuard,
} from "@/lib/unsaved-changes.store";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard.hooks";

interface FakeNavigation extends EventTarget {
  currentEntry: { index: number };
}

function installNavigation(index: number): FakeNavigation {
  const navigation = Object.assign(new EventTarget(), {
    currentEntry: { index },
  });
  Object.defineProperty(globalThis, "navigation", {
    configurable: true,
    value: navigation,
  });
  return navigation;
}

function dispatchBeforeUnload(): boolean {
  const event = new Event("beforeunload", { cancelable: true });
  globalThis.dispatchEvent(event);
  return event.defaultPrevented;
}

/** Returns whether the guard blocked the click; always stops jsdom's own navigation. */
function clickLink(href: string): boolean {
  const link = document.createElement("a");
  link.href = href;
  document.body.append(link);
  let blocked = false;
  link.addEventListener("click", (event) => {
    blocked = event.defaultPrevented;
    event.preventDefault();
  });
  link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  return blocked;
}

function dispatchTraverse(navigation: FakeNavigation, destinationIndex: number) {
  const event = Object.assign(new Event("navigate", { cancelable: true }), {
    navigationType: "traverse",
    hashChange: false,
    downloadRequest: null,
    destination: {
      index: destinationIndex,
      url: "http://localhost:3000/products",
    },
  });
  navigation.dispatchEvent(event);
  return event.defaultPrevented;
}

function expectNothingBlocked(navigation: FakeNavigation): void {
  expect(dispatchBeforeUnload()).toBe(false);
  expect(clickLink("/products")).toBe(false);
  expect(dispatchTraverse(navigation, 1)).toBe(false);
  expect(getUnsavedChangesSnapshot().pendingLeave).toBeNull();
}

beforeEach(() => {
  globalThis.history.replaceState(null, "", "/products/new");
});

afterEach(() => {
  cleanup();
  setUnsavedChangesGuard(false);
  document.body.innerHTML = "";
  Reflect.deleteProperty(globalThis, "navigation");
});

describe("useUnsavedChangesGuard", () => {
  it("does nothing while the form has no unsaved changes", () => {
    const navigation = installNavigation(2);
    renderHook(() => useUnsavedChangesGuard(false));

    expectNothingBlocked(navigation);
  });

  it("asks the browser to confirm a reload or tab close", () => {
    renderHook(() => useUnsavedChangesGuard(true));

    expect(dispatchBeforeUnload()).toBe(true);
  });

  it("blocks an in-app link and queues it for the dialog", () => {
    renderHook(() => useUnsavedChangesGuard(true));

    expect(clickLink("/products")).toBe(true);
    expect(getUnsavedChangesSnapshot().pendingLeave).toEqual({
      kind: "href",
      href: "/products",
    });
  });

  it("blocks browser Back and queues the step count for the dialog", () => {
    const navigation = installNavigation(2);
    renderHook(() => useUnsavedChangesGuard(true));

    expect(dispatchTraverse(navigation, 1)).toBe(true);
    expect(getUnsavedChangesSnapshot().pendingLeave).toEqual({
      kind: "traverse",
      delta: -1,
    });
  });

  it("still guards links and reloads when the Navigation API is missing", () => {
    renderHook(() => useUnsavedChangesGuard(true));

    expect(clickLink("/products")).toBe(true);
    expect(dispatchBeforeUnload()).toBe(true);
  });

  it("lets navigation through again once the leave is confirmed", () => {
    renderHook(() => useUnsavedChangesGuard(true));
    setUnsavedChangesGuard(false);

    expect(clickLink("/products")).toBe(false);
    expect(dispatchBeforeUnload()).toBe(false);
  });

  it("removes every listener when the form stops blocking", () => {
    const navigation = installNavigation(2);
    const { rerender } = renderHook(
      ({ shouldBlock }: { shouldBlock: boolean }) =>
        useUnsavedChangesGuard(shouldBlock),
      { initialProps: { shouldBlock: true } },
    );

    rerender({ shouldBlock: false });

    expect(getUnsavedChangesSnapshot().enabled).toBe(false);
    expectNothingBlocked(navigation);
  });
});
