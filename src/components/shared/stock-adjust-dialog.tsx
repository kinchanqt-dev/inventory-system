"use client";

import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StockAdjustDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  description: string;
  children: ReactNode;
}

export function StockAdjustDialog({
  open,
  onOpenChange,
  description,
  children,
}: Readonly<StockAdjustDialogProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust stock</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      ) : null}
    </Dialog>
  );
}
