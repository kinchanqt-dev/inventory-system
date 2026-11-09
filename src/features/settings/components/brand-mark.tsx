import Image from "next/image";

import { cn } from "@/lib/utils";

import type { ShopBranding } from "@/features/settings/types/settings.types";

interface BrandMarkProps {
  branding: ShopBranding;
  className?: string;
  titleClassName?: string;
  taglineClassName?: string;
  logoClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const LOGO_SIZE = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 72,
} as const;

const LOGO_CLASS = {
  sm: "size-8",
  md: "size-8 sm:size-10",
  lg: "size-12",
  xl: "size-14 sm:size-16",
} as const;

const TITLE_TEXT_CLASS = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
  xl: "text-4xl sm:text-5xl",
} as const;

export function BrandMark({
  branding,
  className,
  titleClassName,
  taglineClassName,
  logoClassName,
  size = "md",
}: Readonly<BrandMarkProps>) {
  const logoPx = LOGO_SIZE[size];
  const titleTextClass = TITLE_TEXT_CLASS[size];

  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      {branding.logoPath ? (
        <Image
          src={branding.logoPath}
          alt={`${branding.shopTitle} logo`}
          width={logoPx}
          height={logoPx}
          className={cn(
            "shrink-0 rounded-md object-contain",
            LOGO_CLASS[size],
            logoClassName,
          )}
          unoptimized
        />
      ) : null}
      <div className="min-w-0">
        {branding.tagline ? (
          <p
            className={cn(
              "tracking-brand truncate text-xs text-muted-foreground uppercase",
              size === "xl" && "text-sm",
              taglineClassName,
            )}
          >
            {branding.tagline}
          </p>
        ) : null}
        <p
          className={cn(
            "truncate font-semibold tracking-tight",
            titleTextClass,
            titleClassName,
          )}
        >
          {branding.shopTitle}
        </p>
      </div>
    </div>
  );
}
