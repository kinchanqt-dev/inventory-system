"use client";

import { cn } from "@/lib/utils";

import {
  AppNavSectionList,
  type AppNavSectionGroup,
} from "@/components/layout/app-nav-section-list";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui";

interface AppMobileMoreSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pathname: string;
  groups: AppNavSectionGroup[];
}

function sheetLinkClass(isActive: boolean) {
  return cn(
    "inline-flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
    isActive
      ? "bg-primary font-medium text-primary-foreground"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
  );
}

export function AppMobileMoreSheet({
  open,
  onOpenChange,
  pathname,
  groups,
}: Readonly<AppMobileMoreSheetProps>) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="gap-0 rounded-t-lg pb-safe md:hidden">
        <SheetHeader className="border-b border-border/60">
          <SheetTitle>More</SheetTitle>
        </SheetHeader>
        <AppNavSectionList
          groups={groups}
          pathname={pathname}
          linkClassName={sheetLinkClass}
          onNavigate={() => onOpenChange(false)}
          className="space-y-5 overflow-y-auto px-4 py-4"
        />
      </SheetContent>
    </Sheet>
  );
}
