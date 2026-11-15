"use client";

import { Button, DialogClose, DialogFooter } from "@/components/ui";

interface AdjustmentFormDialogFooterProps {
  isPending: boolean;
}

export function AdjustmentFormDialogFooter({
  isPending,
}: Readonly<AdjustmentFormDialogFooterProps>) {
  return (
    <DialogFooter>
      <DialogClose
        render={<Button type="button" variant="outline" className="min-h-11" />}
      >
        Cancel
      </DialogClose>
      <Button type="submit" disabled={isPending} className="min-h-11">
        {isPending ? "Saving..." : "Save adjustment"}
      </Button>
    </DialogFooter>
  );
}