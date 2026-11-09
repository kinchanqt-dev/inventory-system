"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui";

import {
  createProductAction,
  updateProductAction,
} from "@/features/products/api/product.actions";
import { ProductFormFields } from "@/features/products/components/product-form-fields";

import type {
  CategoryOption,
  ProductFormValues,
} from "@/features/products/types/product.types";

interface ProductFormProps {
  categories: CategoryOption[];
  product?: ProductFormValues;
  onSuccess?: () => void;
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
  const isEdit = Boolean(product?.id);
  let submitLabel = "Add product";
  if (isPending) {
    submitLabel = "Saving...";
  } else if (isEdit) {
    submitLabel = "Update product";
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("categoryId", categoryId);
    formData.set("isActive", product?.isActive === false ? "false" : "true");

    startTransition(async () => {
      const result = product?.id
        ? await updateProductAction(product.id, formData)
        : await createProductAction(formData);

      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      toast.success(isEdit ? "Product updated" : "Product created");
      onSuccess?.();
      router.push("/products");
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="mx-auto max-w-3xl space-y-6">
      <ProductFormFields
        categories={categories}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        isEdit={isEdit}
        product={product}
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          disabled={isPending}
          onClick={() => router.push("/products")}
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
