"use client";

import { useActionState, useEffect } from "react";

import { useFormDirtyGuard } from "@/hooks";

import { Button } from "@/components/ui";

import { createCategoryAction } from "@/features/categories/api/category.actions";
import { CategoryFormFields } from "@/features/categories/components/category-form-fields";
import { categoryKindLabel } from "@/features/categories/lib/category-kind-label";

import type { CategoryKind } from "@/types/database.types";

interface CategoryCreateFormProps {
  kind: CategoryKind;
  onCreated?: () => void;
}

function submitLabel(isPending: boolean) {
  if (isPending) {
    return "Adding…";
  }
  return "Add category";
}

export function CategoryCreateForm({
  kind,
  onCreated,
}: Readonly<CategoryCreateFormProps>) {
  const [state, formAction, isPending] = useActionState(
    createCategoryAction,
    undefined,
  );
  const dirty = useFormDirtyGuard(isPending);

  useEffect(() => {
    if (state?.success) {
      dirty.markClean();
      onCreated?.();
    }
  }, [state?.success, onCreated, dirty.markClean]);

  return (
    <form action={formAction} className="space-y-4" {...dirty.formDirtyProps}>
      <div>
        <h3 className="font-heading text-base font-semibold tracking-tight">
          Add category
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          For {categoryKindLabel(kind).toLowerCase()}. Names must be unique in
          this list.
        </p>
      </div>

      <CategoryFormFields kind={kind} nameId={`category-name-${kind}`} />

      {state?.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}

      <Button type="submit" className="min-h-11 w-full" disabled={isPending}>
        {submitLabel(isPending)}
      </Button>
    </form>
  );
}
