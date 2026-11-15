export function categoryErrorMessage(
  error: { code?: string; message: string } | null | undefined,
  fallback: string,
) {
  if (!error) {
    return fallback;
  }
  if (error.code === "23505") {
    return "A category with that name already exists for this type.";
  }
  return error.message || fallback;
}
