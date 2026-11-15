"use client";

import { formatPesos } from "@/lib/money";

import { DataListCard } from "@/components/shared";
import { Badge } from "@/components/ui";

import { ProductCardActions } from "@/features/products/components/product-card-actions";
import { ProductThumbnail } from "@/features/products/components/product-thumbnail";
import { getProductRowView } from "@/features/products/lib/product-row-view";
import { productActiveBadge } from "@/features/products/lib/product-active-badge";

import type { ProductRowData } from "@/features/products/types/product.types";

interface ProductListCardProps {
  product: ProductRowData;
}

export function ProductListCard({ product }: Readonly<ProductListCardProps>) {
  const { quantity, isLow, initials } = getProductRowView(product);
  const activeBadge = productActiveBadge(product.isActive);

  return (
    <DataListCard footer={<ProductCardActions product={product} />}>
      <div className="flex items-start gap-3">
        <ProductThumbnail
          imagePath={product.imagePath}
          initials={initials}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-medium">{product.name}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {product.sku}
              </p>
            </div>
            <Badge variant={activeBadge.variant}>{activeBadge.label}</Badge>
          </div>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Category</dt>
          <dd>{product.category?.name ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Price</dt>
          <dd className="tabular-nums">{formatPesos(product.priceCents)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Stock</dt>
          <dd className="flex items-center gap-2">
            <span className="tabular-nums">{quantity}</span>
            {isLow ? <Badge variant="destructive">Low</Badge> : null}
          </dd>
        </div>
      </dl>
    </DataListCard>
  );
}