/**
 * Module-level unsaved-changes state shared by `useUnsavedChangesGuard` (one
 * guarded form per page) and the global `UnsavedChangesDialog`.
 */

type UnsavedLeaveTarget =
  | { kind: "href"; href: string }
  | { kind: "traverse"; delta: number };

interface UnsavedChangesSnapshot {
  enabled: boolean;
  pendingLeave: UnsavedLeaveTarget | null;
}

interface UnsavedLeaveActions {
  navigate: (href: string) => void;
  traverse: (delta: number) => void;
}

const listeners = new Set<() => void>();

let snapshot: UnsavedChangesSnapshot = { enabled: false, pendingLeave: null };

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

function subscribeUnsavedChanges(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getUnsavedChangesSnapshot(): UnsavedChangesSnapshot {
  return snapshot;
}

function setUnsavedChangesGuard(enabled: boolean): void {
  if (snapshot.enabled === enabled) {
    return;
  }
  snapshot = {
    enabled,
    pendingLeave: enabled ? snapshot.pendingLeave : null,
  };
  emit();
}

/** Queues a blocked navigation for the dialog. Returns false when the guard is off. */
function requestUnsavedLeave(target: UnsavedLeaveTarget): boolean {
  if (!snapshot.enabled) {
    return false;
  }
  snapshot = { ...snapshot, pendingLeave: target };
  emit();
  return true;
}

function cancelUnsavedLeave(): void {
  if (snapshot.pendingLeave === null) {
    return;
  }
  snapshot = { ...snapshot, pendingLeave: null };
  emit();
}

function replayUnsavedLeave(
  target: UnsavedLeaveTarget | null,
  actions: UnsavedLeaveActions,
): void {
  if (!target) {
    return;
  }
  if (target.kind === "href") {
    actions.navigate(target.href);
    return;
  }
  actions.traverse(target.delta);
}

/**
 * Turns the guard off first so the replayed navigation is not blocked again,
 * then replays it: Back/Forward via `traverse`, links via `navigate`.
 */
function confirmUnsavedLeave(actions: UnsavedLeaveActions): void {
  const target = snapshot.pendingLeave;
  snapshot = { enabled: false, pendingLeave: null };
  emit();
  replayUnsavedLeave(target, actions);
}

/** For Cancel buttons that use `router.push` instead of `<Link>`. */
function navigateWithUnsavedGuard(
  href: string,
  navigate: (href: string) => void,
): void {
  if (requestUnsavedLeave({ kind: "href", href })) {
    return;
  }
  navigate(href);
}

export {
  cancelUnsavedLeave,
  confirmUnsavedLeave,
  getUnsavedChangesSnapshot,
  navigateWithUnsavedGuard,
  requestUnsavedLeave,
  setUnsavedChangesGuard,
  subscribeUnsavedChanges,
};

export type { UnsavedChangesSnapshot, UnsavedLeaveActions, UnsavedLeaveTarget };
