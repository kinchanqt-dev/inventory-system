"use client";

import type { ReactNode } from "react";

import { ProductIdentityFields } from "@/features/products/components/product-identity-fields";
import { ProductImageField } from "@/features/products/components/product-image-field";
import { ProductPricingFields } from "@/features/products/components/product-pricing-fields";

import type {
  CategoryOption,
  ProductFormValues,
} from "@/features/products/types/product.types";

interface ProductFormFieldsProps {
  categories: CategoryOption[];
  categoryId: string;
  onCategoryChange: (value: string) => void;
  isEdit: boolean;
  product?: ProductFormValues;
  computedCostCents?: number | null;
  priceValue?: string;
  onPriceChange?: (value: string) => void;
  quantityValue?: string;
  onQuantityChange?: (value: string) => void;
  maxMakeable?: number | null;
  quantityError?: string | null;
  beforePricing?: ReactNode;
}

export function ProductFormFields({
  categories,
  categoryId,
  onCategoryChange,
  isEdit,
  product,
  computedCostCents,
  priceValue,
  onPriceChange,
  quantityValue,
  onQuantityChange,
  maxMakeable,
  quantityError,
  beforePricing,
}: Readonly<ProductFormFieldsProps>) {
  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-lg border border-border/80 p-4 sm:p-5">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Item details</h2>
          <p className="text-sm text-muted-foreground">
            Name, item code, and which group it belongs to (meals, drinks, snacks).
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ProductIdentityFields
            categories={categories}
            categoryId={categoryId}
            onCategoryChange={onCategoryChange}
            product={product}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border/80 p-4 sm:p-5">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Image</h2>
          <p className="text-sm text-muted-foreground">
            Optional photo for POS tiles and the product list.
          </p>
        </div>
        <ProductImageField
          imagePath={product?.imagePath}
          productName={product?.name}
        />
      </section>

      {beforePricing}

      <section className="space-y-4 rounded-lg border border-border/80 p-4 sm:p-5">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Pricing &amp; stock
          </h2>
          <p className="text-sm text-muted-foreground">
            Selling price and stock alerts. Food cost comes from the recipe.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ProductPricingFields
            isEdit={isEdit}
            product={product}
            computedCostCents={computedCostCents}
            priceValue={priceValue}
            onPriceChange={onPriceChange}
            quantityValue={quantityValue}
            onQuantityChange={onQuantityChange}
            maxMakeable={maxMakeable}
            quantityError={quantityError}
          />
        </div>
      </section>
    </div>
  );
}
