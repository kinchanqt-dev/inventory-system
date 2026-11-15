"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { pendingEditSubmitLabel } from "@/lib/form-submit-label";
import { navigateWithUnsavedGuard } from "@/lib/unsaved-changes.store";

import { useFormDirtyGuard } from "@/hooks";

import { Button } from "@/components/ui";

import { ProductFormFields } from "@/features/products/components/product-form-fields";
import { runProductFormSubmit } from "@/features/products/lib/product-form-submit";

import type {
  CategoryOption,
  ProductFormValues,
} from "@/features/products/types/product.types";

interface ProductFormProps {
  categories: CategoryOption[];
  product?: ProductFormValues;
  onSuccess?: () => void;
}

function FormErrorMessage({ error }: Readonly<{ error: string | null }>) {
  if (!error) {
    return null;
  }
  return <p className="text-sm text-destructive">{error}</p>;
}

function activeFlagValue(isActive: boolean | undefined) {
  if (isActive === false) {
    return "false";
  }
  return "true";
}

export function ProductForm({
  categories,
  product,
  onSuccess,
}: Readonly<ProductFormProps>) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [isPending, startTransition] = useTransition();
  const dirty = useFormDirtyGuard(isPending);
  const isEdit = Boolean(product?.id);

  const submitLabel = pendingEditSubmitLabel({
    isPending,
    isEdit,
    createLabel: "Add product",
    editLabel: "Update product",
  });

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("categoryId", categoryId);
    formData.set("isActive", activeFlagValue(product?.isActive));

    startTransition(async () => {
      await runProductFormSubmit({
        productId: product?.id,
        formData,
        isEdit,
        onSuccess,
        router,
        setError,
      });
    });
  }

  return (
    <form
      action={handleSubmit}
      className="mx-auto max-w-3xl space-y-6"
      {...dirty.formDirtyProps}
    >
      <ProductFormFields
        categories={categories}
        categoryId={categoryId}
        onCategoryChange={(value) => {
          dirty.markDirty();
          setCategoryId(value);
        }}
        isEdit={isEdit}
        product={product}
      />
      <FormErrorMessage error={error} />
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          disabled={isPending}
          onClick={() =>
            navigateWithUnsavedGuard("/products", (href) => router.push(href))
          }
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="min-h-11">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
