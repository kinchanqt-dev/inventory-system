"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { checkoutAction } from "@/features/pos/api/pos.actions";
import { usePosCatalog } from "@/features/pos/hooks/use-pos-catalog.hooks";
import {
  applySaleToCatalogStock,
  availableStockQuantity,
  incrementCartItem,
  setCartItemQuantity,
} from "@/features/pos/lib/pos-cart-mutations";
import { posCatalogCategories } from "@/features/pos/lib/pos-catalog-categories";
import {
  posCheckoutSuccessMessage,
  receiptFromCheckoutSale,
} from "@/features/pos/lib/pos-checkout-feedback";
import { buildPosCheckoutPayload } from "@/features/pos/lib/pos-checkout-payload";
import { filterPosProducts } from "@/features/pos/lib/filter-pos-products";

import type { PaymentMethodValue } from "@/enums";
import type { PosCartItem } from "@/features/pos/types/pos-cart.types";
import type { PosProduct } from "@/features/pos/types/pos-product.types";
import type { SaleReceiptData } from "@/features/sales/types/sale-receipt.types";

function cartTotals(cart: PosCartItem[]) {
  return {
    subtotalCents: cart.reduce(
      (sum, item) => sum + item.priceCents * item.quantity,
      0,
    ),
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
  };
}

function soldItemsFromCart(cart: PosCartItem[]) {
  return cart.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));
}

export function usePosTerminal(products: PosProduct[]) {
  const router = useRouter();
  const [catalog, setCatalog] = usePosCatalog(products);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<PosCartItem[]>([]);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodValue>("CASH");
  const [paymentNote, setPaymentNote] = useState("");
  const [amountTendered, setAmountTendered] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [receipt, setReceipt] = useState<SaleReceiptData | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const categories = useMemo(
    () => posCatalogCategories(catalog),
    [catalog],
  );
  const filteredProducts = useMemo(
    () => filterPosProducts(catalog, { query, selectedCategory }),
    [catalog, query, selectedCategory],
  );
  const { subtotalCents, itemCount } = cartTotals(cart);

  function addToCart(product: PosProduct) {
    const available = availableStockQuantity(product);
    if (available <= 0) {
      toast.error(`${product.name} is out of stock`);
      return;
    }

    setCart((current) => {
      const next = incrementCartItem(current, product, available);
      if (next.error) {
        toast.error(next.error);
      }
      return next.cart;
    });
  }

  function resetAfterCheckout() {
    setCart([]);
    setPaymentNote("");
    setAmountTendered("");
    setCartOpen(false);
  }

  function applySuccessfulCheckout(
    sale: NonNullable<Awaited<ReturnType<typeof checkoutAction>>["sale"]>,
    soldItems: ReturnType<typeof soldItemsFromCart>,
  ) {
    setReceipt(receiptFromCheckoutSale(sale));
    setReceiptOpen(true);
    setCatalog((current) => applySaleToCatalogStock(current, soldItems));
    resetAfterCheckout();
    router.refresh();
    toast.success(posCheckoutSuccessMessage(sale));
  }

  function handleCheckout() {
    const soldItems = soldItemsFromCart(cart);

    startTransition(async () => {
      const result = await checkoutAction(
        buildPosCheckoutPayload({
          cart,
          paymentMethod,
          paymentNote,
          amountTendered,
        }),
      );

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (!result.sale) {
        return;
      }

      applySuccessfulCheckout(result.sale, soldItems);
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
    onQuantityChange: (productId: string, quantity: number) => {
      setCart((current) => setCartItemQuantity(current, productId, quantity));
    },
    onRemove: (productId: string) => {
      setCart((current) =>
        current.filter((item) => item.productId !== productId),
      );
    },
    onCheckout: handleCheckout,
  } as const;

  return {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredProducts,
    cartOpen,
    setCartOpen,
    receipt,
    receiptOpen,
    setReceiptOpen,
    itemCount,
    subtotalCents,
    cartPanelProps,
    addToCart,
  };
}
