"use client";

import { PAYMENT_METHOD_LABELS, PAYMENT_METHODS } from "@/enums";

import { cn } from "@/lib/utils";

import { Input, Label } from "@/components/ui";

import type { PaymentMethodValue } from "@/enums";

interface PosPaymentFieldsProps {
  paymentMethod: PaymentMethodValue;
  paymentNote: string;
  amountTendered: string;
  onPaymentMethodChange: (value: PaymentMethodValue) => void;
  onPaymentNoteChange: (value: string) => void;
  onAmountTenderedChange: (value: string) => void;
}

export function PosPaymentFields({
  paymentMethod,
  paymentNote,
  amountTendered,
  onPaymentMethodChange,
  onPaymentNoteChange,
  onAmountTenderedChange,
}: Readonly<PosPaymentFieldsProps>) {
  return (
    <>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Payment method</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PAYMENT_METHODS.map((method) => {
            const selected = paymentMethod === method;
            return (
              <button
                key={method}
                type="button"
                aria-pressed={selected}
                onClick={() => onPaymentMethodChange(method)}
                className={cn(
                  "min-h-11 rounded-lg border px-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted",
                )}
              >
                {PAYMENT_METHOD_LABELS[method]}
              </button>
            );
          })}
        </div>
      </fieldset>

      {paymentMethod === "CASH" ? (
        <div className="space-y-2">
          <Label htmlFor="amountTendered">Amount received (₱)</Label>
          <Input
            id="amountTendered"
            type="number"
            min="0"
            step="0.01"
            value={amountTendered}
            onChange={(event) => onAmountTenderedChange(event.target.value)}
            className="min-h-11"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="paymentNote">Reference / note (optional)</Label>
          <Input
            id="paymentNote"
            placeholder="QRPh ref no., last 4 digits..."
            value={paymentNote}
            onChange={(event) => onPaymentNoteChange(event.target.value)}
            className="min-h-11"
          />
        </div>
      )}
    </>
  );
}
