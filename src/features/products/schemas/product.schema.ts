import { z } from "zod";

export const productSchema = z.object({
  sku: z.string().trim().min(1, "Item code is required").max(64),
  barcode: z.string().trim().optional(),
  name: z.string().trim().min(1, "Name is required").max(120),
  description: z.string().trim().optional(),
  categoryId: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  cost: z.coerce.number().min(0, "Cost cannot be negative"),
  unit: z.string().trim().min(1).default("pc"),
  quantity: z.coerce.number().int().min(0).default(0),
  reorderLevel: z.coerce.number().int().min(0).default(5),
  isActive: z.coerce.boolean().default(true),
  sendsToKitchen: z.coerce.boolean().default(true),
});
