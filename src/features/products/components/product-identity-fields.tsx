"use client";

import { ProductIdentityCategoryField } from "@/features/products/components/product-identity-category-field";
import { ProductIdentityCodesFields } from "@/features/products/components/product-identity-codes-fields";
import { ProductIdentityNameFields } from "@/features/products/components/product-identity-name-fields";
import { ProductIdentityUnitField } from "@/features/products/components/product-identity-unit-field";

import type {
  CategoryOption,
  ProductFormValues,
} from "@/features/products/types/product.types";

interface ProductIdentityFieldsProps {
  categories: CategoryOption[];
  categoryId: string;
  onCategoryChange: (value: string) => void;
  product?: Pick<
    ProductFormValues,
    "sku" | "barcode" | "name" | "description" | "unit"
  >;
}

export function ProductIdentityFields({
  categories,
  categoryId,
  onCategoryChange,
  product,
}: Readonly<ProductIdentityFieldsProps>) {
  return (
    <>
      <ProductIdentityCodesFields product={product} />
      <ProductIdentityNameFields product={product} />
      <ProductIdentityCategoryField
        categories={categories}
        categoryId={categoryId}
        onCategoryChange={onCategoryChange}
      />
      <ProductIdentityUnitField product={product} />
    </>
  );
}