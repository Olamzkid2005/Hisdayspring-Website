import { NextResponse } from "next/server";

const PAYSTACK_VERIFY_URL = "https://api.paystack.co/transaction/verify";

export async function POST(request: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { success: false, message: "Payment system is not configured" },
      { status: 503 }
    );
  }

  let body: { reference?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }

  if (
    typeof body.reference !== "string" ||
    !/^[A-Za-z0-9._-]{1,100}$/.test(body.reference)
  ) {
    return NextResponse.json(
      { success: false, message: "A valid transaction reference is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${PAYSTACK_VERIFY_URL}/${encodeURIComponent(body.reference)}`,
      {
        headers: { Authorization: `Bearer ${secretKey}` },
        cache: "no-store",
      }
    );
    const data = await response.json();
    const transaction = data.data;
    const isSuccessful =
      response.ok &&
      data.status === true &&
      transaction?.status === "success" &&
      transaction?.currency === "NGN";

    return NextResponse.json({
      success: isSuccessful,
      reference: transaction?.reference || body.reference,
      status: transaction?.status,
      amount: transaction?.amount,
      currency: transaction?.currency,
      message: isSuccessful
        ? "Payment verified"
        : data.message || "Payment could not be verified",
    });
  } catch (error) {
    console.error("Paystack verification error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to verify payment" },
      { status: 502 }
    );
  }
}
