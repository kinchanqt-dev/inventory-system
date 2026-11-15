export function matchesSearchFields(
  fields: Array<string | null | undefined>,
  normalizedQuery: string,
): boolean {
  if (!normalizedQuery) {
    return true;
  }

  return fields.some((field) =>
    (field ?? "").toLowerCase().includes(normalizedQuery),
  );
}
