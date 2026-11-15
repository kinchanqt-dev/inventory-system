function isEmailNotConfirmed(error: { message: string; code?: string }) {
  const message = error.message.toLowerCase();
  return (
    message.includes("email not confirmed") ||
    error.code === "email_not_confirmed"
  );
}

function isInvalidCredentials(error: { message: string }) {
  return error.message.toLowerCase().includes("invalid login credentials");
}

export function signInErrorMessage(error: { message: string; code?: string }) {
  if (isEmailNotConfirmed(error)) {
    return "Confirm your email before signing in, or turn off Confirm email in Supabase Auth settings.";
  }
  if (isInvalidCredentials(error)) {
    return "Invalid email or password";
  }
  return error.message || "Invalid email or password";
}