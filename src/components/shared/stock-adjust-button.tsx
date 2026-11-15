"use client";

import { PackagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface StockAdjustButtonProps {
  itemName: string;
  onClick: () => void;
}

export function StockAdjustButton({
  itemName,
  onClick,
}: Readonly<StockAdjustButtonProps>) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="min-h-11"
      aria-label={`Adjust stock for ${itemName}`}
      onClick={onClick}
    >
      <PackagePlus className="size-4" aria-hidden />
      Adjust
    </Button>
  );
}