"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { formatPesos, pesosToCents } from "@/lib/money";
import { PAYMENT_METHOD_LABELS } from "@/enums";

import { Button, Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui";

import { checkoutAction } from "@/features/pos/api/pos.actions";
import { PosCartPanel } from "@/features/pos/components/pos-cart-panel";
import { PosProductGrid } from "@/features/pos/components/pos-product-grid";

import type { PaymentMethodValue } from "@/enums";

interface PosProduct {
  id: string;
  sku: string;
  name: string;
  priceCents: number;
  imagePath?: string | null;
  stock: { quantity: number } | null;
  category: { name: string } | null;
}

interface CartItem {
  productId: string;
  name: string;
  sku: string;
  priceCents: number;
  quantity: number;
  available: number;
}

interface PosTerminalProps {
  products: PosProduct[];
}

export function PosTerminal({ products }: Readonly<PosTerminalProps>) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodValue>("CASH");
  const [paymentNote, setPaymentNote] = useState("");
  const [amountTendered, setAmountTendered] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const categories = useMemo(() => {
    const names = new Set<string>();
    for (const product of products) {
      if (product.category?.name) {
        names.add(product.category.name);
      }
    }
    return [...names].sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return products.filter((product) => {
      if (
        selectedCategory &&
        (product.category?.name ?? "Uncategorized") !== selectedCategory
      ) {
        return false;
      }

      if (!normalized) return true;

      return (
        product.name.toLowerCase().includes(normalized) ||
        product.sku.toLowerCase().includes(normalized)
      );
    });
  }, [products, query, selectedCategory]);

  const subtotalCents = cart.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0,
  );
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function addToCart(product: PosProduct) {
    const available = product.stock?.quantity ?? 0;

    if (available <= 0) {
      toast.error(`${product.name} is out of stock`);
      return;
    }

    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id);

      if (existing) {
        if (existing.quantity >= available) {
          toast.error(`Only ${available} left for ${product.name}`);
          return current;
        }

        return current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...current,
        {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          priceCents: product.priceCents,
          quantity: 1,
          available,
        },
      ];
    });
  }

  function updateQuantity(productId: string, quantity: number) {
    setCart((current) =>
      current.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.min(Math.max(quantity, 1), item.available),
            }
          : item,
      ),
    );
  }

  function handleCheckout() {
    startTransition(async () => {
      const result = await checkoutAction({
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        paymentMethod,
        paymentNote: paymentNote || undefined,
        amountTenderedCents:
          paymentMethod === "CASH" && amountTendered
            ? pesosToCents(amountTendered)
            : undefined,
        discountCents: 0,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setCart([]);
      setPaymentNote("");
      setAmountTendered("");
      setCartOpen(false);
      toast.success(
        `Sale ${result.sale?.saleNumber} recorded · ${formatPesos(result.sale?.totalCents ?? 0)} via ${PAYMENT_METHOD_LABELS[result.sale?.paymentMethod as PaymentMethodValue]}`,
      );
    });
  }

  const cartPanelProps = {
    cart,
    subtotalCents,
    paymentMethod,
    paymentNote,
    amountTendered,
    isPending,
    onPaymentMethodChange: setPaymentMethod,
    onPaymentNoteChange: setPaymentNote,
    onAmountTenderedChange: setAmountTendered,
    onQuantityChange: updateQuantity,
    onRemove: (productId: string) =>
      setCart((current) =>
        current.filter((item) => item.productId !== productId),
      ),
    onCheckout: handleCheckout,
  } as const;

  return (
    <div className="relative">
      <div className="grid gap-4 md:grid-cols-pos md:gap-5 lg:gap-6">
        <PosProductGrid
          products={filteredProducts}
          query={query}
          categories={categories}
          selectedCategory={selectedCategory}
          onQueryChange={setQuery}
          onCategoryChange={setSelectedCategory}
          onAdd={addToCart}
        />
        <div className="hidden md:block">
          <PosCartPanel {...cartPanelProps} />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 p-3 pb-safe backdrop-blur md:hidden">
        <Button
          type="button"
          className="min-h-12 w-full justify-between text-base"
          onClick={() => setCartOpen(true)}
        >
          <span>
            Cart · {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
          <span className="tabular-nums">{formatPesos(subtotalCents)}</span>
        </Button>
      </div>

      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
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
    </div>
  );
}
