interface SupabaseQueryResult {
  error: { message: string } | null;
}

export function assertNoQueryErrors(
  ...results: SupabaseQueryResult[]
) {
  for (const result of results) {
    if (result.error) {
      throw new Error(result.error.message);
    }
  }
}