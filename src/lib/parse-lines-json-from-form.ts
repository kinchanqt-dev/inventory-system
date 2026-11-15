export function parseLinesJsonFromFormData(
  formData: FormData,
  parseErrorMessage: string,
): { lines: unknown } | { parseError: string } {
  const linesJson = formData.get("linesJson");
  let lines: unknown = [];

  if (typeof linesJson === "string" && linesJson.trim().length > 0) {
    try {
      lines = JSON.parse(linesJson) as unknown;
    } catch {
      return { parseError: parseErrorMessage };
    }
  }

  return { lines };
}