import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  isValidDonationAmount,
  isValidEmail,
  isValidMetadata,
  PAYMENT_CURRENCY,
  type PaymentMetadata,
} from "@/lib/server/payments";
import { PASTORAL_FLUTTERWAVE_SUBACCOUNT_ID } from "@/data/donations";

const FLUTTERWAVE_PAYMENTS_URL = "https://api.flutterwave.com/v3/payments";

/**
 * Pastoral/ministerial gifts settle into the pastor's own Flutterwave
 * subaccount when one is configured; every other gift settles into the
 * church's main account. The subaccount is resolved server-side only —
 * client-supplied subaccount IDs are never trusted, so donors cannot
 * redirect funds.
 */
export function resolveSubaccountId(metadata: PaymentMetadata): string | undefined {
  if (metadata.purpose !== "pastoral-giving") return undefined;
  const fromEnv = process.env.PASTORAL_FLUTTERWAVE_SUBACCOUNT_ID?.trim();
  const candidate = fromEnv || PASTORAL_FLUTTERWAVE_SUBACCOUNT_ID;
  return candidate && /^[A-Za-z0-9_-]{2,60}$/.test(candidate)
    ? candidate
    : undefined;
}

export async function POST(request: Request) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      { success: false, message: "Payment system is not configured" },
      { status: 503 }
    );
  }

  let body: {
    email?: unknown;
    amount?: unknown;
    name?: unknown;
    phone?: unknown;
    metadata?: unknown;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }

  const metadata = body.metadata as PaymentMetadata;
  const subaccountId = resolveSubaccountId(metadata);

  if (
    !isValidEmail(body.email) ||
    !isValidDonationAmount(body.amount) ||
    typeof body.name !== "string" ||
    typeof body.phone !== "string" ||
    !isValidMetadata(metadata)
  ) {
    return NextResponse.json(
      { success: false, message: "Invalid donation details" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(FLUTTERWAVE_PAYMENTS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: `hisdayspring-${randomUUID()}`,
        amount: body.amount,
        currency: PAYMENT_CURRENCY,
        email: body.email,
        phone_number: body.phone,
        name: body.name,
        redirect_url: `${new URL(request.url).origin}/giving`,
        meta: {
          ...metadata,
          source: "hisdayspring-website",
        },
        ...(subaccountId ? { subaccounts: [{ id: subaccountId }] } : {}),
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok || data.status !== "success" || !data.data?.link) {
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
      authorizationUrl: data.data.link,
      reference: data.data.tx_ref,
      message: data.message,
    });
  } catch (error) {
    console.error("Flutterwave initialization error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to initialize payment" },
      { status: 502 }
    );
  }
}
