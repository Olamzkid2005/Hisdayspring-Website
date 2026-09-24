/**
 * Provider-agnostic donation validation.
 *
 * Provider-specific concerns (API calls, webhook signature verification) live
 * in `lib/server/bachs.ts`. Everything here is about making sure the numbers
 * and identities a donor submits are sane before any gateway sees them.
 */

import { MIN_DONATION_AMOUNT } from "@/data/donations";

export const PAYMENT_CURRENCY = "NGN";

/**
 * The NGN floor (100) is Bachs' minimum charge as well as ours, so it lives
 * with the giving data and is shared with the form. Re-exported here to keep
 * the server-side import surface unchanged.
 */
export { MIN_DONATION_AMOUNT };

/**
 * A sanity ceiling only. Bachs enforces the real per-account deposit limit and
 * rejects violations with `DEPOSIT_LIMIT_EXCEEDED`, returning the authoritative
 * cap in `details.max_allowed_amount`. Do not treat this value as the gateway
 * limit — see `lib/server/bachs.ts`.
 */
export const MAX_DONATION_AMOUNT = 100_000_000;

export const VALID_DONATION_PURPOSES = new Set([
  "tithes",
  "offerings",
  "seeds-and-donations",
  "pastoral-giving",
]);

export interface PaymentMetadata {
  name: string;
  phone: string;
  purpose: string;
  type: "donation";
}

export function isValidDonationAmount(amount: unknown): amount is number {
  return (
    typeof amount === "number" &&
    Number.isInteger(amount) &&
    amount >= MIN_DONATION_AMOUNT &&
    amount <= MAX_DONATION_AMOUNT
  );
}

export function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidMetadata(metadata: unknown): metadata is PaymentMetadata {
  if (!metadata || typeof metadata !== "object") return false;

  const value = metadata as Record<string, unknown>;
  return (
    typeof value.name === "string" &&
    value.name.trim().length > 0 &&
    value.name.trim().length <= 120 &&
    typeof value.phone === "string" &&
    value.phone.trim().length > 0 &&
    value.phone.trim().length <= 40 &&
    typeof value.purpose === "string" &&
    VALID_DONATION_PURPOSES.has(value.purpose) &&
    value.purpose.trim().length <= 80 &&
    value.type === "donation"
  );
}
