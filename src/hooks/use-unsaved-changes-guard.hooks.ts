"use client";

import { useEffect } from "react";

import {
  resolveGuardedLinkHref,
  resolveTraverseDelta,
} from "@/lib/unsaved-changes-navigation";
import {
  getUnsavedChangesSnapshot,
  requestUnsavedLeave,
  setUnsavedChangesGuard,
} from "@/lib/unsaved-changes.store";

import type { NavigateEventLike } from "@/lib/unsaved-changes-navigation";

/** Subset of `window.navigation` (Navigation API; not in TS's DOM lib yet). */
interface NavigationLike extends EventTarget {
  currentEntry: { index: number } | null;
}

function getNavigation(): NavigationLike | undefined {
  return (globalThis as { navigation?: NavigationLike }).navigation;
}

function onBeforeUnload(event: BeforeUnloadEvent): void {
  if (getUnsavedChangesSnapshot().enabled) {
    event.preventDefault();
  }
}

function onLinkClick(event: MouseEvent): void {
  const href = resolveGuardedLinkHref(event, globalThis.location.href);
  if (href && requestUnsavedLeave({ kind: "href", href })) {
    event.preventDefault();
  }
}

function blockTraverseIfNeeded(event: Event, index: number): void {
  const delta = resolveTraverseDelta(
    event as unknown as NavigateEventLike,
    index,
  );
  if (delta === null) {
    return;
  }
  if (requestUnsavedLeave({ kind: "traverse", delta })) {
    event.preventDefault();
  }
}

function onNavigate(event: Event): void {
  const index = getNavigation()?.currentEntry?.index;
  if (index === undefined) {
    return;
  }
  blockTraverseIfNeeded(event, index);
}

/**
 * While `shouldBlock` is true, asks for confirmation before the user leaves
 * through a reload / tab close (browser prompt), an in-app link, or Back /
 * Forward (`UnsavedChangesDialog`). Back/Forward needs the Navigation API and
 * a traversal the browser allows cancelling. Programmatic `router.push` (e.g.
 * the redirect after a successful save) is never blocked — use
 * `navigateWithUnsavedGuard` for Cancel buttons.
 */
function useUnsavedChangesGuard(shouldBlock: boolean): void {
  useEffect(() => {
    if (!shouldBlock) {
      return;
    }

    setUnsavedChangesGuard(true);
    const navigation = getNavigation();
    globalThis.addEventListener("beforeunload", onBeforeUnload);
    // Capture on `document` runs before React's root listeners, so Next's
    // `<Link>` sees `defaultPrevented` and skips its client navigation.
    document.addEventListener("click", onLinkClick, true);
    navigation?.addEventListener("navigate", onNavigate);

    return () => {
      setUnsavedChangesGuard(false);
      globalThis.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onLinkClick, true);
      navigation?.removeEventListener("navigate", onNavigate);
    };
  }, [shouldBlock]);
}

export { useUnsavedChangesGuard };
