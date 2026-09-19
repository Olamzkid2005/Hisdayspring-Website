import { NextResponse } from "next/server";
import {
  isValidDonationAmount,
  isValidEmail,
  isValidMetadata,
  PAYMENT_CURRENCY,
  type PaymentMetadata,
} from "@/lib/server/payments";
import { PASTORAL_PAYSTACK_SUBACCOUNT } from "@/data/donations";

const PAYSTACK_INITIALIZE_URL = "https://api.paystack.co/transaction/initialize";

interface InitializeRequest {
  email: unknown;
  amount: unknown;
  metadata: unknown;
}

/**
 * Pastoral/ministerial gifts settle into the pastor's own Paystack subaccount
 * when one is configured; every other gift settles into the church's main
 * account. The subaccount is resolved server-side only — client-supplied
 * subaccount codes are never trusted, so donors cannot redirect funds.
 */
export function resolveSubaccount(metadata: PaymentMetadata): string | undefined {
  if (metadata.purpose !== "pastoral-giving") return undefined;
  const fromEnv = process.env.PASTORAL_PAYSTACK_SUBACCOUNT?.trim();
  const candidate = fromEnv || PASTORAL_PAYSTACK_SUBACCOUNT;
  return candidate && /^ACCT_[A-Za-z0-9]{2,40}$/.test(candidate)
    ? candidate
    : undefined;
}

export async function POST(request: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
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

  if (
    !isValidEmail(body.email) ||
    !isValidDonationAmount(body.amount) ||
    !isValidMetadata(body.metadata)
  ) {
    return NextResponse.json(
      { success: false, message: "Invalid donation details" },
      { status: 400 }
    );
  }

  const metadata: PaymentMetadata = body.metadata;
  const subaccount = resolveSubaccount(metadata);

  try {
    const response = await fetch(PAYSTACK_INITIALIZE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        // The client sends Naira; Paystack expects the smallest currency unit.
        amount: body.amount * 100,
        currency: PAYMENT_CURRENCY,
        metadata: {
          ...metadata,
          source: "hisdayspring-website",
        },
        ...(subaccount ? { subaccount } : {}),
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok || !data.status || !data.data?.authorization_url) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Payment initialization failed",
        },
        { status: response.ok ? 502 : response.status }
      );
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
      message: data.message,
    });
  } catch (error) {
    console.error("Paystack initialization error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to initialize payment" },
      { status: 502 }
    );
  }
}
