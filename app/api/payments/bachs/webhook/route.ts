import { NextResponse } from "next/server";
import {
  getBachsWebhookSecret,
  verifyBachsWebhookSignature,
} from "@/lib/server/bachs";

interface BachsEventEnvelope {
  id?: string;
  type?: string;
  created_at?: string;
  organization_id?: string;
  data?: {
    checkout_id?: string | null;
    charge_id?: string | null;
    reference?: string | null;
    status?: string;
    amount?: string;
    currency?: string;
    payment_method?: string;
    payment_status?: string;
    metadata?: Record<string, unknown>;
  };
}

/** Events worth acting on. Everything else is acknowledged and ignored. */
const HANDLED_EVENTS = new Set([
  "collection.succeeded",
  "collection.failed",
  "collection.underpaid",
  "checkout.completed",
  "checkout.expired",
]);

/**
 * Bachs webhook receiver.
 *
 * Signature verification is mandatory and runs against the raw body: parsing
 * and re-serialising JSON changes whitespace and byte order, which would break
 * the HMAC. The docs are explicit that webhooks are the source of truth for
 * fulfilment and that "ignore fields you don't recognise" is the contract, so
 * unknown event types and fields are tolerated rather than rejected.
 *
 * Note: events are authenticated but not persisted. Reconciling donations,
 * sending receipts, or retrying failed events needs a database or queue, which
 * this project does not yet have.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();

  const isValid = verifyBachsWebhookSignature({
    rawBody,
    signatureV2: request.headers.get("x-bachs-signature-v2"),
    signature: request.headers.get("x-bachs-signature"),
    timestamp: request.headers.get("x-bachs-timestamp"),
    secret: getBachsWebhookSecret(),
  });

  if (!isValid) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  let event: BachsEventEnvelope;
  try {
    event = JSON.parse(rawBody) as BachsEventEnvelope;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid webhook payload" },
      { status: 400 }
    );
  }

  if (!event.type || !HANDLED_EVENTS.has(event.type)) {
    // Acknowledge so Bachs stops retrying an event we have no interest in.
    return NextResponse.json({ received: true, handled: false });
  }

  const { data } = event;

  // `charge_id` is documented as nullable (test events, legacy collections and
  // manual reconciliations all lack one), so never assume it is present.
  console.info("Bachs webhook received", {
    event: event.type,
    eventId: event.id,
    organizationId: event.organization_id,
    checkoutId: data?.checkout_id ?? undefined,
    chargeId: data?.charge_id ?? undefined,
    reference: data?.reference ?? undefined,
    status: data?.status ?? data?.payment_status ?? undefined,
    amount: data?.amount,
    currency: data?.currency,
    paymentMethod: data?.payment_method,
    purpose: data?.metadata?.purpose,
  });

  return NextResponse.json({ received: true, handled: true });
}
