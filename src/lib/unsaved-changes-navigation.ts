/**
 * Decides which navigations the unsaved-changes guard should intercept.
 *
 * Next.js writes history for `router.push` / `<Link>` only after the new page
 * has rendered, so cancelling those through the Navigation API would leave the
 * URL behind the screen. Links are therefore caught at click time, and only
 * Back/Forward (`traverse`) go through the Navigation API.
 */

interface LinkClickLike {
  button: number;
  defaultPrevented: boolean;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  target: EventTarget | null;
}

/** Subset of the Navigation API `NavigateEvent` (not in TS's DOM lib yet). */
interface NavigateEventLike {
  cancelable: boolean;
  navigationType: string;
  hashChange: boolean;
  downloadRequest?: string | null;
  destination: { index: number; url: string };
}

function hasModifierKey(event: LinkClickLike): boolean {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function isPlainLeftClick(event: LinkClickLike): boolean {
  if (event.button !== 0) {
    return false;
  }
  if (event.defaultPrevented) {
    return false;
  }
  return !hasModifierKey(event);
}

function closestAnchor(target: EventTarget | null): HTMLAnchorElement | null {
  if (!(target instanceof Element)) {
    return null;
  }
  return target.closest("a[href]");
}

function opensElsewhere(anchor: HTMLAnchorElement): boolean {
  const target = anchor.getAttribute("target");
  if (target !== null && target !== "_self") {
    return true;
  }
  return anchor.hasAttribute("download");
}

function sameOriginPath(
  currentHref: string,
  anchorHref: string,
): string | null {
  const current = new URL(currentHref);
  const next = new URL(anchorHref, current);
  if (next.origin !== current.origin) {
    return null;
  }
  const nextPath = `${next.pathname}${next.search}`;
  const currentPath = `${current.pathname}${current.search}`;
  if (nextPath === currentPath) {
    return null;
  }
  return nextPath;
}

/**
 * Returns the in-app path (`pathname + search`) a click would navigate to, or
 * null when the click should pass through: modified clicks, new tabs,
 * downloads, other origins (left to `beforeunload`), and same-page hash links.
 */
function resolveGuardedLinkHref(
  event: LinkClickLike,
  currentHref: string,
): string | null {
  if (!isPlainLeftClick(event)) {
    return null;
  }
  const anchor = closestAnchor(event.target);
  if (!anchor || opensElsewhere(anchor)) {
    return null;
  }
  return sameOriginPath(currentHref, anchor.href);
}

function isCancelableTraverse(event: NavigateEventLike): boolean {
  if (event.navigationType !== "traverse") {
    return false;
  }
  if (!event.cancelable || event.hashChange) {
    return false;
  }
  return !event.downloadRequest;
}

/**
 * Returns how many history steps a cancelable Back/Forward would move, or null
 * for anything else (push/replace/reload, hash-only, downloads, or traversals
 * the browser does not let us cancel).
 */
function resolveTraverseDelta(
  event: NavigateEventLike,
  currentIndex: number,
): number | null {
  if (!isCancelableTraverse(event)) {
    return null;
  }
  const delta = event.destination.index - currentIndex;
  if (delta === 0) {
    return null;
  }
  return delta;
}

export { resolveGuardedLinkHref, resolveTraverseDelta };
export type { LinkClickLike, NavigateEventLike };
