function saleTotalCents(subtotalCents: number, discountCents: number) {
  return Math.max(subtotalCents - discountCents, 0);
}

function isCashPayment(paymentMethod: string) {
  return paymentMethod === "CASH";
}

function assertSufficientTender(
  paymentMethod: string,
  amountTenderedCents: number | undefined,
  totalCents: number,
) {
  if (!isCashPayment(paymentMethod)) {
    return;
  }
  if (typeof amountTenderedCents !== "number") {
    return;
  }
  if (amountTenderedCents < totalCents) {
    throw new Error("Amount received is less than the total");
  }
}

function cashChangeCents(
  paymentMethod: string,
  amountTenderedCents: number | undefined,
  totalCents: number,
) {
  if (!isCashPayment(paymentMethod)) {
    return null;
  }
  if (typeof amountTenderedCents !== "number") {
    return null;
  }
  return amountTenderedCents - totalCents;
}

export function resolveCashTotals(options: {
  paymentMethod: string;
  subtotalCents: number;
  discountCents: number;
  amountTenderedCents?: number;
}) {
  const totalCents = saleTotalCents(
    options.subtotalCents,
    options.discountCents,
  );
  assertSufficientTender(
    options.paymentMethod,
    options.amountTenderedCents,
    totalCents,
  );
  const changeCents = cashChangeCents(
    options.paymentMethod,
    options.amountTenderedCents,
    totalCents,
  );
  return { totalCents, changeCents };
}