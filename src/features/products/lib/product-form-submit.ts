import { toast } from "sonner";

import {
  createProductAction,
  updateProductAction,
} from "@/features/products/api/product.actions";

interface RunProductFormSubmitInput {
  productId?: string;
  formData: FormData;
  isEdit: boolean;
  onSuccess?: () => void;
  router: { push: (path: string) => void; refresh: () => void };
  setError: (error: string | null) => void;
}

type CreateProductResult = Awaited<ReturnType<typeof createProductAction>>;

function applyProductFormError(
  input: RunProductFormSubmitInput,
  message: string,
) {
  input.setError(message);
  toast.error(message);
}

function applyProductFormSuccess(
  input: RunProductFormSubmitInput,
  redirectPath: string,
  successLabel: string,
) {
  toast.success(successLabel);
  input.onSuccess?.();
  input.router.push(redirectPath);
  input.router.refresh();
}

function createFailureMessage(result: CreateProductResult) {
  if (result && "error" in result && result.error) {
    return result.error;
  }
  return "Could not create product.";
}

function createdProductId(result: CreateProductResult) {
  if (!result || !("productId" in result)) {
    return null;
  }
  return result.productId ?? null;
}

async function runProductCreate(input: RunProductFormSubmitInput) {
  const result = await createProductAction(input.formData);
  const productId = createdProductId(result);

  if (!productId) {
    applyProductFormError(input, createFailureMessage(result));
    return;
  }

  applyProductFormSuccess(input, "/products", "Product created");
}

async function runProductUpdate(input: RunProductFormSubmitInput) {
  if (!input.productId) {
    applyProductFormError(input, "Could not update product.");
    return;
  }

  const result = await updateProductAction(input.productId, input.formData);

  if (result?.error) {
    applyProductFormError(input, result.error);
    return;
  }

  applyProductFormSuccess(input, "/products", "Product updated");
}

export async function runProductFormSubmit(input: RunProductFormSubmitInput) {
  if (input.isEdit) {
    await runProductUpdate(input);
    return;
  }

  await runProductCreate(input);
}
