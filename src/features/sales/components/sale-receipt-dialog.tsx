"use client";

import { Button } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { SaleReceipt } from "@/features/sales/components/sale-receipt";

import type { SaleReceiptData } from "@/features/sales/types/sale-receipt.types";

interface SaleReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipt: SaleReceiptData | null;
  shopName: string;
  title?: string;
}

function handlePrint() {
  window.print();
}

export function SaleReceiptDialog({
  open,
  onOpenChange,
  receipt,
  shopName,
  title = "Sale receipt",
}: Readonly<SaleReceiptDialogProps>) {


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md print:static print:inset-auto print:top-auto print:left-auto print:max-h-none print:max-w-none print:translate-none print:overflow-visible print:rounded-none print:border-0 print:bg-white print:p-0 print:shadow-none print:ring-0 print:**:data-[slot=dialog-close]:hidden">
        <DialogHeader className="print:hidden">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Order details, payment, and change for this sale.
          </DialogDescription>
        </DialogHeader>

        {receipt ? (
          <SaleReceipt receipt={receipt} shopName={shopName} />
        ) : null}

        <DialogFooter className="print:hidden">
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            type="button"
            className="min-h-11"
            onClick={handlePrint}
            disabled={!receipt}
          >
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
