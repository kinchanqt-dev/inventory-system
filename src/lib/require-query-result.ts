export function requireQueryResult<T>(
  data: T | null | undefined,
  error: { message: string } | null | undefined,
  fallbackMessage: string,
): T {
  if (error) {
    throw new Error(error.message);
  }
  if (data == null) {
    throw new Error(fallbackMessage);
  }
  return data;
}

function hasDefinedValue<T>(value: T | null | undefined): value is T {
  return value != null && value !== "";
}

export function pickDefined<T>(
  primary: T | null | undefined,
  secondary: T | null | undefined,
  fallback: T,
): T {
  if (hasDefinedValue(primary)) {
    return primary;
  }
  if (hasDefinedValue(secondary)) {
    return secondary;
  }
  return fallback;
}
