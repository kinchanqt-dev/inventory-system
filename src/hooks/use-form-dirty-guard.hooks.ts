"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard.hooks";

/**
 * Tracks dirty state for uncontrolled FormData forms via input/change, and
 * enables the unsaved-changes guard while dirty and not submitting.
 */
export function useFormDirtyGuard(isSubmitting: boolean) {
  const [isDirty, setIsDirty] = useState(false);

  useUnsavedChangesGuard(isDirty && !isSubmitting);

  const markDirty = useCallback(() => {
    setIsDirty(true);
  }, []);

  const markClean = useCallback(() => {
    setIsDirty(false);
  }, []);

  return {
    isDirty,
    markDirty,
    markClean,
    formDirtyProps: {
      onInput: markDirty,
      onChange: markDirty,
    } as const,
  };
}

/** Marks dirty when a serializable value diverges from its first render. */
export function useDirtyWhenChanged(
  value: unknown,
  markDirty: () => void,
): void {
  const baseline = useRef<string | null>(null);
  const serialized = JSON.stringify(value);

  useEffect(() => {
    if (baseline.current === null) {
      baseline.current = serialized;
      return;
    }
    if (serialized !== baseline.current) {
      markDirty();
    }
  }, [markDirty, serialized]);
}
