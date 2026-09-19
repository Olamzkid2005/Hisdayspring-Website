import { NextResponse } from "next/server";

const FLUTTERWAVE_VERIFY_URL = "https://api.flutterwave.com/v3/transactions";

export async function POST(request: Request) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { success: false, message: "Payment system is not configured" },
      { status: 503 }
    );
  }

  let body: { transactionId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }

  const transactionId = body.transactionId;
  if (
    (typeof transactionId !== "string" && typeof transactionId !== "number") ||
    !/^[A-Za-z0-9._-]{1,100}$/.test(String(transactionId))
  ) {
    return NextResponse.json(
      { success: false, message: "A valid transaction ID is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${FLUTTERWAVE_VERIFY_URL}/${encodeURIComponent(String(transactionId))}/verify`,
      {
        headers: { Authorization: `Bearer ${secretKey}` },
        cache: "no-store",
      }
    );
    const data = await response.json();
    const transaction = data.data;
    const isSuccessful =
      response.ok &&
      data.status === "success" &&
      transaction?.status === "successful" &&
      transaction?.currency === "NGN";

    return NextResponse.json({
      success: isSuccessful,
      transactionId: transaction?.id || transactionId,
      status: transaction?.status,
      amount: transaction?.amount,
      currency: transaction?.currency,
      message: isSuccessful
        ? "Payment verified"
        : data.message || "Payment could not be verified",
    });
  } catch (error) {
    console.error("Flutterwave verification error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to verify payment" },
      { status: 502 }
    );
  }
}
