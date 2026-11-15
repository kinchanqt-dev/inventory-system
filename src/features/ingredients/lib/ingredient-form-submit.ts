import {
  createIngredientAction,
  updateIngredientAction,
} from "@/features/ingredients/api/ingredient.actions";
import { runEntityFormSubmit } from "@/lib/entity-form-submit";

interface RunIngredientFormSubmitInput {
  ingredientId?: string;
  formData: FormData;
  isEdit: boolean;
  onSuccess?: () => void;
  router: { push: (path: string) => void; refresh: () => void };
  setError: (error: string | null) => void;
}

export async function runIngredientFormSubmit(
  input: RunIngredientFormSubmitInput,
) {
  return runEntityFormSubmit({
    formData: input.formData,
    isEdit: input.isEdit,
    entityId: input.ingredientId,
    createLabel: "Ingredient created",
    updateLabel: "Ingredient updated",
    redirectPath: "/ingredients",
    onSuccess: input.onSuccess,
    router: input.router,
    setError: input.setError,
    createAction: createIngredientAction,
    updateAction: updateIngredientAction,
  });
}
