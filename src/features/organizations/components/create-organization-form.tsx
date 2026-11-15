"use client";

import { useActionState, useState } from "react";

import { slugifyOrgName } from "@/lib/org-cookie";

import { useFormDirtyGuard } from "@/hooks";

import { Button, Input, Label } from "@/components/ui";

import { createOrganizationAction } from "@/features/organizations/api/organization.actions";

export function CreateOrganizationForm() {
  const [state, formAction, isPending] = useActionState(
    createOrganizationAction,
    undefined,
  );
  const dirty = useFormDirtyGuard(isPending);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  return (
    <form action={formAction} className="space-y-4" {...dirty.formDirtyProps}>
      <div className="space-y-2">
        <Label htmlFor="name">Business name</Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(event) => {
            dirty.markDirty();
            const next = event.target.value;
            setName(next);
            if (!slugTouched) {
              setSlug(slugifyOrgName(next));
            }
          }}
          placeholder="E&T's Kitchen"
          required
          className="min-h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Business URL slug</Label>
        <Input
          id="slug"
          name="slug"
          value={slug}
          onChange={(event) => {
            dirty.markDirty();
            setSlugTouched(true);
            setSlug(event.target.value);
          }}
          placeholder="ets-kitchen"
          required
          className="min-h-11"
        />
        <p className="text-xs text-muted-foreground">
          Used internally to identify your business. You can change the display
          name later in Settings.
        </p>
      </div>
      {state?.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      <Button type="submit" className="min-h-11 w-full" disabled={isPending}>
        {isPending ? "Creating..." : "Create business"}
      </Button>
    </form>
  );
}
