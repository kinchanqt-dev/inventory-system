"use client";

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
}

export function ProductFormFields({
  categories,
  categoryId,
  onCategoryChange,
  isEdit,
  product,
}: Readonly<ProductFormFieldsProps>) {
  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-xl border border-border/80 p-4 sm:p-5">
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

      <section className="space-y-4 rounded-xl border border-border/80 p-4 sm:p-5">
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

      <section className="space-y-4 rounded-xl border border-border/80 p-4 sm:p-5">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Pricing &amp; stock
          </h2>
          <p className="text-sm text-muted-foreground">
            Selling price, cost, and when to warn that stock is running low.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ProductPricingFields isEdit={isEdit} product={product} />
        </div>
      </section>
    </div>
  );
}
