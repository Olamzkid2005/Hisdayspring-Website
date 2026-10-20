import { NextResponse } from "next/server";
import {
  isValidDonationAmount,
  isValidEmail,
  isValidMetadata,
  type PaymentMetadata,
} from "@/lib/server/payments";
import {
  createBachsCheckoutSession,
  isBachsConfigured,
  type BachsCorridor,
} from "@/lib/server/bachs";
import { getSiteOrigin } from "@/lib/server/site-url";
import {
  checkPaymentRateLimit,
  deriveCheckoutIdentity,
  getPaymentIdempotencyKey,
  readJsonBody,
} from "@/lib/server/request-guards";
import type { PaymentMethod } from "@/types";

/**
 * Only corridors the church can actually accept for an NGN donation. Bachs
 * restricts by exact corridor, and NGN mobile money is not a supported
 * corridor, so `mobile-money` is intentionally absent and rejected below.
 */
const CORRIDORS_BY_METHOD: Record<PaymentMethod, BachsCorridor[]> = {
  "card-payment": ["NGN_CARD"],
  "bank-transfer": ["NGN_BANK_TRANSFER"],
  "mobile-money": [],
};

function corridorsFor(method: unknown): BachsCorridor[] | undefined {
  if (typeof method !== "string") return undefined;
  if (!Object.prototype.hasOwnProperty.call(CORRIDORS_BY_METHOD, method)) {
    return undefined;
  }
  const corridors = CORRIDORS_BY_METHOD[method as PaymentMethod];
  return corridors.length > 0 ? corridors : undefined;
}

interface InitializeRequest {
  email: unknown;
  amount: unknown;
  metadata: unknown;
  paymentMethod: unknown;
}

/**
 * Create a Bachs hosted checkout for a donation.
 *
 * Donations are arbitrary amounts with no product behind them, so this uses
 * `pricing` (a raw amount) rather than `product_cart`. Settlement routing is
 * resolved entirely server-side: no `transfer_data` is ever sent, and the
 * client cannot influence where funds land. See `data/donations.ts` for the
 * pastoral-giving upgrade path.
 */
export async function POST(request: Request) {
  const rateLimit = checkPaymentRateLimit(request, "donation-init", 10, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, message: "Too many checkout attempts. Try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      }
    );
  }

  if (!isBachsConfigured()) {
    return NextResponse.json(
      { success: false, message: "Payment system is not configured" },
      { status: 503 }
    );
  }

  const parsed = await readJsonBody(request, 16 * 1024);
  if (!parsed.ok) {
    return NextResponse.json(
      {
        success: false,
        message:
          parsed.reason === "too-large"
            ? "Request body is too large"
            : "Invalid request body",
      },
      { status: parsed.reason === "too-large" ? 413 : 400 }
    );
  }
  const body = parsed.value as InitializeRequest;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { success: false, message: "Invalid donation details" },
      { status: 400 }
    );
  }

  const corridors = corridorsFor(body.paymentMethod);

  if (
    !isValidEmail(body.email) ||
    !isValidDonationAmount(body.amount) ||
    !isValidMetadata(body.metadata) ||
    !corridors
  ) {
    return NextResponse.json(
      { success: false, message: "Invalid donation details" },
      { status: 400 }
    );
  }

  const metadata: PaymentMetadata = body.metadata;
  if (metadata.purpose === "pastoral-giving") {
    return NextResponse.json(
      {
        success: false,
        message:
          "Pastoral gifts are bank-transfer only. Please use the account details on the giving page.",
      },
      { status: 400 }
    );
  }
  const origin = getSiteOrigin(request.url);

  const clientIdempotencyKey = getPaymentIdempotencyKey(request);
  const { reference, idempotencyKey } = deriveCheckoutIdentity(
    "donation",
    metadata.purpose,
    clientIdempotencyKey,
    {
      email: body.email,
      amount: body.amount,
      paymentMethod: body.paymentMethod,
      metadata,
    }
  );

  const result = await createBachsCheckoutSession({
    amount: body.amount,
    name: metadata.name,
    email: body.email,
    phone: metadata.phone,
    purpose: metadata.purpose,
    corridors,
    // Bachs appends `?checkout_id=` to the success URL itself.
    successUrl: `${origin}/giving`,
    cancelUrl: `${origin}/giving`,
    idempotencyKey,
    reference,
  });

  if (!result.ok) {
    return NextResponse.json(
      { success: false, message: result.message },
      { status: 502 }
    );
  }

  return NextResponse.json({
    success: true,
    checkoutId: result.data.checkoutId,
    authorizationUrl: result.data.checkoutUrl,
    reference: result.data.reference || reference,
    message: "Redirecting to secure checkout",
  });
}
