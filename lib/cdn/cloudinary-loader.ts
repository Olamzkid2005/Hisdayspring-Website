import type { ImageLoaderProps } from "next/image";

/**
 * Custom Next.js image loader backed by Cloudinary.
 *
 * Code keeps referencing `/images/...` paths exactly as before. At render time
 * this loader rewrites them to Cloudinary delivery URLs with on-the-fly
 * optimization (f_auto → WebP/AVIF, c_limit,w_<width> → never upscaled).
 *
 * If NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is unset (e.g. local dev fallback),
 * the original local path is returned so nothing breaks.
 */

const CDN_HOST = "res.cloudinary.com";

function encodePublicId(localPath: string): string {
  // "/images/gallery/DSC01524.jpg" -> "gallery/DSC01524" (segments URI-encoded)
  const withoutPrefix = localPath.replace(/^\/?images\//, "");
  const noExt = withoutPrefix.replace(/\.[a-zA-Z0-9]+$/, "");
  return noExt
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // No cloud configured → serve the file as-is (local fallback).
  if (!cloudName) return src;

  const qualityParam = `q_${Math.round(quality ?? 75)}`;
  const transforms = `f_auto,${qualityParam},c_limit,w_${width}`;

  // Local repo image → Cloudinary upload delivery.
  if (src.startsWith("/images/")) {
    return `https://${CDN_HOST}/${cloudName}/image/upload/${transforms}/${encodePublicId(src)}`;
  }

  // Remote image (e.g. Unsplash) → Cloudinary fetch proxy, also optimized.
  if (/^https?:\/\//.test(src)) {
    return `https://${CDN_HOST}/${cloudName}/image/fetch/${transforms}/${encodeURIComponent(src)}`;
  }

  return src;
}

export default cloudinaryLoader;
