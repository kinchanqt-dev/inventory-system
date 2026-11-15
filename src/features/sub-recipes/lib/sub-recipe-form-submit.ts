import {
  createSubRecipeAction,
  updateSubRecipeAction,
} from "@/features/sub-recipes/api/sub-recipe.actions";
import { runEntityFormSubmit } from "@/lib/entity-form-submit";

interface RunSubRecipeFormSubmitInput {
  subRecipeId?: string;
  formData: FormData;
  isEdit: boolean;
  onSuccess?: () => void;
  router: { push: (path: string) => void; refresh: () => void };
  setError: (error: string | null) => void;
}

export async function runSubRecipeFormSubmit(
  input: RunSubRecipeFormSubmitInput,
) {
  return runEntityFormSubmit({
    formData: input.formData,
    isEdit: input.isEdit,
    entityId: input.subRecipeId,
    createLabel: "Sub-recipe created",
    updateLabel: "Sub-recipe updated",
    redirectPath: "/sub-recipes",
    onSuccess: input.onSuccess,
    router: input.router,
    setError: input.setError,
    createAction: createSubRecipeAction,
    updateAction: updateSubRecipeAction,
  });
}
