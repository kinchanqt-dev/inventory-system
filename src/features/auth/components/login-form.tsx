"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

import { Button } from "@/components/ui";

import { loginAction } from "@/features/auth/api/login.actions";
import { AuthCredentialFields } from "@/features/auth/components/auth-credential-fields";

function loginSubmitLabel(isPending: boolean) {
  if (isPending) {
    return "Signing in...";
  }
  return "Sign in";
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(loginAction, undefined);
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <AuthCredentialFields
        passwordPlaceholder="Enter your password"
        passwordAutoComplete="current-password"
      />
      {state?.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      <Button type="submit" className="min-h-11 w-full" disabled={isPending}>
        {loginSubmitLabel(isPending)}
      </Button>
    </form>
  );
}