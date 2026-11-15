import { toast } from "sonner";

interface EntityFormSubmitInput {
  formData: FormData;
  isEdit: boolean;
  entityId?: string;
  createLabel: string;
  updateLabel: string;
  redirectPath: string;
  onSuccess?: () => void;
  router: { push: (path: string) => void; refresh: () => void };
  setError: (error: string | null) => void;
  createAction: (
    formData: FormData,
  ) => Promise<{ error?: string; success?: boolean } | void>;
  updateAction: (
    id: string,
    formData: FormData,
  ) => Promise<{ error?: string; success?: boolean } | void>;
}

async function invokeEntityWrite(input: EntityFormSubmitInput) {
  if (input.entityId) {
    return input.updateAction(input.entityId, input.formData);
  }
  return input.createAction(input.formData);
}

function successLabel(input: EntityFormSubmitInput) {
  if (input.isEdit) {
    return input.updateLabel;
  }
  return input.createLabel;
}

function applyEntityFormSuccess(input: EntityFormSubmitInput) {
  toast.success(successLabel(input));
  input.onSuccess?.();
  input.router.push(input.redirectPath);
  input.router.refresh();
}

export async function runEntityFormSubmit(input: EntityFormSubmitInput) {
  const result = await invokeEntityWrite(input);

  if (result?.error) {
    input.setError(result.error);
    toast.error(result.error);
    return;
  }

  applyEntityFormSuccess(input);
}
