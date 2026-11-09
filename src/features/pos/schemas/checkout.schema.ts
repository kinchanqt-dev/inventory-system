import { z } from "zod";

import { PAYMENT_METHODS } from "@/enums";

const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, "Add at least one item to the cart"),
  paymentMethod: z.enum(PAYMENT_METHODS),
  paymentNote: z.string().trim().max(255).optional(),
  amountTenderedCents: z.number().int().nonnegative().optional(),
  discountCents: z.number().int().nonnegative().default(0),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
