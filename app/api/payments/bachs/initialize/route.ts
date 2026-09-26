import { randomUUID } from "node:crypto";
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
  if (!isBachsConfigured()) {
    return NextResponse.json(
      { success: false, message: "Payment system is not configured" },
      { status: 503 }
    );
  }

  let body: InitializeRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
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
  const origin = getSiteOrigin(request.url);

  // Ties the reference and the idempotency key to one logical checkout, so a
  // transport retry inside the client cannot mint a second session.
  const reference = `hisdayspring-${metadata.purpose}-${randomUUID()}`;

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
    idempotencyKey: `checkout_${reference}`,
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
