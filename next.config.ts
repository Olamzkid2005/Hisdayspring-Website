import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    resolveExtensions: [".tsx", ".ts", ".jsx", ".js"],
    root: path.resolve(__dirname),
  },
  images: {
    // All <Image> requests are rewritten to optimized Cloudinary delivery
    // URLs by this loader (f_auto, responsive widths). Falls back to local
    // /public/images files when NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is unset.
    loaderFile: "./lib/cdn/cloudinary-loader.ts",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
        ],
      },
      {
        // Long-cache fingerprinted static assets (immutable files only).
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
