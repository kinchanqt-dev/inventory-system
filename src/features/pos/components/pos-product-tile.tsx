import { formatPesos } from "@/lib/money";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui";

import { PosProductImage } from "@/features/pos/components/pos-product-image";
import {
  posStockBadgeLabel,
  posStockBadgeVariant,
} from "@/features/pos/lib/pos-stock-badge";
import { posProductStockState } from "@/features/pos/lib/pos-product-stock-state";

import type { PosProduct } from "@/features/pos/types/pos-product.types";

interface PosProductTileProps {
  product: PosProduct;
  onAdd: (product: PosProduct) => void;
  /** Eager-load image when the tile is above the fold. */
  imagePriority?: boolean;
  highFetchPriority?: boolean;
}

export function PosProductTile({
  product,
  onAdd,
  imagePriority = false,
  highFetchPriority = false,
}: Readonly<PosProductTileProps>) {
  const { stock, soldOut, lowStock, initials } = posProductStockState(product);

  return (
    <button
      type="button"
      disabled={soldOut}
      onClick={() => onAdd(product)}
      className={cn(
        "group min-h-28 overflow-hidden rounded-lg border border-border/70 bg-card text-left shadow-sm transition duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:min-h-32",
        soldOut
          ? "cursor-not-allowed opacity-55"
          : "hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md active:translate-y-0",
      )}
    >
      <div className="aspect-product-tile bg-muted/80">
        <PosProductImage
          imagePath={product.imagePath}
          initials={initials}
          priority={imagePriority}
          highFetchPriority={highFetchPriority}
        />
      </div>
      <div className="space-y-1.5 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm font-medium leading-snug">
            {product.name}
          </p>
          <Badge variant={posStockBadgeVariant(soldOut, lowStock)} className="shrink-0">
            {posStockBadgeLabel(soldOut, stock)}
          </Badge>
        </div>
        <p className="text-base font-semibold tabular-nums tracking-tight">
          {formatPesos(product.priceCents)}
        </p>
      </div>
    </button>
  );
}