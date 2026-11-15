"use client";

import Link from "next/link";
import { LogOut, Shield } from "lucide-react";

import { cn } from "@/lib/utils";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui";

import { logoutAction } from "@/features/auth/api/login.actions";

interface AppSidebarFooterProps {
  collapsed: boolean;
  isPlatformAdmin: boolean;
}

function AdminLinkButton({ collapsed }: Readonly<{ collapsed: boolean }>) {
  return (
    <Button
      nativeButton={false}
      variant="ghost"
      size="sm"
      className={cn(
        "min-h-11 w-full",
        collapsed ? "justify-center px-0" : "justify-start gap-2",
      )}
      render={<Link href="/admin" />}
      aria-label="Admin"
    >
      <Shield className="size-4" aria-hidden />
      {collapsed ? null : "Admin"}
    </Button>
  );
}

function SignOutButton({ collapsed }: Readonly<{ collapsed: boolean }>) {
  return (
    <form action={logoutAction}>
      <Button
        type="submit"
        variant="outline"
        className={cn(
          "min-h-11 w-full",
          collapsed ? "justify-center px-0" : "justify-center gap-2",
        )}
        aria-label="Sign out"
      >
        <LogOut className="size-4" aria-hidden />
        {collapsed ? null : "Sign out"}
      </Button>
    </form>
  );
}

export function AppSidebarFooter({
  collapsed,
  isPlatformAdmin,
}: Readonly<AppSidebarFooterProps>) {
  return (
    <div
      className={cn(
        "mt-4 space-y-2 border-t border-border/60 pt-4",
        collapsed ? "px-0" : "px-0.5",
      )}
    >
      {isPlatformAdmin ? <AdminLinkButton collapsed={collapsed} /> : null}
      <ThemeToggle compact={collapsed} labeled={!collapsed} />
      <SignOutButton collapsed={collapsed} />
    </div>
  );
}
