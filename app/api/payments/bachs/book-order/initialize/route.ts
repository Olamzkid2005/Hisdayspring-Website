import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/server/payments";
import {
  createBachsCheckoutSession,
  isBachsConfigured,
  type BachsCorridor,
} from "@/lib/server/bachs";
import { priceBookOrder } from "@/lib/server/book-orders";
import { getSiteOrigin } from "@/lib/server/site-url";
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
    // Distinguish the one case the buyer can actually fix. The old single
    // message said "Invalid or empty book order" even for a full, valid cart
    // that simply exceeded a cap, which left buyers with no idea what to do.
    const isEmpty = !Array.isArray(body.items) || body.items.length === 0;
    return NextResponse.json(
      {
        success: false,
        message: isEmpty
          ? "Your order is empty. Add at least one book and try again."
          : "We could not price this order. An item may no longer be available, so please refresh the page and try again.",
      },
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
    // Land the buyer straight on their receipt: it verifies the payment
    // server-side before rendering, so the URL is safe to share, and it works
    // for both fulfillment modes — pickup orders get their reference, PDF
    // orders their download links.
    successUrl: `${getSiteOrigin(request.url)}/books/receipt`,
    cancelUrl: `${getSiteOrigin(request.url)}/books`,
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
