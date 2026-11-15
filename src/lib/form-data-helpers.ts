export function formDataString(
  formData: FormData,
  key: string,
  fallback = "",
) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return fallback;
  }
  return value.length > 0 ? value : fallback;
}

export function formDataBoolean(
  formData: FormData,
  key: string,
  whenTrue = true,
  whenFalse = false,
) {
  return formData.get(key) === "true" ? whenTrue : whenFalse;
}

export function formDataNumberField(
  formData: FormData,
  key: string,
  fallback: number,
) {
  const raw = formData.get(key);
  if (raw == null || raw === "") {
    return fallback;
  }
  return raw;
}