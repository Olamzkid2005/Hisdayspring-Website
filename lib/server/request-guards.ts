/**
 * Resource guards for unauthenticated payment endpoints.
 *
 * Pxxl currently fronts this site through Cloudflare, so use its edge-written
 * CF-Connecting-IP header (not attacker-controlled X-Forwarded-For). The local
 * counter is per Node process: it is defense-in-depth, not a substitute for an
 * edge/distributed rate limit across replicas and restarts.
 */

import { createHash, randomUUID } from "node:crypto";
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

export function checkPaymentRateLimit(
  request: Request,
  bucket: string,
  limit: number,
  windowMs: number,
  now = Date.now()
): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
  const ip = request.headers.get("cf-connecting-ip")?.trim();
  // Fail open when the trusted edge IP header is missing rather than making
  // every unidentifiable caller share one bucket (which would let one client
  // deny service to all others). Production must configure a real edge limit.
  if (!ip || ip.length > 80) return { allowed: true };
  const key = `${bucket}:${ip}`;

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
