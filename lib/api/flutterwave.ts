/**
 * Flutterwave API client for donation payments (optional)
 */

import type { PaymentResponse } from "@/types";
import { config } from "@/lib/config";

const FLUTTERWAVE_INITIALIZE_URL = "https://api.flutterwave.com/v3/payments";

export interface FlutterwaveResponse {
  status: string;
  message: string;
  data: {
    link: string;
  };
}

/**
 * Initialize a Flutterwave payment
 */
export async function initializeFlutterwavePayment(
  email: string,
  amount: number,
  name: string,
  phone: string,
  metadata?: Record<string, string>
): Promise<PaymentResponse> {
  const publicKey = config.flutterwavePublicKey;

  if (!publicKey) {
    console.warn("Flutterwave public key not configured");
    return {
      success: false,
      message: "Flutterwave not configured",
    };
  }

  try {
    const response = await fetch(FLUTTERWAVE_INITIALIZE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${publicKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: `hisdayspring-${Date.now()}`,
        amount,
        currency: "NGN",
        email,
        phone_number: phone,
        name,
        redirect_url: typeof window !== "undefined"
          ? `${window.location.origin}/#give`
          : "https://hisdayspring.org/#give",
        meta: metadata,
      }),
    });

    const data: FlutterwaveResponse = await response.json();

    if (data.status === "success") {
      return {
        success: true,
        authorizationUrl: data.data.link,
        reference: data.data.link.split("/").pop() || "",
        message: data.message,
      };
    }

    return {
      success: false,
      message: data.message || "Payment initialization failed",
    };
  } catch (error) {
    console.error("Flutterwave error:", error);
    return {
      success: false,
      message: "An error occurred while initializing payment",
    };
  }
}
