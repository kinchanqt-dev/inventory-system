"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  cancelUnsavedLeave,
  confirmUnsavedLeave,
  getUnsavedChangesSnapshot,
  subscribeUnsavedChanges,
} from "@/lib/unsaved-changes.store";

import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from "@/components/ui";

type ShortcutTone = "neutral" | "onDanger";

function ShortcutHint({
  label,
  tone,
}: Readonly<{ label: string; tone: ShortcutTone }>) {
  return (
    <kbd
      className={cn(
        "rounded-md border px-1.5 py-0.5 font-sans text-sm font-semibold leading-none tracking-wide",
        tone === "neutral" &&
          "border-foreground/35 bg-background text-foreground",
        tone === "onDanger" && "border-white/70 bg-black/35 text-white",
      )}
    >
      {label}
    </kbd>
  );
}

/**
 * Mounted once in the root layout. Opens when `useUnsavedChangesGuard` blocks an
 * in-app link or Back/Forward, and replays that navigation on confirm.
 */
export function UnsavedChangesDialog() {
  const router = useRouter();
  const { pendingLeave } = useSyncExternalStore(
    subscribeUnsavedChanges,
    getUnsavedChangesSnapshot,
    getUnsavedChangesSnapshot,
  );
  const open = pendingLeave !== null;

  function handleLeave() {
    confirmUnsavedLeave({
      navigate: (href) => router.push(href),
      traverse: (delta) => globalThis.history.go(delta),
    });
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Enter" || event.defaultPrevented) {
        return;
      }
      event.preventDefault();
      confirmUnsavedLeave({
        navigate: (href) => router.push(href),
        traverse: (delta) => globalThis.history.go(delta),
      });
    }

    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  }, [open, router]);

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          cancelUnsavedLeave();
        }
      }}
    >
      {open ? (
        <AlertDialogContent className="gap-5 p-5 sm:max-w-88">
          <AlertDialogHeader className="gap-3">
            <div
              className="flex size-9 items-center justify-center rounded-lg bg-foreground text-background"
              aria-hidden
            >
              <TriangleAlert className="size-4" />
            </div>
            <div className="space-y-1.5">
              <AlertDialogTitle className="font-sans text-xl font-semibold tracking-tight text-foreground">
                Leave without saving?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm leading-snug text-foreground/80">
                Changes you made may not be saved.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter className="border-0 pt-0 sm:justify-end">
            <AlertDialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11 gap-2 border-foreground/40 bg-background px-3.5 text-foreground hover:bg-muted"
                  aria-keyshortcuts="Escape"
                />
              }
            >
              Stay
              <ShortcutHint label="esc" tone="neutral" />
            </AlertDialogClose>
            <Button
              type="button"
              className="min-h-11 gap-2 bg-red-700 px-3.5 text-white hover:bg-red-800 focus-visible:border-red-800 focus-visible:ring-red-700/40"
              aria-keyshortcuts="Enter"
              onClick={handleLeave}
            >
              Leave
              <ShortcutHint label="⏎" tone="onDanger" />
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      ) : null}
    </AlertDialog>
  );
}
