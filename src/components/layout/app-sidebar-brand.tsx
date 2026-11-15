"use client";

import Image from "next/image";
import { PanelLeft, PanelLeftClose } from "lucide-react";

import { cn } from "@/lib/utils";
import { ROLE_LABELS } from "@/enums";

import { Button } from "@/components/ui";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";

import { BrandMark } from "@/features/settings/components/brand-mark";

import type { RoleValue } from "@/enums";
import type { ShopBranding } from "@/features/settings";

interface AppSidebarBrandProps {
  name: string;
  role: RoleValue;
  branding: ShopBranding;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

function CollapsedBrandMark({
  branding,
}: Readonly<{ branding: ShopBranding }>) {
  if (branding.logoPath) {
    return (
      <Image
        src={branding.logoPath}
        alt={`${branding.shopTitle} logo`}
        width={32}
        height={32}
        className="size-8 rounded-md object-contain"
        unoptimized
      />
    );
  }

  return (
    <span
      className="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground"
      aria-label={branding.shopTitle}
    >
      {branding.shopTitle.trim().charAt(0).toUpperCase() || "S"}
    </span>
  );
}

function ExpandedBrandHeader({
  name,
  role,
  branding,
}: Readonly<{
  name: string;
  role: RoleValue;
  branding: ShopBranding;
}>) {
  return (
    <>
      <BrandMark
        branding={branding}
        size="sm"
        className="flex-col items-start gap-2"
        titleClassName="font-heading text-lg"
      />
      <p className="mt-3 truncate text-xs text-muted-foreground">
        {name} · {ROLE_LABELS[role]}
      </p>
    </>
  );
}

function SidebarCollapseButton({
  collapsed,
  onToggleCollapsed,
}: Readonly<{
  collapsed: boolean;
  onToggleCollapsed: () => void;
}>) {
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="min-h-11 w-11 px-0"
              aria-label="Expand sidebar"
              aria-expanded={false}
              onClick={onToggleCollapsed}
            />
          }
        >
          <PanelLeft className="size-4" aria-hidden />
        </TooltipTrigger>
        <TooltipContent side="right">Expand sidebar</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-3 min-h-11 w-full justify-start gap-2"
            aria-label="Collapse sidebar"
            aria-expanded
            onClick={onToggleCollapsed}
          />
        }
      >
        <PanelLeftClose className="size-4" aria-hidden />
        <span>Collapse</span>
      </TooltipTrigger>
      <TooltipContent side="right">Collapse sidebar</TooltipContent>
    </Tooltip>
  );
}

export function AppSidebarBrand({
  name,
  role,
  branding,
  collapsed,
  onToggleCollapsed,
}: Readonly<AppSidebarBrandProps>) {
  return (
    <div
      className={cn(
        "pb-4",
        collapsed ? "flex flex-col items-center gap-3" : "px-2 pb-5",
      )}
    >
      {collapsed ? (
        <CollapsedBrandMark branding={branding} />
      ) : (
        <ExpandedBrandHeader name={name} role={role} branding={branding} />
      )}

      <SidebarCollapseButton
        collapsed={collapsed}
        onToggleCollapsed={onToggleCollapsed}
      />
    </div>
  );
}
