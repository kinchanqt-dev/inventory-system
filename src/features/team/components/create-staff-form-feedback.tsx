interface CreateStaffFormFeedbackProps {
  error?: string;
  success?: string;
}

export function CreateStaffFormFeedback({
  error,
  success,
}: Readonly<CreateStaffFormFeedbackProps>) {
  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (!success) {
    return null;
  }

  return (
    <p className="rounded-xl border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-foreground">
      {success}
    </p>
  );
}
