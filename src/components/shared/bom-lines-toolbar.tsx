"use client";

import { Plus } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface BomLinesToolbarProps {
  description: ReactNode;
  onAddLine: () => void;
  addLabel?: string;
}

export function BomLinesToolbar({
  description,
  onAddLine,
  addLabel = "Add line",
}: Readonly<BomLinesToolbarProps>) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-muted-foreground">{description}</div>
      <Button
        type="button"
        variant="outline"
        className="min-h-11 w-full sm:w-auto"
        onClick={onAddLine}
      >
        <Plus className="size-4" aria-hidden />
        {addLabel}
      </Button>
    </div>
  );
}
