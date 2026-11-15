interface CartItemLike {
  productId: string;
  name: string;
  sku: string;
  priceCents: number;
  quantity: number;
  available: number;
}

interface PosProductLike {
  id: string;
  name: string;
  sku: string;
  priceCents: number;
  stock: { quantity: number } | null;
}

export function availableStockQuantity(product: PosProductLike) {
  return product.stock?.quantity ?? 0;
}

export function incrementCartItem(
  current: CartItemLike[],
  product: PosProductLike,
  available: number,
): { cart: CartItemLike[]; error?: string } {
  const existing = current.find((item) => item.productId === product.id);

  if (!existing) {
    return {
      cart: [
        ...current,
        {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          priceCents: product.priceCents,
          quantity: 1,
          available,
        },
      ],
    };
  }

  if (existing.quantity >= available) {
    return {
      cart: current,
      error: `Only ${available} left for ${product.name}`,
    };
  }

  return {
    cart: current.map((item) => {
      if (item.productId !== product.id) {
        return item;
      }
      return { ...item, quantity: item.quantity + 1 };
    }),
  };
}

export function setCartItemQuantity(
  current: CartItemLike[],
  productId: string,
  quantity: number,
) {
  return current.map((item) => {
    if (item.productId !== productId) {
      return item;
    }
    return {
      ...item,
      quantity: Math.min(Math.max(quantity, 1), item.available),
    };
  });
}

/** Apply sold quantities to the on-screen POS catalog stock. */
export function applySaleToCatalogStock<T extends PosProductLike>(
  products: T[],
  soldItems: Array<{ productId: string; quantity: number }>,
): T[] {
  const soldByProductId = new Map(
    soldItems.map((item) => [item.productId, item.quantity]),
  );

  return products.map((product) => {
    const soldQty = soldByProductId.get(product.id);
    if (soldQty == null || !product.stock) {
      return product;
    }
    return {
      ...product,
      stock: {
        quantity: Math.max(0, product.stock.quantity - soldQty),
      },
    };
  });
}
