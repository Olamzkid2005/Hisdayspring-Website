/**
 * Bachs server client.
 *
 * Docs: https://docs.bachs.io
 *
 * Conventions taken from the Bachs API standards, because getting any of them
 * wrong fails quietly rather than loudly:
 *
 * - Money is a decimal string at the currency's precision ("75000.00"), never
 *   minor units. There is no kobo/cents arithmetic anywhere in this file.
 * - `sk_sandbox_` keys belong to `sandbox-api.bachs.io`, `sk_live_` keys to
 *   `api.bachs.io`. Going live is a key swap, so the base URL is derived from
 *   the key prefix rather than configured separately.
 * - Webhooks (`collection.succeeded`) are the source of truth for fulfilment,
 *   never the redirect back from the hosted page.
 * - Destructive/creating POSTs carry an `Idempotency-Key` so a network retry
 *   cannot mint a second checkout session.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { PAYMENT_CURRENCY } from "./payments";

const SANDBOX_BASE_URL = "https://sandbox-api.bachs.io";
const PRODUCTION_BASE_URL = "https://api.bachs.io";

export const BACHS_CURRENCY = PAYMENT_CURRENCY;

/**
 * Payment-method corridors. Bachs restricts by exact corridor, not by payment
 * type: `USD_CARD` and `NGN_CARD` are distinct, and bank transfer exists only
 * for NGN. Donations here are priced in NGN, so only these two apply.
 */
export type BachsCorridor = "NGN_CARD" | "NGN_BANK_TRANSFER";

export type BachsCheckoutStatus = "open" | "completed" | "expired" | "cancelled";

export interface BachsCheckoutSession {
  checkoutId: string;
  checkoutUrl: string;
  status: BachsCheckoutStatus;
  reference: string | null;
  expiresAt?: string;
  createdAt?: string;
  /** Metadata echoed back by the API; used to decode book orders. */
  metadata?: Record<string, unknown>;
  /** Payment corridor used, when the API reports it (e.g. `NGN_CARD`). */
  paymentMethod?: string;
}

export type BachsResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; errorCode?: string };

export function getBachsSecretKey(): string | undefined {
  const key = process.env.BACHS_SECRET_KEY?.trim();
  return key ? key : undefined;
}

export function getBachsWebhookSecret(): string | undefined {
  const secret = process.env.BACHS_WEBHOOK_SECRET?.trim();
  return secret ? secret : undefined;
}

/**
 * Resolve the API base URL from the key itself. Docs: "Prefix conventions are
 * strict: `sk_sandbox_` keys route to the sandbox deployment, while `sk_live_`
 * keys route to production and process real money."
 *
 * An explicit `BACHS_API_BASE_URL` override wins, which is what a test harness
 * or a proxy would set. An unrecognised prefix returns `undefined` rather than
 * defaulting to production — guessing wrong there means real money.
 */
export function resolveBachsBaseUrl(
  secretKey: string | undefined = getBachsSecretKey()
): string | undefined {
  const override = process.env.BACHS_API_BASE_URL?.trim();
  if (override) return override;
  if (!secretKey) return undefined;
  if (secretKey.startsWith("sk_sandbox_")) return SANDBOX_BASE_URL;
  if (secretKey.startsWith("sk_live_")) return PRODUCTION_BASE_URL;
  return undefined;
}

export function isBachsConfigured(): boolean {
  return Boolean(getBachsSecretKey() && resolveBachsBaseUrl());
}

/**
 * Format Naira for the API. Bachs takes a decimal string at the currency's
 * precision and never minor units, so ₦1,000 becomes "1000.00" — not 100000.
 */
export function formatBachsAmount(amount: number): string {
  return amount.toFixed(2);
}

export interface CreateBachsCheckoutInput {
  amount: number;
  name: string;
  email: string;
  phone: string;
  purpose: string;
  corridors: BachsCorridor[];
  successUrl: string;
  cancelUrl: string;
  /** Idempotency key; reused verbatim across retries of the same checkout. */
  idempotencyKey: string;
  /** Your own reference for the session, max 128 chars, unique per account. */
  reference: string;
  /** What the checkout is for; recorded in metadata. Defaults to "donation". */
  type?: "donation" | "book-order";
  /** Extra metadata key/values (e.g. the encoded book-order cart). */
  metadataExtras?: Record<string, string>;
}

function parseErrorEnvelope(
  data: unknown,
  fallback: string
): { message: string; errorCode?: string } {
  if (!data || typeof data !== "object") return { message: fallback };

  const value = data as Record<string, unknown>;
  const detail = typeof value.detail === "string" ? value.detail : fallback;
  const errorCode =
    typeof value.error_code === "string" ? value.error_code : undefined;

  // Bachs returns the authoritative cap when a charge exceeds the account's
  // deposit limit, and the docs ask integrators to surface it rather than a
  // generic failure.
  if (errorCode === "DEPOSIT_LIMIT_EXCEEDED") {
    const details = value.details;
    if (details && typeof details === "object") {
      const { max_allowed_amount: maxAllowed, currency } = details as Record<
        string,
        unknown
      >;
      if (typeof maxAllowed === "string") {
        const formatted = Number(maxAllowed).toLocaleString("en-NG");
        return {
          message: `This amount is above the maximum we can accept in a single payment${
            currency ? ` (${currency})` : ""
          }. The most you can give at once is ₦${formatted}. Please lower the amount and try again.`,
          errorCode,
        };
      }
    }
  }

  return { message: detail, errorCode };
}

function toCheckoutSession(data: unknown): BachsCheckoutSession | null {
  if (!data || typeof data !== "object") return null;
  const value = data as Record<string, unknown>;

  // `checkout_id` on create/get; tolerate `id` in case the shape changes.
  const checkoutId =
    typeof value.checkout_id === "string"
      ? value.checkout_id
      : typeof value.id === "string"
        ? value.id
        : undefined;
  if (!checkoutId) return null;

  const status =
    typeof value.status === "string"
      ? (value.status as BachsCheckoutStatus)
      : "open";

  return {
    checkoutId,
    checkoutUrl:
      typeof value.checkout_url === "string" ? value.checkout_url : "",
    status,
    reference: typeof value.reference === "string" ? value.reference : null,
    expiresAt: typeof value.expires_at === "string" ? value.expires_at : undefined,
    createdAt: typeof value.created_at === "string" ? value.created_at : undefined,
    metadata:
      value.metadata && typeof value.metadata === "object"
        ? (value.metadata as Record<string, unknown>)
        : undefined,
    paymentMethod:
      typeof value.payment_method === "string" ? value.payment_method : undefined,
  };
}

const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

/**
 * Create a hosted checkout session.
 *
 * Priced with `pricing` (a raw amount, no catalog) because church donations are
 * arbitrary amounts with no product behind them — exactly the case the docs
 * describe as "the right choice when your pricing is computed at order time".
 *
 * Deliberately sends no `transfer_data` and no `platform_fee`: pastoral giving
 * currently settles into the church account, same as every other purpose. See
 * `data/donations.ts` for the Connect upgrade path.
 */
export async function createBachsCheckoutSession(
  input: CreateBachsCheckoutInput
): Promise<BachsResult<BachsCheckoutSession>> {
  const secretKey = getBachsSecretKey();
  const baseUrl = resolveBachsBaseUrl(secretKey);

  if (!secretKey || !baseUrl) {
    return { ok: false, message: "Payment system is not configured" };
  }

  const body = JSON.stringify({
    pricing: {
      currency: BACHS_CURRENCY,
      amount: formatBachsAmount(input.amount),
    },
    customer: {
      email: input.email,
      name: input.name,
      phone_number: input.phone,
    },
    // Restricting only ever narrows what the customer sees.
    payment_method_types: input.corridors,
    reference: input.reference.slice(0, 128),
    metadata: {
      name: input.name,
      phone: input.phone,
      purpose: input.purpose,
      type: input.type ?? "donation",
      source: "hisdayspring-website",
      ...input.metadataExtras,
    },
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    expires_in_minutes: 60,
  });

  let lastMessage = "Payment initialization failed";

  // Retry only transport failures and 5xx/429. A 4xx is a rejection we should
  // report, and the docs guarantee non-2xx responses are never cached against
  // the idempotency key, so replaying them is safe.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(`${baseUrl}/v1/checkout-sessions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "Idempotency-Key": input.idempotencyKey,
        },
        body,
        cache: "no-store",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const { message, errorCode } = parseErrorEnvelope(
          data,
          "Payment initialization failed"
        );
        if (RETRYABLE_STATUS.has(response.status) && attempt < 2) {
          lastMessage = message;
          await backoff(attempt);
          continue;
        }
        return { ok: false, message, errorCode };
      }

      const session = toCheckoutSession(data);
      if (!session || !session.checkoutUrl) {
        return {
          ok: false,
          message: "Payment provider returned an unexpected response",
        };
      }

      return { ok: true, data: session };
    } catch {
      // Network failure or a timeout: the idempotency key makes the retry safe.
      lastMessage = "Unable to connect to the payment service";
      if (attempt < 2) {
        await backoff(attempt);
        continue;
      }
    }
  }

  return { ok: false, message: lastMessage };
}

/**
 * Fetch a checkout session server-side to confirm whether it completed.
 *
 * A redirect alone is not proof of payment — the customer can close the tab,
 * and the query string can be edited by hand — so the success page asks the
 * API rather than trusting `?checkout_id=`.
 */
export async function getBachsCheckoutSession(
  checkoutId: string
): Promise<BachsResult<BachsCheckoutSession>> {
  const secretKey = getBachsSecretKey();
  const baseUrl = resolveBachsBaseUrl(secretKey);

  if (!secretKey || !baseUrl) {
    return { ok: false, message: "Payment system is not configured" };
  }

  try {
    const response = await fetch(
      `${baseUrl}/v1/checkout-sessions/${encodeURIComponent(checkoutId)}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const { message, errorCode } = parseErrorEnvelope(
        data,
        "Unable to verify payment"
      );
      return { ok: false, message, errorCode };
    }

    const session = toCheckoutSession(data);
    if (!session) {
      return {
        ok: false,
        message: "Payment provider returned an unexpected response",
      };
    }

    return { ok: true, data: session };
  } catch {
    return { ok: false, message: "Unable to verify payment" };
  }
}

function backoff(attempt: number): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(resolve, Math.pow(2, attempt) * 500)
  );
}

/** Docs recommend 300s; anything older is treated as a replay. */
export const BACHS_SIGNATURE_TOLERANCE_SECONDS = 300;

function computeBachsDigest(
  secret: string,
  timestamp: string,
  rawBody: string
): string {
  return createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`, "utf8")
    .digest("hex");
}

function digestsMatch(expected: string, received: string): boolean {
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(received, "utf8");
  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export interface BachsSignatureInput {
  rawBody: string;
  /** `X-Bachs-Signature-V2`: `t={timestamp},v1={sig}[,v1={sig}]` */
  signatureV2?: string | null;
  /** `X-Bachs-Signature`: bare hex digest */
  signature?: string | null;
  /** `X-Bachs-Timestamp`: unix seconds, used with the legacy header */
  timestamp?: string | null;
  secret: string | undefined;
  toleranceSeconds?: number;
  nowSeconds?: number;
}

/**
 * Verify a Bachs webhook delivery.
 *
 * Prefers `X-Bachs-Signature-V2` (the docs recommend it for new integrations).
 * Secrets rotate with a 24-hour overlap during which every delivery is signed
 * with both, so a `v1=` list must be matched against *any* entry — checking
 * only the first would break mid-rotation.
 *
 * Always called with the raw request body: re-serialising parsed JSON changes
 * byte order and whitespace and would invalidate the digest.
 */
export function verifyBachsWebhookSignature({
  rawBody,
  signatureV2,
  signature,
  timestamp,
  secret,
  toleranceSeconds = BACHS_SIGNATURE_TOLERANCE_SECONDS,
  nowSeconds = Math.floor(Date.now() / 1000),
}: BachsSignatureInput): boolean {
  if (!secret) return false;

  let signedTimestamp: string | undefined;
  let candidates: string[] = [];

  if (signatureV2) {
    const parts = signatureV2
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part.includes("="));

    for (const part of parts) {
      const separator = part.indexOf("=");
      const name = part.slice(0, separator);
      const value = part.slice(separator + 1);
      if (name === "t" && !signedTimestamp) signedTimestamp = value;
      if (name === "v1" && value) candidates.push(value);
    }
  }

  // Legacy single-signature header, still sent and paired with its timestamp.
  if (candidates.length === 0 && signature && timestamp) {
    signedTimestamp = timestamp;
    candidates = [signature];
  }

  if (!signedTimestamp || candidates.length === 0) return false;

  const parsedTimestamp = Number(signedTimestamp);
  if (!Number.isFinite(parsedTimestamp)) return false;

  if (Math.abs(nowSeconds - parsedTimestamp) > toleranceSeconds) return false;

  const expected = computeBachsDigest(secret, signedTimestamp, rawBody);
  return candidates.some((candidate) => digestsMatch(expected, candidate));
}
