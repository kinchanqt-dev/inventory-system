"use client";

import { ProductPricingAmountFields } from "@/features/products/components/product-pricing-amount-fields";
import { ProductPricingKitchenField } from "@/features/products/components/product-pricing-kitchen-field";
import { ProductPricingStockFields } from "@/features/products/components/product-pricing-stock-fields";

import type { ProductFormValues } from "@/features/products/types/product.types";

interface ProductPricingFieldsProps {
  isEdit: boolean;
  product?: Pick<
    ProductFormValues,
    | "priceCents"
    | "costCents"
    | "quantity"
    | "reorderLevel"
    | "sendsToKitchen"
  >;
  computedCostCents?: number | null;
  priceValue?: string;
  onPriceChange?: (value: string) => void;
  quantityValue?: string;
  onQuantityChange?: (value: string) => void;
  maxMakeable?: number | null;
  quantityError?: string | null;
}

export function ProductPricingFields({
  isEdit,
  product,
  computedCostCents,
  priceValue,
  onPriceChange,
  quantityValue,
  onQuantityChange,
  maxMakeable,
  quantityError,
}: Readonly<ProductPricingFieldsProps>) {
  return (
    <>
      <ProductPricingAmountFields
        isEdit={isEdit}
        product={product}
        computedCostCents={computedCostCents}
        priceValue={priceValue}
        onPriceChange={onPriceChange}
      />
      <ProductPricingStockFields
        isEdit={isEdit}
        product={product}
        quantityValue={quantityValue}
        onQuantityChange={onQuantityChange}
        maxMakeable={maxMakeable}
        quantityError={quantityError}
      />
      <ProductPricingKitchenField product={product} />
    </>
  );
}
