"use client";

import { Input, Label } from "@/components/ui";

import { AuthPasswordField } from "@/features/auth/components/auth-password-field";

interface AuthCredentialFieldsProps {
  passwordPlaceholder: string;
  passwordAutoComplete: "current-password" | "new-password";
  passwordMinLength?: number;
  passwordHint?: string;
}

export function AuthCredentialFields({
  passwordPlaceholder,
  passwordAutoComplete,
  passwordMinLength,
  passwordHint,
}: Readonly<AuthCredentialFieldsProps>) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          className="min-h-11"
        />
      </div>
      <AuthPasswordField
        passwordPlaceholder={passwordPlaceholder}
        passwordAutoComplete={passwordAutoComplete}
        passwordMinLength={passwordMinLength}
        passwordHint={passwordHint}
      />
    </>
  );
}