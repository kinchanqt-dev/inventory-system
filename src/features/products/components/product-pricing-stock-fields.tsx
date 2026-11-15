import { ProductPricingOpeningStock } from "@/features/products/components/product-pricing-opening-stock";
import { ProductPricingReorderField } from "@/features/products/components/product-pricing-reorder-field";

import type { ProductFormValues } from "@/features/products/types/product.types";

interface ProductPricingStockFieldsProps {
  isEdit: boolean;
  product?: Pick<ProductFormValues, "quantity" | "reorderLevel">;
  quantityValue?: string;
  onQuantityChange?: (value: string) => void;
  maxMakeable?: number | null;
  quantityError?: string | null;
}

export function ProductPricingStockFields({
  isEdit,
  product,
  quantityValue,
  onQuantityChange,
  maxMakeable,
  quantityError,
}: Readonly<ProductPricingStockFieldsProps>) {
  return (
    <>
      {isEdit ? null : (
        <ProductPricingOpeningStock
          quantity={product?.quantity}
          quantityValue={quantityValue}
          onQuantityChange={onQuantityChange}
          maxMakeable={maxMakeable}
          quantityError={quantityError}
        />
      )}
      <ProductPricingReorderField reorderLevel={product?.reorderLevel} />
    </>
  );
}
