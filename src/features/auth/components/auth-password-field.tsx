"use client";

import { useState } from "react";

import { Input, Label } from "@/components/ui";

import { PasswordVisibilityToggle } from "@/features/auth/components/password-visibility-toggle";

interface AuthPasswordFieldProps {
  passwordPlaceholder: string;
  passwordAutoComplete: "current-password" | "new-password";
  passwordMinLength?: number;
  passwordHint?: string;
}

export function AuthPasswordField({
  passwordPlaceholder,
  passwordAutoComplete,
  passwordMinLength,
  passwordHint,
}: Readonly<AuthPasswordFieldProps>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor="password">Password</Label>
      <div className="relative">
        <Input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder={passwordPlaceholder}
          autoComplete={passwordAutoComplete}
          required
          minLength={passwordMinLength}
          className="min-h-11 pr-12"
        />
        <PasswordVisibilityToggle
          visible={showPassword}
          onToggle={() => setShowPassword((current) => !current)}
        />
      </div>
      {passwordHint ? (
        <p className="text-xs text-muted-foreground">{passwordHint}</p>
      ) : null}
    </div>
  );
}