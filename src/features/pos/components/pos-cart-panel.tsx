"use client";

import { formatPesos } from "@/lib/money";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui";

import { PosCartItems } from "@/features/pos/components/pos-cart-items";
import { PosPaymentFields } from "@/features/pos/components/pos-payment-fields";
import {
  posCartItemLabel,
  posCheckoutButtonLabel,
} from "@/features/pos/lib/pos-cart-labels";

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

function defaultCartPanelClass(className: string | undefined) {
  return (
    className ??
    "flex h-fit flex-col gap-4 rounded-2xl border border-border/70 bg-card/95 p-4 shadow-[0_18px_40px_-28px_rgba(24,32,28,0.45)] backdrop-blur-sm md:sticky md:top-4 md:p-5"
  );
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
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section
      aria-labelledby="pos-cart-heading"
      className={cn(defaultCartPanelClass(className))}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Register
          </p>
          <h2
            id="pos-cart-heading"
            className="font-heading text-xl font-semibold tracking-tight"
          >
            New sale
          </h2>
        </div>
        <p className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium tabular-nums text-muted-foreground">
          {posCartItemLabel(itemCount)}
        </p>
      </div>

      <PosCartItems
        cart={cart}
        onQuantityChange={onQuantityChange}
        onRemove={onRemove}
      />

      <div className="space-y-3 border-t border-border/70 pt-4">
        <div className="flex items-end justify-between gap-3">
          <span className="text-sm text-muted-foreground">Total due</span>
          <span className="font-heading text-2xl font-semibold tabular-nums tracking-tight">
            {formatPesos(subtotalCents)}
          </span>
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
          {posCheckoutButtonLabel(isPending, subtotalCents)}
        </Button>
      </div>
    </section>
  );
}