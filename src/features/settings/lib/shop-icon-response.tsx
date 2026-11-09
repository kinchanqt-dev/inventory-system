import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";
import { connection } from "next/server";

import { getShopBranding } from "@/features/settings/api/settings.queries";

function mimeFromLogoPath(logoPath: string): string {
  if (logoPath.endsWith(".png")) return "image/png";
  if (logoPath.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

function absolutePublicPath(publicPath: string): string {
  return path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
}

async function logoFileResponse(logoPath: string): Promise<Response | null> {
  try {
    const bytes = await readFile(absolutePublicPath(logoPath));
    return new Response(bytes, {
      headers: {
        "Content-Type": mimeFromLogoPath(logoPath),
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  } catch {
    return null;
  }
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

  const initial = branding.shopTitle.trim().charAt(0).toUpperCase() || "S";

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
