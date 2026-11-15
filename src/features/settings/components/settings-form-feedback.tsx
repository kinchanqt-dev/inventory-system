interface SettingsFormFeedbackProps {
  error: string | null;
  message: string | null;
}

export function SettingsFormFeedback({
  error,
  message,
}: Readonly<SettingsFormFeedbackProps>) {
  return (
    <>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {message ? (
        <p className="text-sm text-emerald-700 dark:text-emerald-400">{message}</p>
      ) : null}
    </>
  );
}