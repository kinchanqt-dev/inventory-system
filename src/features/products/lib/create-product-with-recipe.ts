import { toast } from "sonner";

import {
  createProductAction,
  validateOpeningStockForRecipeAction,
} from "@/features/products/api/product.actions";
import { replaceProductRecipeAction } from "@/features/products/api/recipe.actions";
import { linesToSubmitPayload } from "@/features/products/lib/recipe-line-payload";

import type { RecipeLineFormValues } from "@/features/products/types/recipe.types";

interface CreateProductWithRecipeInput {
  formData: FormData;
  lines: RecipeLineFormValues[];
  setError: (error: string | null) => void;
  router: { push: (path: string) => void; refresh: () => void };
}

type CreateProductResult = Awaited<ReturnType<typeof createProductAction>>;

function reportError(
  input: CreateProductWithRecipeInput,
  message: string,
) {
  input.setError(message);
  toast.error(message);
}

function createdProductId(result: CreateProductResult) {
  if (!result || !("productId" in result)) {
    return null;
  }
  return result.productId ?? null;
}

function createFailureMessage(result: CreateProductResult) {
  if (result && "error" in result && result.error) {
    return result.error;
  }
  return "Could not create product.";
}

function readOpeningQuantity(formData: FormData) {
  const raw = formData.get("quantity");
  if (typeof raw !== "string" || raw.trim() === "") {
    return 0;
  }
  const quantity = Number(raw);
  return Number.isFinite(quantity) ? quantity : 0;
}

async function saveCreatedProductRecipe(
  input: CreateProductWithRecipeInput,
  productId: string,
) {
  const recipeData = new FormData();
  recipeData.set(
    "linesJson",
    JSON.stringify(linesToSubmitPayload(input.lines)),
  );

  const recipeResult = await replaceProductRecipeAction(productId, recipeData);
  if (recipeResult?.error) {
    reportError(input, recipeResult.error);
    input.router.push(`/products/${productId}/edit`);
    input.router.refresh();
    return false;
  }

  return true;
}

export async function createProductWithRecipe(
  input: CreateProductWithRecipeInput,
) {
  const stockCheck = await validateOpeningStockForRecipeAction(
    readOpeningQuantity(input.formData),
    input.lines,
  );
  if (stockCheck.error) {
    reportError(input, stockCheck.error);
    return;
  }

  const created = await createProductAction(input.formData);
  const productId = createdProductId(created);

  if (!productId) {
    reportError(input, createFailureMessage(created));
    return;
  }

  const recipeSaved = await saveCreatedProductRecipe(input, productId);
  if (!recipeSaved) {
    return;
  }

  toast.success("Product created");
  input.router.push("/products");
  input.router.refresh();
}
