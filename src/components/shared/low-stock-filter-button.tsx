"use client";

import { Button } from "@/components/ui/button";

interface LowStockFilterButtonProps {
  active: boolean;
  onToggle: () => void;
}

export function LowStockFilterButton({
  active,
  onToggle,
}: Readonly<LowStockFilterButtonProps>) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size="sm"
      className="min-h-11 w-full sm:w-auto"
      aria-pressed={active}
      onClick={onToggle}
    >
      {active ? "Showing low stock" : "Show low stock only"}
    </Button>
  );
}
