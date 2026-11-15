"use client";

import { useState } from "react";

import { ConfirmAlertDialog } from "@/components/shared/confirm-alert-dialog";
import { Button } from "@/components/ui";

interface SubRecipeFormActionsProps {
  isEdit: boolean;
  isPending: boolean;
  isDeleting: boolean;
  submitLabel: string;
  deleteName?: string;
  onCancel: () => void;
  onDelete: () => void;
}

function deleteConfirmTitle(deleteName?: string) {
  if (deleteName) {
    return `Delete “${deleteName}”?`;
  }
  return "Delete this sub-recipe?";
}

function SubRecipeDeleteControls({
  busy,
  isDeleting,
  deleteName,
  onDelete,
}: Readonly<{
  busy: boolean;
  isDeleting: boolean;
  deleteName?: string;
  onDelete: () => void;
}>) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        className="min-h-11"
        disabled={busy}
        onClick={() => setConfirmOpen(true)}
      >
        {isDeleting ? "Deleting..." : "Delete sub-recipe"}
      </Button>
      <ConfirmAlertDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={deleteConfirmTitle(deleteName)}
        description="Menu recipes using it will block deletion."
        confirmLabel="Delete"
        destructive
        isPending={isDeleting}
        onConfirm={onDelete}
      />
    </>
  );
}

export function SubRecipeFormActions({
  isEdit,
  isPending,
  isDeleting,
  submitLabel,
  deleteName,
  onCancel,
  onDelete,
}: Readonly<SubRecipeFormActionsProps>) {
  const busy = isPending || isDeleting;

  return (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
      {isEdit ? (
        <SubRecipeDeleteControls
          busy={busy}
          isDeleting={isDeleting}
          deleteName={deleteName}
          onDelete={onDelete}
        />
      ) : (
        <span />
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          disabled={busy}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={busy} className="min-h-11">
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
