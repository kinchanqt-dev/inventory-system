"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { useFormDirtyGuard } from "@/hooks";

import { Button, Input, Label } from "@/components/ui";

import { updateCategoryAction } from "@/features/categories/api/category.actions";

import type { CategoryListItem } from "@/features/categories/types/category.types";

interface CategoryEditFormProps {
  category: CategoryListItem;
  onDone: () => void;
  onCancel: () => void;
}

export function CategoryEditForm({
  category,
  onDone,
  onCancel,
}: Readonly<CategoryEditFormProps>) {
  const [isPending, startTransition] = useTransition();
  const dirty = useFormDirtyGuard(isPending);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateCategoryAction(category.id, formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      dirty.markClean();
      toast.success("Category updated");
      onDone();
    });
  }

  return (
    <form
      action={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
      {...dirty.formDirtyProps}
    >
      <input type="hidden" name="kind" value={category.kind} />
      <div className="min-w-0 flex-1 space-y-2">
        <Label htmlFor={`edit-category-${category.id}`}>Name</Label>
        <Input
          id={`edit-category-${category.id}`}
          name="name"
          type="text"
          defaultValue={category.name}
          required
          maxLength={80}
          className="min-h-11"
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          disabled={isPending}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" className="min-h-11" disabled={isPending}>
          {isPending ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}
