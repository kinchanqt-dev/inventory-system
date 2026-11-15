"use client";

import { useActionState, useEffect } from "react";

import { useFormDirtyGuard } from "@/hooks";

import { Button, Input, Label } from "@/components/ui";

import { AuthCredentialFields } from "@/features/auth/components/auth-credential-fields";
import { PASSWORD_REQUIREMENTS_HINT } from "@/features/auth/schemas/password.schema";
import { createStaffAction } from "@/features/team/api/team.actions";
import { CreateStaffFormFeedback } from "@/features/team/components/create-staff-form-feedback";
import { CreateStaffRoleFieldset } from "@/features/team/components/create-staff-role-fieldset";

function submitLabel(isPending: boolean) {
  if (isPending) {
    return "Creating…";
  }
  return "Create staff account";
}

export function CreateStaffForm() {
  const [state, formAction, isPending] = useActionState(
    createStaffAction,
    undefined,
  );
  const dirty = useFormDirtyGuard(isPending);

  useEffect(() => {
    if (state?.success) {
      dirty.markClean();
    }
  }, [state?.success, dirty.markClean]);

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-border/70 bg-card/90 p-4 shadow-[0_18px_40px_-28px_rgba(26,42,36,0.35)] sm:p-5"
      {...dirty.formDirtyProps}
    >
      <div>
        <h2 className="font-heading text-lg font-semibold tracking-tight">
          Add staff account
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Set their login yourself and share it securely—no email invite
          required.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="staff-name">Name</Label>
        <Input
          id="staff-name"
          name="name"
          type="text"
          placeholder="Jamie"
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

      <CreateStaffRoleFieldset />

      <CreateStaffFormFeedback error={state?.error} success={state?.success} />

      <Button type="submit" className="min-h-11 w-full" disabled={isPending}>
        {submitLabel(isPending)}
      </Button>
    </form>
  );
}
