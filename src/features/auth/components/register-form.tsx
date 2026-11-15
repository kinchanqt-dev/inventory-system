"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button, Input, Label } from "@/components/ui";

import { registerAction } from "@/features/auth/api/login.actions";
import { AuthCredentialFields } from "@/features/auth/components/auth-credential-fields";
import { PASSWORD_REQUIREMENTS_HINT } from "@/features/auth/schemas/password.schema";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Your name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Alex"
          autoComplete="name"
          required
          className="min-h-11"
        />
      </div>
      <AuthCredentialFields
        passwordPlaceholder="e.g. Kitchen1!"
        passwordAutoComplete="new-password"
        passwordMinLength={8}
        passwordHint={PASSWORD_REQUIREMENTS_HINT}
      />
      {state?.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      <Button type="submit" className="min-h-11 w-full" disabled={isPending}>
        {isPending ? "Creating account..." : "Create account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
