"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type SubmitEvent } from "react";

import { Button, Input, Label } from "@/components/ui";

export function UserLookupForm({
  initialEmail = "",
}: Readonly<{ initialEmail?: string }>) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    startTransition(() => {
      router.push(
        trimmed
          ? `/admin/users?email=${encodeURIComponent(trimmed)}`
          : "/admin/users",
      );
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="min-w-0 flex-1 space-y-2">
        <Label htmlFor="admin-user-email">Email</Label>
        <Input
          id="admin-user-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="owner@shop.com"
          className="min-h-11"
        />
      </div>
      <Button type="submit" disabled={isPending} className="min-h-11">
        {isPending ? "Searching…" : "Look up"}
      </Button>
    </form>
  );
}
