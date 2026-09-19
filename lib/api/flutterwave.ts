/**
 * Browser adapter for the server-side Flutterwave payment routes.
 * Secret keys must never be used in client components.
 */

import type { PaymentResponse } from "@/types";

interface PaymentRouteResponse extends PaymentResponse {
  transactionId?: string | number;
  status?: string;
  amount?: number;
  currency?: string;
}

async function postPaymentRoute(
  path: string,
  body: Record<string, unknown>
): Promise<PaymentRouteResponse> {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await response.json()) as PaymentRouteResponse;

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Payment request failed",
      };
    }

    return data;
  } catch (error) {
    console.error("Flutterwave request error:", error);
    return {
      success: false,
      message: "Unable to connect to the payment service",
    };
  }
}

/**
 * Initialize a Flutterwave payment through our server-side route.
 * Settlement routing (e.g. pastoral giving) is resolved server-side.
 */
export async function initializeFlutterwavePayment(
  email: string,
  amount: number,
  name: string,
  phone: string,
  metadata?: Record<string, string>
): Promise<PaymentResponse> {
  return postPaymentRoute("/api/payments/flutterwave/initialize", {
    email,
    amount,
    name,
    phone,
    metadata: {
      ...metadata,
      name,
      phone,
    },
  });
}

/**
 * Verify a Flutterwave payment through our server-side route.
 */
export async function verifyFlutterwavePayment(
  transactionId: string | number
): Promise<boolean> {
  const result = await postPaymentRoute("/api/payments/flutterwave/verify", {
    transactionId,
  });
  return result.success;
}
