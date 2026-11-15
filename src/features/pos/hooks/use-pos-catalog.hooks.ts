"use client";

import { useState } from "react";

import type { PosProduct } from "@/features/pos/types/pos-product.types";

/** Keep a local catalog in sync with server props (e.g. after router.refresh). */
export function usePosCatalog(products: PosProduct[]) {
  const [catalog, setCatalog] = useState(products);
  const [productsSnapshot, setProductsSnapshot] = useState(products);

  if (products !== productsSnapshot) {
    setProductsSnapshot(products);
    setCatalog(products);
  }

  return [catalog, setCatalog] as const;
}
