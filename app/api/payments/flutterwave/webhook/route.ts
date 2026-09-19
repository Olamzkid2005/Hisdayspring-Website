import { NextResponse } from "next/server";
import {
  getWebhookSecret,
  verifyFlutterwaveSignature,
} from "@/lib/server/payments";

export async function POST(request: Request) {
  const signature = request.headers.get("verif-hash");

  if (
    !verifyFlutterwaveSignature(
      signature,
      getWebhookSecret("flutterwave")
    )
  ) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  let event: { event?: string; data?: { id?: string | number } };
  try {
    event = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid webhook payload" },
      { status: 400 }
    );
  }

  // Signature validation authenticates the event. Persisting the event requires
  // a database/queue, which this project does not currently have.
  console.info("Flutterwave webhook received", {
    event: event.event,
    transactionId: event.data?.id,
  });

  return NextResponse.json({ received: true });
}
