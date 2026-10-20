import { NextResponse } from "next/server";
import { getBachsCheckoutSession, isBachsConfigured } from "@/lib/server/bachs";
import { decodeBookOrder } from "@/lib/server/book-orders";
import { checkPaymentRateLimit, readJsonBody } from "@/lib/server/request-guards";
import { PRICE_TOLERANCE_NGN } from "@/lib/server/payments";

/**
 * Confirm a checkout server-side.
 *
 * The buyer returns from the hosted page with `?checkout_id=` appended, but a
 * redirect is not proof of payment: the tab can close, and the query string is
 * editable by hand. So the success page verifies against the API instead of
 * trusting the URL. Webhooks remain the source of truth for fulfilment.
 */
export async function POST(request: Request) {
  const rateLimit = checkPaymentRateLimit(request, "checkout-verify", 60, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, message: "Too many verification attempts. Try again shortly." },
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

  const parsed = await readJsonBody(request, 4 * 1024);
  if (!parsed.ok) {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: parsed.reason === "too-large" ? 413 : 400 }
    );
  }
  const body = parsed.value as { checkoutId?: unknown } | null;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { success: false, message: "A valid checkout ID is required" },
      { status: 400 }
    );
  }

  // Checkout IDs are opaque prefixed strings (`chk_...`). Validate the shape
  // rather than assuming, and never interpolate it unescaped.
  if (
    typeof body.checkoutId !== "string" ||
    !/^[A-Za-z0-9._:-]{1,200}$/.test(body.checkoutId)
  ) {
    return NextResponse.json(
      { success: false, message: "A valid checkout ID is required" },
      { status: 400 }
    );
  }

  const result = await getBachsCheckoutSession(body.checkoutId);

  if (!result.ok) {
    return NextResponse.json(
      { success: false, message: result.message },
      { status: 502 }
    );
  }

  // `completed` is the only terminal success state; `open`, `expired` and
  // `cancelled` all mean no money moved.
  const isCompleted = result.data.status === "completed";

  const metadata = result.data.metadata;
  const decodedOrder =
    metadata && isCompleted
      ? decodeBookOrder(
          metadata.items,
          metadata.fulfillment,
          metadata.order_snapshot
        )
      : null;
  const expectedAmount =
    typeof metadata?.type === "string" && metadata.type === "donation"
      ? typeof metadata.amount === "string"
        ? Number(metadata.amount)
        : undefined
      : undefined;
  const paidAmountRaw = result.data.amountPaid;
  const parsedPaidAmount =
    typeof paidAmountRaw === "number"
      ? paidAmountRaw
      : typeof paidAmountRaw === "string" && /^\d+(?:\.\d{1,2})?$/.test(paidAmountRaw)
        ? Number(paidAmountRaw)
        : undefined;
  const amountRemaining =
    typeof result.data.amountRemaining === "number"
      ? result.data.amountRemaining
      : typeof result.data.amountRemaining === "string" &&
          /^\d+(?:\.\d{1,2})?$/.test(result.data.amountRemaining)
        ? Number(result.data.amountRemaining)
        : undefined;
  const paidAmountValid =
    parsedPaidAmount !== undefined &&
    Number.isFinite(parsedPaidAmount) &&
    parsedPaidAmount > 0 &&
    amountRemaining !== undefined &&
    Number.isFinite(amountRemaining) &&
    amountRemaining <= PRICE_TOLERANCE_NGN &&
    result.data.currency === "NGN";
  const amountMatchesOrder =
    metadata?.type === "book-order"
      ? decodedOrder !== null &&
        paidAmountValid &&
        Math.abs(parsedPaidAmount! - decodedOrder.total) <= PRICE_TOLERANCE_NGN
      : true;
  const amountMatchesDonation =
    metadata?.type === "donation"
      ? paidAmountValid &&
        expectedAmount !== undefined &&
        Math.abs(parsedPaidAmount! - expectedAmount) <= PRICE_TOLERANCE_NGN
      : true;
  const order =
    decodedOrder && amountMatchesOrder ? decodedOrder : null;

  // The buyer's name and phone come from the checkout metadata (set by our
  // own initialize route) — used on the staff verify page to hand over the
  // right order. Never returned for non-order checkouts.
  const buyer =
    order && metadata
      ? {
          name:
            typeof metadata.name === "string" ? metadata.name : undefined,
          phone:
            typeof metadata.phone === "string" ? metadata.phone : undefined,
        }
      : undefined;

  const isSuccessful =
    isCompleted &&
    (metadata?.type === "book-order"
      ? amountMatchesOrder
      : metadata?.type === "donation"
        ? amountMatchesDonation
        : false);

  return NextResponse.json({
    success: isSuccessful,
    checkoutId: result.data.checkoutId,
    reference: result.data.reference ?? undefined,
    status: result.data.status,
    paymentMethod: result.data.paymentMethod,
    // When the session was paid (ISO instant). The receipt renders this in
    // Lagos time, not the buyer's timezone.
    paidAt: result.data.completedAt,
    message: isSuccessful
      ? "Payment verified"
      : "This checkout has not been completed",
    ...(order
      ? {
          order: {
            fulfillment: order.fulfillment,
            lines: order.lines,
            total: order.total,
            catalogMatch: order.catalogMatch,
            ...(buyer ? { buyer } : {}),
          },
        }
      : {}),
  });
}
