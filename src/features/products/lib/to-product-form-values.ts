import {
  pickProductCoreFields,
  type ProductCoreCamelFields,
} from "@/features/products/lib/product-core-fields";

import type { ProductFormValues } from "@/features/products/types/product.types";

type ProductWithStock = Omit<ProductCoreCamelFields, "sendsToKitchen"> & {
  sendsToKitchen?: boolean;
  stock: { quantity: number; reorderLevel: number } | null;
};

export function toProductFormValues(
  product: ProductWithStock,
): ProductFormValues {
  return {
    ...pickProductCoreFields({
      ...product,
      sendsToKitchen: product.sendsToKitchen ?? true,
    }),
    quantity: product.stock?.quantity,
    reorderLevel: product.stock?.reorderLevel,
  };
}