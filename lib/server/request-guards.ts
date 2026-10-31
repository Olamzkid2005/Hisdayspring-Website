/**
 * Resource guards for unauthenticated payment endpoints.
 *
 * The local counter is per Node process: it is defense-in-depth, not a
 * substitute for an edge/distributed rate limit across replicas and restarts.
 */

import { createHash, randomUUID } from "node:crypto";
import { isIP } from "node:net";
import { TextDecoder } from "node:util";

const rateBuckets = new Map<string, { count: number; resetAt: number }>();
const MAX_RATE_BUCKETS = 10_000;

export type JsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; reason: "invalid" | "too-large" };

export async function readRequestText(
  request: Request,
  maxBytes: number
): Promise<{ ok: true; text: string } | { ok: false; reason: "too-large" | "invalid" }> {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return { ok: false, reason: "too-large" };
  }

  if (!request.body) return { ok: true, text: "" };
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        return { ok: false, reason: "too-large" };
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return { ok: true, text };
  } catch {
    return { ok: false, reason: "invalid" };
  } finally {
    reader.releaseLock();
  }
}

export async function readJsonBody(
  request: Request,
  maxBytes: number
): Promise<JsonBodyResult> {
  const raw = await readRequestText(request, maxBytes);
  if (!raw.ok) return raw;
  try {
    return { ok: true, value: JSON.parse(raw.text) as unknown };
  } catch {
    return { ok: false, reason: "invalid" };
  }
}

/** Use one key for a retry of the same client-side checkout attempt. */
export function getPaymentIdempotencyKey(request: Request): string {
  const supplied = request.headers.get("idempotency-key")?.trim();
  return supplied && /^[A-Za-z0-9._:-]{8,128}$/.test(supplied)
    ? supplied
    : randomUUID();
}

export function deriveCheckoutIdentity(
  kind: "donation" | "book-order",
  purpose: string,
  clientKey: string,
  normalizedPayload: unknown
): { reference: string; idempotencyKey: string } {
  const digest = createHash("sha256")
    .update(JSON.stringify({ kind, purpose, clientKey, normalizedPayload }))
    .digest("hex");
  const reference = `hisdayspring-${purpose}-${digest.slice(0, 48)}`;
  return { reference, idempotencyKey: `checkout_${digest}` };
}

const MAX_FORWARDED_VALUE_LENGTH = 512;
const UNIDENTIFIED_KEY = "unidentified";

/**
 * The caller's IP, as recorded by the proxy hop closest to us.
 *
 * Pxxl terminates TLS in Caddy, whose `reverse_proxy` ignores incoming
 * `X-Forwarded-*` values from untrusted peers and writes the connecting
 * address itself. So the **rightmost** entry is the one address we can
 * believe; everything to its left was sent by the client and is trivially
 * spoofed — which is why rotating the left-hand entries must not buy a fresh
 * bucket.
 *
 * `CF-Connecting-IP` is deliberately not read: this site is not behind
 * Cloudflare, so that header is client-controlled, and rotating it was enough
 * to bypass the limiter entirely. If the edge ever becomes Cloudflare, that
 * header (overwritten at their edge) becomes the trustworthy one and this
 * needs revisiting.
 */
export function getClientIp(request: Request): string | undefined {
  const raw = request.headers.get("x-forwarded-for");
  if (!raw) return undefined;
  const value = raw.trim();
  if (!value || value.length > MAX_FORWARDED_VALUE_LENGTH) return undefined;

  const hops = value.split(",");
  const last = hops[hops.length - 1]?.trim();
  if (!last) return undefined;

  // Tolerate the `host:port` forms an upstream may append.
  const bracketed = /^\[([0-9a-fA-F:.]+)\](?::\d{1,5})?$/.exec(last);
  const host = bracketed
    ? bracketed[1]
    : /^\d{1,3}(?:\.\d{1,3}){3}:\d{1,5}$/.test(last)
      ? last.slice(0, last.lastIndexOf(":"))
      : last;

  return isIP(host) ? host : undefined;
}

export function checkPaymentRateLimit(
  request: Request,
  bucket: string,
  limit: number,
  windowMs: number,
  now = Date.now()
): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
  // Callers we cannot identify share one bucket instead of skipping the limit
  // altogether: failing open here made every checkout endpoint unlimited for
  // anyone who simply omitted the header, which is every real visitor.
  const key = `${bucket}:${getClientIp(request) ?? UNIDENTIFIED_KEY}`;

  // Opportunistically expire old entries to keep memory bounded on warm workers.
  for (const [candidate, value] of rateBuckets) {
    if (value.resetAt <= now) rateBuckets.delete(candidate);
  }
  if (rateBuckets.size >= MAX_RATE_BUCKETS && !rateBuckets.has(key)) {
    const oldest = rateBuckets.keys().next().value;
    if (oldest) rateBuckets.delete(oldest);
  }

  const current = rateBuckets.get(key);
  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }
  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }
  current.count++;
  return { allowed: true };
}

export function resetPaymentRateLimitsForTests(): void {
  rateBuckets.clear();
}
