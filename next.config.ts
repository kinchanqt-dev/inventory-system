import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ywcxjeyeiepiksywcdmm.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon" }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
