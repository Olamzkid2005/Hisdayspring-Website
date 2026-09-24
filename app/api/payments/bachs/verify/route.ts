import { NextResponse } from "next/server";
import { getBachsCheckoutSession, isBachsConfigured } from "@/lib/server/bachs";
import { decodeBookOrder } from "@/lib/server/book-orders";

/**
 * Confirm a checkout server-side.
 *
 * The buyer returns from the hosted page with `?checkout_id=` appended, but a
 * redirect is not proof of payment: the tab can close, and the query string is
 * editable by hand. So the success page verifies against the API instead of
 * trusting the URL. Webhooks remain the source of truth for fulfilment.
 */
export async function POST(request: Request) {
  if (!isBachsConfigured()) {
    return NextResponse.json(
      { success: false, message: "Payment system is not configured" },
      { status: 503 }
    );
  }

  let body: { checkoutId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
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
  const isSuccessful = result.data.status === "completed";

  const metadata = result.data.metadata;
  const order =
    metadata && isSuccessful
      ? decodeBookOrder(metadata.items, metadata.fulfillment)
      : null;

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

  return NextResponse.json({
    success: isSuccessful,
    checkoutId: result.data.checkoutId,
    reference: result.data.reference ?? undefined,
    status: result.data.status,
    paymentMethod: result.data.paymentMethod,
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
