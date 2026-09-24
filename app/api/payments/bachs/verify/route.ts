import { NextResponse } from "next/server";
import { getBachsCheckoutSession, isBachsConfigured } from "@/lib/server/bachs";

/**
 * Confirm a checkout server-side.
 *
 * The donor returns from the hosted page with `?checkout_id=` appended, but a
 * redirect is not proof of payment: the customer can close the tab, and the
 * query string is editable by hand. So the success page verifies against the
 * API instead of trusting the URL. Webhooks remain the source of truth for
 * fulfilment.
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

  return NextResponse.json({
    success: isSuccessful,
    checkoutId: result.data.checkoutId,
    reference: result.data.reference ?? undefined,
    status: result.data.status,
    message: isSuccessful
      ? "Payment verified"
      : "This checkout has not been completed",
  });
}
