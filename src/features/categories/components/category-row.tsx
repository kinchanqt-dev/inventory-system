"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { ConfirmAlertDialog } from "@/components/shared/confirm-alert-dialog";
import { Button } from "@/components/ui";

import { deleteCategoryAction } from "@/features/categories/api/category.actions";
import { CategoryEditForm } from "@/features/categories/components/category-edit-form";

import type { CategoryListItem } from "@/features/categories/types/category.types";

interface CategoryRowProps {
  category: CategoryListItem;
}

export function CategoryRow({ category }: Readonly<CategoryRowProps>) {
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirmDelete() {
    startTransition(async () => {
      const result = await deleteCategoryAction(category.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setConfirmOpen(false);
      toast.success("Category deleted");
    });
  }

  if (editing) {
    return (
      <li className="border-b border-border/60 px-4 py-3.5 last:border-b-0 sm:px-5">
        <CategoryEditForm
          category={category}
          onCancel={() => setEditing(false)}
          onDone={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-3.5 last:border-b-0 sm:px-5">
      <div className="min-w-0">
        <p className="font-medium">{category.name}</p>
        <p className="text-xs text-muted-foreground">{category.slug}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-11"
          disabled={isPending}
          onClick={() => setEditing(true)}
        >
          Edit
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-11"
          disabled={isPending}
          onClick={() => setConfirmOpen(true)}
        >
          {isPending ? "Deleting…" : "Delete"}
        </Button>
      </div>

      <ConfirmAlertDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Delete “${category.name}”?`}
        description="Items using it will become uncategorized."
        confirmLabel="Delete"
        destructive
        isPending={isPending}
        onConfirm={handleConfirmDelete}
      />
    </li>
  );
}
