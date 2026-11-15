import { ImageResponse } from "next/og";
import { connection } from "next/server";

import { getShopBranding } from "@/features/settings/api/settings.queries";

function mimeFromLogoPath(logoPath: string): string {
  if (logoPath.includes(".png")) return "image/png";
  if (logoPath.includes(".webp")) return "image/webp";
  return "image/jpeg";
}

function isRemoteLogoPath(logoPath: string) {
  return logoPath.startsWith("http://") || logoPath.startsWith("https://");
}

async function fetchRemoteLogo(logoPath: string): Promise<Response | null> {
  try {
    const response = await fetch(logoPath, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    const bytes = await response.arrayBuffer();
    return new Response(bytes, {
      headers: {
        "Content-Type":
          response.headers.get("content-type") ?? mimeFromLogoPath(logoPath),
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  } catch {
    return null;
  }
}

async function logoFileResponse(logoPath: string): Promise<Response | null> {
  if (!isRemoteLogoPath(logoPath)) {
    return null;
  }
  return fetchRemoteLogo(logoPath);
}

function shopInitial(shopTitle: string) {
  const initial = shopTitle.trim().charAt(0).toUpperCase();
  if (initial) {
    return initial;
  }
  return "S";
}

export async function shopIconResponse(size: number): Promise<Response> {
  await connection();

  const branding = await getShopBranding();
  if (branding.logoPath) {
    const logoResponse = await logoFileResponse(branding.logoPath);
    if (logoResponse) {
      return logoResponse;
    }
  }

  const initial = shopInitial(branding.shopTitle);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: branding.primaryColor,
          color: "#ffffff",
          fontSize: Math.round(size * 0.55),
          fontWeight: 700,
        }}
      >
        {initial}
      </div>
    ),
    { width: size, height: size },
  );
}
