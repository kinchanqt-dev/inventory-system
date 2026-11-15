interface DataListEmptyStateProps {
  message: string;
}

export function DataListEmptyState({
  message,
}: Readonly<DataListEmptyStateProps>) {
  return (
    <p className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
      {message}
    </p>
  );
}