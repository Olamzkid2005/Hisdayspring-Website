import { NextResponse } from "next/server";
import {
  getWebhookSecret,
  verifyPaystackSignature,
} from "@/lib/server/payments";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (
    !verifyPaystackSignature(
      payload,
      signature,
      getWebhookSecret("paystack")
    )
  ) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string } };
  try {
    event = JSON.parse(payload);
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid webhook payload" },
      { status: 400 }
    );
  }

  // Signature validation authenticates the event. Persisting the event requires
  // a database/queue, which this project does not currently have.
  console.info("Paystack webhook received", {
    event: event.event,
    reference: event.data?.reference,
  });

  return NextResponse.json({ received: true });
}
