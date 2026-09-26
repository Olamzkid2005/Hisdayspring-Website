/**
 * The public origin of the site, used to build URLs that leave the server —
 * Bachs `success_url`/`cancel_url`, receipt links, webhook targets.
 *
 * Why not `new URL(request.url).origin`? Behind a proxy that terminates TLS
 * and rewrites Host (Pxxl's container routes to `localhost:8888`), the
 * Next.js request URL reflects the internal hop, not the public site. Bachs
 * rejects `success_url` values that are not publicly reachable, so every
 * checkout died with a 502. Vercel preserves the public URL in request.url,
 * which is why the same code worked there.
 *
 * Trust order:
 * 1. `SITE_URL` — explicit, set it in the host's env panel
 *    (e.g. https://hisdayspring.org). Server-only: read at runtime, not
 *    inlined into any bundle, not spoofable by clients. (Not
 *    NEXT_PUBLIC_: those are statically replaced at build time, so a
 *    runtime-set value would never be seen.)
 * 2. `VERCEL_URL` — set automatically by Vercel deployments.
 * 3. The request URL — fallback for local dev (`localhost:3000`), where
 *    Bachs will (correctly) refuse the redirect, printing a clear error.
 *
 * Never trust `X-Forwarded-Host` here: a client-supplied header would let
 * an attacker point the post-payment redirect at their own domain.
 */

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

export function getSiteOrigin(requestUrl?: string): string {
  const explicit = process.env.SITE_URL?.trim();
  if (explicit) {
    return stripTrailingSlash(
      /^https?:\/\//.test(explicit) ? explicit : `https://${explicit}`
    );
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return stripTrailingSlash(`https://${vercelUrl}`);
  }

  if (requestUrl) {
    try {
      return stripTrailingSlash(new URL(requestUrl).origin);
    } catch {
      // Fall through to the last resort below.
    }
  }

  // Local dev with no config at all.
  return "http://localhost:3000";
}
