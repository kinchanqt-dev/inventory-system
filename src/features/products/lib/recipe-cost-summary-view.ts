export function bpsToPercentLabel(bps: number): string {
  return `${(bps / 100).toFixed(1)}%`;
}

export function recipeCostBadge(
  status: "above_target" | "on_target" | null | undefined,
) {
  if (!status) {
    return null;
  }

  if (status === "above_target") {
    return {
      variant: "destructive" as const,
      label: "Above target food cost",
    };
  }

  return {
    variant: "secondary" as const,
    label: "On target",
  };
}
