import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { connection } from "next/server";
import { Suspense } from "react";

import { UnsavedChangesDialog } from "@/components/shared";
import { Toaster } from "@/components/ui";

import { ThemeProvider } from "@/providers";

import {
  brandingCssVariables,
  getShopBranding,
} from "@/features/settings";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const branding = await getShopBranding();
  return {
    title: branding.shopTitle,
    description:
      branding.tagline ?? "Local inventory and POS for a small food business",
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f5f3" },
    { media: "(prefers-color-scheme: dark)", color: "#1a221e" },
  ],
};

function AppChrome({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider>
      {children}
      <Toaster />
      <UnsavedChangesDialog />
    </ThemeProvider>
  );
}

async function BrandedAppChrome({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await connection();
  const branding = await getShopBranding();
  const brandStyle = brandingCssVariables(branding) as CSSProperties;

  return (
    <div
      className="flex min-h-full flex-1 flex-col"
      style={brandStyle}
    >
      <AppChrome>{children}</AppChrome>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        <Suspense
          fallback={<AppChrome>{children}</AppChrome>}
        >
          <BrandedAppChrome>{children}</BrandedAppChrome>
        </Suspense>
      </body>
    </html>
  );
}
