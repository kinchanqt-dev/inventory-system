import { afterEach, describe, expect, it } from "vitest";

import {
  resolveGuardedLinkHref,
  resolveTraverseDelta,
} from "@/lib/unsaved-changes-navigation";

import type {
  LinkClickLike,
  NavigateEventLike,
} from "@/lib/unsaved-changes-navigation";

const CURRENT = "http://localhost:3000/products/new?x=1";

function anchor(href: string, attributes: Record<string, string> = {}) {
  const element = document.createElement("a");
  element.href = href;
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
  const child = document.createElement("span");
  element.append(child);
  document.body.append(element);
  return child;
}

function click(target: EventTarget | null, overrides: Partial<LinkClickLike> = {}) {
  return {
    button: 0,
    defaultPrevented: false,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    target,
    ...overrides,
  };
}

function navigateEvent(overrides: Partial<NavigateEventLike> = {}) {
  return {
    cancelable: true,
    navigationType: "traverse",
    hashChange: false,
    downloadRequest: null,
    destination: { index: 3, url: "http://localhost:3000/products" },
    ...overrides,
  };
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("resolveGuardedLinkHref", () => {
  it("returns the in-app path for a plain click inside a link", () => {
    const target = anchor("http://localhost:3000/ingredients?tab=all#top");

    expect(resolveGuardedLinkHref(click(target), CURRENT)).toBe(
      "/ingredients?tab=all",
    );
  });

  it.each([
    ["middle click", { button: 1 }],
    ["cmd click", { metaKey: true }],
    ["ctrl click", { ctrlKey: true }],
    ["shift click", { shiftKey: true }],
    ["alt click", { altKey: true }],
    ["already handled", { defaultPrevented: true }],
  ])("ignores a %s", (_label, overrides) => {
    const target = anchor("/ingredients");

    expect(resolveGuardedLinkHref(click(target, overrides), CURRENT)).toBeNull();
  });

  it.each([
    ["a new tab", { target: "_blank" }],
    ["a download", { download: "" }],
  ])("ignores a link that opens %s", (_label, attributes) => {
    const target = anchor("/ingredients", attributes);

    expect(resolveGuardedLinkHref(click(target), CURRENT)).toBeNull();
  });

  it("ignores links to another origin", () => {
    const target = anchor("https://example.com/pricing");

    expect(resolveGuardedLinkHref(click(target), CURRENT)).toBeNull();
  });

  it("ignores a hash link on the current page", () => {
    const target = anchor(`${CURRENT}#price`);

    expect(resolveGuardedLinkHref(click(target), CURRENT)).toBeNull();
  });

  it("ignores clicks outside a link", () => {
    const button = document.createElement("button");
    document.body.append(button);

    expect(resolveGuardedLinkHref(click(button), CURRENT)).toBeNull();
    expect(resolveGuardedLinkHref(click(null), CURRENT)).toBeNull();
  });
});

describe("resolveTraverseDelta", () => {
  it("returns the step count for a cancelable Back or Forward", () => {
    expect(resolveTraverseDelta(navigateEvent(), 4)).toBe(-1);
    expect(resolveTraverseDelta(navigateEvent(), 1)).toBe(2);
  });

  it.each([
    ["push", { navigationType: "push" }],
    ["replace", { navigationType: "replace" }],
    ["reload", { navigationType: "reload" }],
    ["non-cancelable traverse", { cancelable: false }],
    ["hash-only traverse", { hashChange: true }],
    ["download", { downloadRequest: "file.pdf" }],
  ])("ignores a %s", (_label, overrides) => {
    expect(resolveTraverseDelta(navigateEvent(overrides), 4)).toBeNull();
  });

  it("ignores a traverse to the current entry", () => {
    expect(resolveTraverseDelta(navigateEvent(), 3)).toBeNull();
  });
});
