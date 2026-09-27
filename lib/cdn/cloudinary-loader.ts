import type { ImageLoaderProps } from "next/image";

/**
 * Custom Next.js image loader backed by Cloudinary.
 *
 * Code keeps referencing `/images/...` paths exactly as before. At render time
 * this loader rewrites them to Cloudinary delivery URLs with on-the-fly
 * optimization (f_auto → WebP/AVIF, c_limit,w_<width> → never upscaled).
 *
 * If the cloud name is unset AND no default is compiled in (never in this
 * repo), the original local path is returned so nothing breaks.
 *
 * Replacing an image file in place keeps its URL identical, so a `?v=<version>`
 * suffix on the code path is supported for cache busting — see extractVersion.
 */

const CDN_HOST = "res.cloudinary.com";

/**
 * The church's Cloudinary cloud name. Public information (it appears in every
 * delivery URL), so a hardcoded default keeps fresh clones working even if
 * the env var is forgotten. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to override.
 */
const DEFAULT_CLOUD_NAME = "hurqcssn";

function encodePublicId(localPath: string): string {
  // "/images/gallery/DSC01524.jpg" -> "gallery/DSC01524" (segments URI-encoded)
  const withoutPrefix = localPath.replace(/^\/?images\//, "");
  const noExt = withoutPrefix.replace(/\.[a-zA-Z0-9]+$/, "");
  return noExt
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

/**
 * Splits an optional `?v=<version>` cache-buster off a local image path.
 *
 * Overwriting an image in place keeps its public id — and therefore its URL —
 * byte-identical, so browsers happily keep serving the old bytes for the whole
 * 30-day `max-age` Cloudinary sends back. Appending `?v=<version>` to the code
 * path changes the emitted URL (Cloudinary renders it as a `/v<version>/`
 * segment), which forces a fresh fetch. Bump the value whenever the underlying
 * file is replaced.
 */
function extractVersion(src: string): { path: string; version?: string } {
  const queryStart = src.indexOf("?");
  if (queryStart === -1) return { path: src };

  const path = src.slice(0, queryStart);
  const version = new URLSearchParams(src.slice(queryStart + 1)).get("v");
  const digits = version?.replace(/^v/i, "").replace(/[^0-9]/g, "");

  return { path, version: digits || undefined };
}

export function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || DEFAULT_CLOUD_NAME;

  // No cloud configured → serve the file as-is (local fallback).
  if (!cloudName) return src;

  const qualityParam = `q_${Math.round(quality ?? 75)}`;
  const transforms = `f_auto,${qualityParam},c_limit,w_${width}`;

  // Local repo image → Cloudinary upload delivery.
  if (src.startsWith("/images/")) {
    const { path, version } = extractVersion(src);
    const versionSegment = version ? `v${version}/` : "";
    return `https://${CDN_HOST}/${cloudName}/image/upload/${transforms}/${versionSegment}${encodePublicId(path)}`;
  }

  // Remote image (e.g. Unsplash) → Cloudinary fetch proxy, also optimized.
  if (/^https?:\/\//.test(src)) {
    return `https://${CDN_HOST}/${cloudName}/image/fetch/${transforms}/${encodeURIComponent(src)}`;
  }

  return src;
}

export default cloudinaryLoader;
