interface CheckoutItem {
  productId: string;
  quantity: number;
}

interface ProductWithStock {
  id: string;
  name: string;
  sku: string;
  priceCents: number;
  stock: { quantity: number } | null;
}

export function buildSaleLines(
  items: CheckoutItem[],
  products: ProductWithStock[],
) {
  if (products.length !== items.length) {
    throw new Error("One or more products are unavailable");
  }

  const productMap = new Map(products.map((product) => [product.id, product]));
  let subtotalCents = 0;

  const lineItems = items.map((item) => {
    const product = productMap.get(item.productId);

    if (!product?.stock) {
      throw new Error("Product stock is missing");
    }

    if (product.stock.quantity < item.quantity) {
      throw new Error(`Not enough stock for ${product.name}`);
    }

    const lineTotalCents = product.priceCents * item.quantity;
    subtotalCents += lineTotalCents;

    return {
      product,
      quantity: item.quantity,
      lineTotalCents,
    };
  });

  return { lineItems, subtotalCents };
}

export function resolveCashTotals(options: {
  paymentMethod: string;
  subtotalCents: number;
  discountCents: number;
  amountTenderedCents?: number;
}) {
  const totalCents = Math.max(options.subtotalCents - options.discountCents, 0);

  if (
    options.paymentMethod === "CASH" &&
    typeof options.amountTenderedCents === "number" &&
    options.amountTenderedCents < totalCents
  ) {
    throw new Error("Amount received is less than the total");
  }

  const changeCents =
    options.paymentMethod === "CASH" &&
    typeof options.amountTenderedCents === "number"
      ? options.amountTenderedCents - totalCents
      : null;

  return { totalCents, changeCents };
}
