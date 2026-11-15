"use client";

import { formatPesos } from "@/lib/money";

import { Button, Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui";

import { PosCartPanel } from "@/features/pos/components/pos-cart-panel";
import { posCartItemLabel } from "@/features/pos/lib/pos-cart-labels";

import type { ComponentProps } from "react";

interface PosMobileCartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemCount: number;
  subtotalCents: number;
  cartPanelProps: ComponentProps<typeof PosCartPanel>;
}

export function PosMobileCart({
  open,
  onOpenChange,
  itemCount,
  subtotalCents,
  cartPanelProps,
}: Readonly<PosMobileCartProps>) {
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 p-3 pb-safe backdrop-blur md:hidden">
        <Button
          type="button"
          className="min-h-12 w-full justify-between text-base"
          onClick={() => onOpenChange(true)}
        >
          <span>Cart · {posCartItemLabel(itemCount)}</span>
          <span className="tabular-nums">{formatPesos(subtotalCents)}</span>
        </Button>
      </div>

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="max-h-dialog-viewport overflow-y-auto rounded-t-2xl p-0 md:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Cart and checkout</SheetTitle>
          </SheetHeader>
          <PosCartPanel
            {...cartPanelProps}
            className="flex flex-col gap-4 border-0 bg-transparent p-4 shadow-none"
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
