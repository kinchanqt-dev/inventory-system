"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Power } from "lucide-react";
import { useTransition } from "react";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";

import { toggleProductActiveAction } from "@/features/products/api/product.actions";

import type { ProductRowData } from "@/features/products/types/product.types";

interface ProductActionsMenuProps {
  product: ProductRowData;
}

export function ProductActionsMenu({
  product,
}: Readonly<ProductActionsMenuProps>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const toggleLabel = product.isActive ? "Disable" : "Enable";

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="min-h-11 min-w-11"
                  aria-label={`Actions for ${product.name}`}
                />
              }
            />
          }
        >
          <MoreHorizontal className="size-4" aria-hidden />
        </TooltipTrigger>
        <TooltipContent>Actions</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(`/products/${product.id}/edit`)}
        >
          <Pencil aria-hidden />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={isPending}
          variant={product.isActive ? "destructive" : "default"}
          onClick={() =>
            startTransition(async () => {
              await toggleProductActiveAction(product.id);
            })
          }
        >
          <Power aria-hidden />
          {toggleLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
