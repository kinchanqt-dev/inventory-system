"use client";

import { useRouter } from "next/navigation";
import { Pencil, Power } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui";

import { toggleProductActiveAction } from "@/features/products/api/product.actions";

import type { ProductRowData } from "@/features/products/types/product.types";

interface ProductCardActionsProps {
  product: ProductRowData;
}

export function ProductCardActions({
  product,
}: Readonly<ProductCardActionsProps>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const toggleLabel = product.isActive ? "Disable" : "Enable";

  return (
    <div className="flex w-full gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="min-h-11 flex-1"
        onClick={() => router.push(`/products/${product.id}/edit`)}
      >
        <Pencil className="size-4" aria-hidden />
        Edit
      </Button>
      <Button
        type="button"
        variant={product.isActive ? "destructive" : "secondary"}
        size="sm"
        className="min-h-11 flex-1"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await toggleProductActiveAction(product.id);
          })
        }
      >
        <Power className="size-4" aria-hidden />
        {toggleLabel}
      </Button>
    </div>
  );
}
