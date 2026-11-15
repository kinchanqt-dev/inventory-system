export function productActiveBadge(isActive: boolean) {
  if (isActive) {
    return { variant: "default" as const, label: "Active" };
  }
  return { variant: "secondary" as const, label: "Inactive" };
}