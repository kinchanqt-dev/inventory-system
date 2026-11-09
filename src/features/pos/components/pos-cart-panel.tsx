"use client";

import { formatPesos } from "@/lib/money";

import { Button } from "@/components/ui";

import { PosCartItems } from "@/features/pos/components/pos-cart-items";
import { PosPaymentFields } from "@/features/pos/components/pos-payment-fields";

import type { PaymentMethodValue } from "@/enums";

interface CartItem {
  productId: string;
  name: string;
  priceCents: number;
  quantity: number;
  available: number;
}

interface PosCartPanelProps {
  cart: CartItem[];
  subtotalCents: number;
  paymentMethod: PaymentMethodValue;
  paymentNote: string;
  amountTendered: string;
  isPending: boolean;
  className?: string;
  onPaymentMethodChange: (value: PaymentMethodValue) => void;
  onPaymentNoteChange: (value: string) => void;
  onAmountTenderedChange: (value: string) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
}

export function PosCartPanel({
  cart,
  subtotalCents,
  paymentMethod,
  paymentNote,
  amountTendered,
  isPending,
  className,
  onPaymentMethodChange,
  onPaymentNoteChange,
  onAmountTenderedChange,
  onQuantityChange,
  onRemove,
  onCheckout,
}: Readonly<PosCartPanelProps>) {
  return (
    <section
      aria-labelledby="pos-cart-heading"
      className={
        className ??
        "flex h-fit flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm md:sticky md:top-4 md:p-5"
      }
    >
      <div>
        <h2 id="pos-cart-heading" className="text-lg font-semibold">
          Cart
        </h2>
        <p className="text-sm text-muted-foreground">
          Encode sale and payment method manually
        </p>
      </div>

      <PosCartItems
        cart={cart}
        onQuantityChange={onQuantityChange}
        onRemove={onRemove}
      />

      <div className="space-y-3 border-t pt-4">
        <div className="flex items-center justify-between text-xl font-semibold">
          <span>Total</span>
          <span className="tabular-nums">{formatPesos(subtotalCents)}</span>
        </div>

        <PosPaymentFields
          paymentMethod={paymentMethod}
          paymentNote={paymentNote}
          amountTendered={amountTendered}
          onPaymentMethodChange={onPaymentMethodChange}
          onPaymentNoteChange={onPaymentNoteChange}
          onAmountTenderedChange={onAmountTenderedChange}
        />

        <Button
          type="button"
          className="min-h-12 w-full text-base md:min-h-14"
          size="lg"
          disabled={cart.length === 0 || isPending}
          onClick={onCheckout}
        >
          {isPending ? "Recording sale..." : "Complete sale"}
        </Button>
      </div>
    </section>
  );
}
