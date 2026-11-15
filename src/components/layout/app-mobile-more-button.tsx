"use client";

import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";

interface AppMobileMoreButtonProps {
  isActive: boolean;
  isOpen: boolean;
  onOpen: () => void;
}

function moreButtonClass(isActive: boolean) {
  if (isActive) {
    return "font-medium text-primary";
  }
  return "text-muted-foreground hover:text-foreground";
}

function ActiveMark({ isActive }: Readonly<{ isActive: boolean }>) {
  if (!isActive) {
    return null;
  }
  return (
    <span
      className="absolute inset-x-2 top-0 h-0.5 rounded-full bg-primary"
      aria-hidden
    />
  );
}

export function AppMobileMoreButton({
  isActive,
  isOpen,
  onOpen,
}: Readonly<AppMobileMoreButtonProps>) {
  return (
    <button
      type="button"
      aria-label="More navigation"
      aria-expanded={isOpen}
      className={cn(
        "relative flex min-h-14 w-full flex-col items-center justify-center gap-0.5 px-0.5 py-2 text-nav-xs tracking-tight transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        moreButtonClass(isActive),
      )}
      onClick={onOpen}
    >
      <ActiveMark isActive={isActive} />
      <Menu
        className={cn("size-5 shrink-0", isActive && "text-primary")}
        aria-hidden
      />
      <span className="max-w-full truncate">More</span>
    </button>
  );
}
