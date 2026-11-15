interface PendingEditSubmitLabelInput {
  isPending: boolean;
  isEdit: boolean;
  createLabel: string;
  editLabel: string;
  pendingLabel?: string;
}

export function pendingEditSubmitLabel({
  isPending,
  isEdit,
  createLabel,
  editLabel,
  pendingLabel = "Saving...",
}: PendingEditSubmitLabelInput): string {
  if (isPending) {
    return pendingLabel;
  }
  if (isEdit) {
    return editLabel;
  }
  return createLabel;
}