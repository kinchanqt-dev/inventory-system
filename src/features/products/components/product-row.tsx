"use client";

import Image from "next/image";

import { formatPesos } from "@/lib/money";

import { Badge, TableCell, TableRow } from "@/components/ui";

import { ProductActionsMenu } from "@/features/products/components/product-actions-menu";
import { getProductRowView } from "@/features/products/lib/product-row-view";

import type { ProductRowData } from "@/features/products/types/product.types";

interface ProductRowProps {
  product: ProductRowData;
}

export function ProductRow({ product }: Readonly<ProductRowProps>) {
  const { quantity, isLow, initials } = getProductRowView(product);

  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{product.sku}</TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          {product.imagePath ? (
            <Image
              src={product.imagePath}
              alt=""
              width={40}
              height={40}
              className="size-10 rounded-md object-cover"
              unoptimized
            />
          ) : (
            <span
              aria-hidden
              className="flex size-10 items-center justify-center rounded-md bg-muted text-sm font-semibold text-muted-foreground"
            >
              {initials}
            </span>
          )}
          <span className="font-medium">{product.name}</span>
        </div>
      </TableCell>
      <TableCell>{product.category?.name ?? "—"}</TableCell>
      <TableCell className="tabular-nums">{formatPesos(product.priceCents)}</TableCell>
      <TableCell>
        <span className="tabular-nums">{quantity}</span>
        {isLow ? (
          <Badge variant="destructive" className="ml-2">
            Low
          </Badge>
        ) : null}
      </TableCell>
      <TableCell>
        <Badge variant={product.isActive ? "default" : "secondary"}>
          {product.isActive ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <ProductActionsMenu product={product} />
      </TableCell>
    </TableRow>
  );
}
