import { pesosToCents } from "@/lib/money";

import type { PaymentMethodValue } from "@/enums";

interface CartCheckoutItem {
  productId: string;
  quantity: number;
}

interface BuildPosCheckoutPayloadInput {
  cart: CartCheckoutItem[];
  paymentMethod: PaymentMethodValue;
  paymentNote: string;
  amountTendered: string;
}

function cashAmountTenderedCents(
  paymentMethod: PaymentMethodValue,
  amountTendered: string,
) {
  if (paymentMethod !== "CASH") {
    return undefined;
  }
  if (!amountTendered) {
    return undefined;
  }
  return pesosToCents(amountTendered);
}

export function buildPosCheckoutPayload(input: BuildPosCheckoutPayloadInput) {
  return {
    items: input.cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
    paymentMethod: input.paymentMethod,
    paymentNote: input.paymentNote || undefined,
    amountTenderedCents: cashAmountTenderedCents(
      input.paymentMethod,
      input.amountTendered,
    ),
    discountCents: 0,
  };
}
