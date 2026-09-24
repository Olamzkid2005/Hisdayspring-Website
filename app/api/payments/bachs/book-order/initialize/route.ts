import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/server/payments";
import {
  createBachsCheckoutSession,
  isBachsConfigured,
  type BachsCorridor,
} from "@/lib/server/bachs";
import { priceBookOrder } from "@/lib/server/book-orders";
import type { PaymentMethod } from "@/types";

/**
 * Same corridors as the giving flow: NGN card or NGN bank transfer, chosen
 * server-side from the payment method. Mobile money has no NGN corridor.
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

interface BookOrderInitializeRequest {
  email: unknown;
  name: unknown;
  phone: unknown;
  paymentMethod: unknown;
  fulfillment: unknown;
  items: unknown;
}

/**
 * Create a Bachs checkout for a book order.
 *
 * The client sends only book IDs and quantities — the total is priced here
 * from `data/books.ts`, so a tampered client cannot buy a ₦3,000 book for
 * ₦50. The cart and fulfillment choice ride in the checkout metadata, which
 * is how the verify route and the download route reconstruct the order later
 * with no database.
 */
export async function POST(request: Request) {
  if (!isBachsConfigured()) {
    return NextResponse.json(
      { success: false, message: "Payment system is not configured" },
      { status: 503 }
    );
  }

  let body: BookOrderInitializeRequest;
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
    typeof body.name !== "string" ||
    body.name.trim().length === 0 ||
    body.name.trim().length > 120 ||
    typeof body.phone !== "string" ||
    body.phone.trim().length === 0 ||
    body.phone.trim().length > 40 ||
    !isValidEmail(body.email) ||
    !corridors
  ) {
    return NextResponse.json(
      { success: false, message: "Invalid order details" },
      { status: 400 }
    );
  }

  const order = priceBookOrder(body.items, body.fulfillment);
  if (!order) {
    return NextResponse.json(
      { success: false, message: "Invalid or empty book order" },
      { status: 400 }
    );
  }

  const name = body.name.trim();
  const phone = body.phone.trim();
  const reference = `hisdayspring-book-${randomUUID()}`;

  const result = await createBachsCheckoutSession({
    amount: order.total,
    name,
    email: body.email,
    phone,
    purpose: "book-order",
    corridors,
    successUrl: `${new URL(request.url).origin}/books`,
    cancelUrl: `${new URL(request.url).origin}/books`,
    idempotencyKey: `checkout_${reference}`,
    reference,
    type: "book-order",
    metadataExtras: {
      items: order.itemsToken,
      fulfillment: order.fulfillment,
    },
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
