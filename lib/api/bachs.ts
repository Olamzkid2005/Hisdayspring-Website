/**
 * Browser adapter for the server-side Bachs payment routes.
 *
 * The secret key stays on the server — this only talks to our own route
 * handlers. Amounts are Naira throughout, matching what the donor typed;
 * conversion to Bachs' decimal-string format happens server-side.
 */

import type { PaymentMethod, PaymentResponse } from "@/types";

async function postPaymentRoute(
  path: string,
  body: Record<string, unknown>
): Promise<PaymentResponse> {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await response.json()) as PaymentResponse;

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Payment request failed",
      };
    }

    return data;
  } catch (error) {
    console.error("Bachs request error:", error);
    return {
      success: false,
      message: "Unable to connect to the payment service",
    };
  }
}

export interface DonationCheckoutInput {
  email: string;
  /** Amount in Naira, as the donor entered it. */
  amount: number;
  name: string;
  phone: string;
  purpose: string;
  paymentMethod: PaymentMethod;
}

/**
 * Start a donation checkout through our server-side route.
 *
 * The server picks the payment-method corridors and resolves settlement, so
 * nothing routing-related is sent from here.
 */
export async function initializeDonation(
  input: DonationCheckoutInput
): Promise<PaymentResponse> {
  return postPaymentRoute("/api/payments/bachs/initialize", {
    email: input.email,
    amount: input.amount,
    paymentMethod: input.paymentMethod,
    metadata: {
      name: input.name,
      phone: input.phone,
      purpose: input.purpose,
      type: "donation",
    },
  });
}

/**
 * Confirm a checkout after the donor returns from the hosted page.
 */
export async function verifyDonation(checkoutId: string): Promise<boolean> {
  const result = await postPaymentRoute("/api/payments/bachs/verify", {
    checkoutId,
  });
  return result.success;
}

export interface BookOrderLineView {
  bookId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface VerifiedBookOrder {
  fulfillment: "pickup" | "pdf";
  lines: BookOrderLineView[];
  total: number;
  catalogMatch: boolean;
  buyer?: { name?: string; phone?: string };
}

/**
 * Confirm a book-order checkout and get the paid order details back
 * (titles, quantities, fulfillment choice) for the success and staff screens.
 */
export async function verifyBookOrder(
  checkoutId: string
): Promise<
  | {
      success: true;
      checkoutId: string;
      reference?: string;
      paymentMethod?: string;
      order: VerifiedBookOrder;
    }
  | { success: false; message: string }
> {
  try {
    const response = await fetch("/api/payments/bachs/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkoutId }),
    });
    const data = (await response.json()) as {
      success: boolean;
      message?: string;
      checkoutId?: string;
      reference?: string;
      paymentMethod?: string;
      order?: VerifiedBookOrder;
    };

    if (!response.ok || !data.success || !data.order) {
      return {
        success: false,
        message: data.message || "We could not confirm this payment.",
      };
    }

    return {
      success: true,
      checkoutId: data.checkoutId ?? checkoutId,
      reference: data.reference,
      paymentMethod: data.paymentMethod,
      order: data.order,
    };
  } catch {
    return {
      success: false,
      message: "Unable to reach the payment service to confirm this order.",
    };
  }
}
