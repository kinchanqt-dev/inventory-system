"use client";

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
              <Input
                type="number"
                min={1}
                max={item.available}
                value={item.quantity}
                aria-label={`Quantity for ${item.name}`}
                className="h-8 w-20"
                onChange={(event) =>
                  onQuantityChange(
                    item.productId,
                    Number(event.target.value) || 1,
                  )
                }
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
