"use client";

import { formatPesos } from "@/lib/money";

import { Badge, TableCell, TableRow } from "@/components/ui";

import { ProductActionsMenu } from "@/features/products/components/product-actions-menu";
import { ProductThumbnail } from "@/features/products/components/product-thumbnail";
import { getProductRowView } from "@/features/products/lib/product-row-view";
import { productActiveBadge } from "@/features/products/lib/product-active-badge";

import type { ProductRowData } from "@/features/products/types/product.types";

interface ProductRowProps {
  product: ProductRowData;
}

export function ProductRow({ product }: Readonly<ProductRowProps>) {
  const { quantity, isLow, initials } = getProductRowView(product);
  const activeBadge = productActiveBadge(product.isActive);

  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{product.sku}</TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <ProductThumbnail
            imagePath={product.imagePath}
            initials={initials}
            size="sm"
          />
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
        <Badge variant={activeBadge.variant}>{activeBadge.label}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <ProductActionsMenu product={product} />
      </TableCell>
    </TableRow>
  );
}