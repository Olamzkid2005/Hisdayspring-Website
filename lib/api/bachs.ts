/**
 * Browser adapter for the server-side Bachs payment routes.
 *
 * The secret key stays on the server — this only talks to our own route
 * handlers. Amounts are Naira throughout, matching what the donor typed;
 * conversion to Bachs' decimal-string format happens server-side.
 */

import type { PaymentMethod, PaymentResponse } from "@/types";

/**
 * Remembers the checkout we are about to send the buyer to.
 *
 * Bachs' hosted page is supposed to append `?checkout_id=` to the success
 * redirect, but the sandbox currently redirects to the bare `success_url`.
 * The initialize response tells us the id before we navigate away, so stash
 * it and let the return pages fall back to it when the URL carries no param.
 * sessionStorage (not localStorage): per-tab, dies with the tab, and never
 * holds anything sensitive — just an opaque checkout reference.
 */
const LAST_CHECKOUT_KEY = "hds-last-checkout-id";

export function stashLastCheckoutId(checkoutId: string): void {
  try {
    window.sessionStorage.setItem(LAST_CHECKOUT_KEY, checkoutId);
  } catch {
    // Storage unavailable (private mode) — the redirect param is the primary
    // path anyway; this is only the fallback.
  }
}

/**
 * The checkout id a buyer just came back with: from the URL when Bachs
 * appended it, otherwise the one stashed before we navigated away.
 */
export function resolveReturnedCheckoutId(): string | null {
  const fromUrl = new URLSearchParams(window.location.search).get("checkout_id");
  if (fromUrl && /^[A-Za-z0-9._:-]{1,200}$/.test(fromUrl)) return fromUrl;
  try {
    const stashed = window.sessionStorage.getItem(LAST_CHECKOUT_KEY);
    if (stashed && /^[A-Za-z0-9._:-]{1,200}$/.test(stashed)) return stashed;
  } catch {
    // Storage unavailable — no fallback to offer.
  }
  return null;
}

/** Drop the stash once the return page has consumed it. */
export function clearLastCheckoutId(): void {
  try {
    window.sessionStorage.removeItem(LAST_CHECKOUT_KEY);
  } catch {
    // Nothing to clean up.
  }
}

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
