export function firstZodIssueMessage(
  issues: Array<{ message: string }>,
  fallback: string,
): string {
  return issues[0]?.message ?? fallback;
}