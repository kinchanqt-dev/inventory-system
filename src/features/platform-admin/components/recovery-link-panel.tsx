"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button, Input } from "@/components/ui";

import { generateUserRecoveryLinkAction } from "@/features/platform-admin/api/platform-admin.actions";

export function RecoveryLinkPanel({
  userId,
}: Readonly<{ userId: string }>) {
  const [link, setLink] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    startTransition(async () => {
      const result = await generateUserRecoveryLinkAction(userId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setLink(result.actionLink ?? null);
      toast.success("Recovery link ready — copy it now");
    });
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="min-h-11"
        disabled={isPending}
        onClick={handleGenerate}
      >
        {isPending ? "Generating…" : "Generate recovery link"}
      </Button>
      {link ? (
        <div className="space-y-2">
          <Input readOnly value={link} className="min-h-11 font-mono text-xs" />
          <Button
            type="button"
            size="sm"
            className="min-h-10"
            onClick={async () => {
              await navigator.clipboard.writeText(link);
              toast.success("Copied");
            }}
          >
            Copy link
          </Button>
        </div>
      ) : null}
    </div>
  );
}
