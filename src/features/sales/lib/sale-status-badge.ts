export function saleCompletedBadge(status: string) {
  if (status === "COMPLETED") {
    return { variant: "default" as const };
  }
  return { variant: "secondary" as const };
}