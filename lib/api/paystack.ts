/**
 * Browser adapter for the server-side Paystack payment routes.
 * Secret keys must never be used in client components.
 */

import type { PaymentResponse } from "@/types";

interface PaymentRouteResponse extends PaymentResponse {
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
    console.error("Paystack request error:", error);
    return {
      success: false,
      message: "Unable to connect to the payment service",
    };
  }
}

/**
 * Initialize a Paystack payment through our server-side route.
 * `amount` is in kobo for backwards compatibility with existing callers.
 * Settlement routing (e.g. pastoral giving) is resolved server-side.
 */
export async function initializePayment(
  email: string,
  amount: number,
  metadata?: Record<string, string>
): Promise<PaymentResponse> {
  return postPaymentRoute("/api/payments/paystack/initialize", {
    email,
    amount: amount / 100,
    metadata,
  });
}

/**
 * Verify a Paystack payment through our server-side route.
 */
export async function verifyPayment(reference: string): Promise<boolean> {
  const result = await postPaymentRoute("/api/payments/paystack/verify", {
    reference,
  });
  return result.success;
}
