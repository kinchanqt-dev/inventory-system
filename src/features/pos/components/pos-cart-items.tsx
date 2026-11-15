"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { formatPesos } from "@/lib/money";

import {
  Button,
  Input,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";

interface CartItem {
  productId: string;
  name: string;
  priceCents: number;
  quantity: number;
  available: number;
}

interface PosCartItemsProps {
  cart: CartItem[];
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

interface CartQuantityInputProps {
  productId: string;
  name: string;
  quantity: number;
  available: number;
  onQuantityChange: (productId: string, quantity: number) => void;
}

function CartQuantityInput({
  productId,
  name,
  quantity,
  available,
  onQuantityChange,
}: Readonly<CartQuantityInputProps>) {
  const [draft, setDraft] = useState(String(quantity));
  const [isFocused, setIsFocused] = useState(false);
  const [quantitySnapshot, setQuantitySnapshot] = useState(quantity);

  if (!isFocused && quantity !== quantitySnapshot) {
    setQuantitySnapshot(quantity);
    setDraft(String(quantity));
  }

  function commitDraft(raw: string) {
    const parsed = Number(raw);
    const next = Number.isFinite(parsed) ? parsed : 1;
    onQuantityChange(productId, next);
    const clamped = Math.min(Math.max(next, 1), available);
    setDraft(String(clamped));
    setQuantitySnapshot(clamped);
  }

  return (
    <Input
      type="number"
      min={1}
      max={available}
      value={draft}
      aria-label={`Quantity for ${name}`}
      className="h-8 w-20"
      onFocus={() => setIsFocused(true)}
      onBlur={() => {
        setIsFocused(false);
        commitDraft(draft);
      }}
      onChange={(event) => {
        const raw = event.target.value;
        setDraft(raw);
        if (raw === "") {
          return;
        }
        const parsed = Number(raw);
        if (Number.isFinite(parsed) && parsed >= 1) {
          onQuantityChange(productId, parsed);
          setQuantitySnapshot(Math.min(parsed, available));
        }
      }}
    />
  );
}

export function PosCartItems({
  cart,
  onQuantityChange,
  onRemove,
}: Readonly<PosCartItemsProps>) {
  if (cart.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        Tap products to add them here
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {cart.map((item) => (
        <div
          key={item.productId}
          className="flex items-start justify-between gap-3 rounded-lg border p-3"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatPesos(item.priceCents)} each
            </p>
            <div className="mt-2 flex items-center gap-2">
              <CartQuantityInput
                productId={item.productId}
                name={item.name}
                quantity={item.quantity}
                available={item.available}
                onQuantityChange={onQuantityChange}
              />
              <span className="text-sm font-medium tabular-nums">
                {formatPesos(item.priceCents * item.quantity)}
              </span>
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => onRemove(item.productId)}
                />
              }
            >
              <Trash2 className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Remove from cart</TooltipContent>
          </Tooltip>
        </div>
      ))}
    </div>
  );
}
