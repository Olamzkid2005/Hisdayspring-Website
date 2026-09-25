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
 *
 * Retries through the redirect race — see `verifyBookOrder`. Returns a small
 * status so the giving page can offer a manual re-check for bank transfers,
 * which settle slower than cards.
 */
export type DonationVerifyResult = {
  success: boolean;
  /** True when the checkout exists but has not settled yet (worth re-checking). */
  pending: boolean;
  status?: string;
};

export async function verifyDonation(
  checkoutId: string,
  options: { retries?: number; delayMs?: number } = {}
): Promise<DonationVerifyResult> {
  try {
    const maxAttempts = (options.retries ?? 4) + 1;
    const delayMs = options.delayMs ?? 800;
    let last: DonationVerifyResult = { success: false, pending: false };

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (attempt > 0) {
        await new Promise((resolve) => setTimeout(resolve, attempt * delayMs));
      }

      let response: Response;
      try {
        response = await fetch("/api/payments/bachs/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkoutId }),
        });
      } catch {
        // Transport-level failure — the manual re-check covers these; do not
        // grind through retries against a dead connection.
        return { success: false, pending: false };
      }

      let data: {
        success?: boolean;
        status?: string;
        message?: string;
      };
      try {
        data = (await response.json()) as typeof data;
      } catch {
        return { success: false, pending: false };
      }

      const status = data.status;
      // Only the "exists but not settled yet" race is worth retrying.
      // Expired/cancelled are terminal; a bogus id never returns a status.
      const pending = status === "open";
      last = { success: data.success === true, pending, status };

      if (last.success || !pending) break;
    }

    return last;
  } catch {
    return { success: false, pending: false };
  }
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
 *
 * Retries through the redirect race: Bachs bounces the buyer back the moment
 * the payment succeeds, a beat before the checkout session flips to
 * `completed`, so the first verify can legitimately come back unpaid. Retries
 * are capped, with a growing delay, and only when the checkout is not yet
 * terminal — a genuinely unpaid or bogus id fails fast.
 */
export async function verifyBookOrder(
  checkoutId: string,
  options: { retries?: number; delayMs?: number } = {}
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
    const maxAttempts = (options.retries ?? 4) + 1;
    const delayMs = options.delayMs ?? 800;
    let lastMessage = "We could not confirm this payment.";

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (attempt > 0) {
        // 800ms, 1.6s, 2.4s… — long enough for the session to settle, short
        // enough that the buyer barely notices the spinner.
        await new Promise((resolve) => setTimeout(resolve, attempt * delayMs));
      }

      let response: Response;
      try {
        response = await fetch("/api/payments/bachs/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkoutId }),
        });
      } catch {
        // Transport-level failure — do not grind through retries against a
        // dead connection; the manual re-check covers these.
        break;
      }

      let data: {
        success: boolean;
        message?: string;
        checkoutId?: string;
        reference?: string;
        paymentMethod?: string;
        status?: string;
        order?: VerifiedBookOrder;
      };
      try {
        data = (await response.json()) as typeof data;
      } catch {
        break;
      }

      if (response.ok && data.success && data.order) {
        return {
          success: true,
          checkoutId: data.checkoutId ?? checkoutId,
          reference: data.reference,
          paymentMethod: data.paymentMethod,
          order: data.order,
        };
      }

      lastMessage = data.message || "We could not confirm this payment.";

      // Only the "exists but not settled yet" race is worth retrying.
      // Expired and cancelled are terminal — retrying cannot change them, and
      // a bogus id never returns a status at all.
      if (data.status !== "open") break;
    }

    return { success: false, message: lastMessage };
  } catch {
    return {
      success: false,
      message: "Unable to reach the payment service to confirm this order.",
    };
  }
}
