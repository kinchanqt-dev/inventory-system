"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal, PackagePlus, Pencil } from "lucide-react";

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

interface IngredientActionsMenuProps {
  ingredientId: string;
  ingredientName: string;
  onAdjust: () => void;
}

export function IngredientActionsMenu({
  ingredientId,
  ingredientName,
  onAdjust,
}: Readonly<IngredientActionsMenuProps>) {
  const router = useRouter();

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
                  aria-label={`Actions for ${ingredientName}`}
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
        <DropdownMenuItem onClick={onAdjust}>
          <PackagePlus aria-hidden />
          Adjust
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/ingredients/${ingredientId}/edit`)}
        >
          <Pencil aria-hidden />
          Edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
