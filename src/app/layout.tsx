import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { connection } from "next/server";

import { UnsavedChangesDialog } from "@/components/shared";
import { Toaster } from "@/components/ui";

import { ThemeProvider } from "@/providers";

import {
  brandingCssVariables,
  getShopBranding,
} from "@/features/settings";

import "./globals.css";

export const instant = false;

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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await connection();
  const branding = await getShopBranding();
  const brandStyle = brandingCssVariables(branding) as CSSProperties;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
      style={brandStyle}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        <ThemeProvider>
          {children}
          <Toaster />
          <UnsavedChangesDialog />
        </ThemeProvider>
      </body>
    </html>
  );
}
