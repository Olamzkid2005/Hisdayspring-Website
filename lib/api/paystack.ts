/**
 * Paystack API client for donation payments
 */

import type { PaymentResponse } from "@/types";
import { config } from "@/lib/config";

const PAYSTACK_INITIALIZE_URL = "https://api.paystack.co/transaction/initialize";

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    reference: string;
    access_code: string;
    reference_code: string;
  };
}

/**
 * Initialize a Paystack payment
 */
export async function initializePayment(
  email: string,
  amount: number, // Amount in kobo (Naira * 100)
  metadata?: Record<string, string>
): Promise<PaymentResponse> {
  const publicKey = config.paystackPublicKey;

  if (!publicKey) {
    console.warn("Paystack public key not configured");
    return {
      success: false,
      message: "Payment system not configured",
    };
  }

  try {
    const response = await fetch(PAYSTACK_INITIALIZE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${publicKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount,
        currency: "NGN",
        metadata: {
          ...metadata,
          source: "hisdayspring-website",
        },
      }),
    });

    const data: PaystackInitializeResponse = await response.json();

    if (data.status) {
      return {
        success: true,
        authorizationUrl: data.data.authorization_url,
        reference: data.data.reference,
        message: data.message,
      };
    }

    return {
      success: false,
      message: data.message || "Payment initialization failed",
    };
  } catch (error) {
    console.error("Paystack error:", error);
    return {
      success: false,
      message: "An error occurred while initializing payment",
    };
  }
}

/**
 * Verify a Paystack payment
 * Note: This should be called from a server-side API route with secret key
 */
export async function verifyPayment(_reference: string): Promise<boolean> {
  // This would be called from /api/verify-payment route
  // Server-side only with PAYSTACK_SECRET_KEY
  try {
    const response = await fetch(
      `${PAYSTACK_INITIALIZE_URL.replace("initialize", "verify/${reference}")}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();
    return data.status && data.data.status === "success";
  } catch {
    return false;
  }
}
