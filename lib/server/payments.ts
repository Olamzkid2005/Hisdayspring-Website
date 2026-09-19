import { createHmac, timingSafeEqual } from "node:crypto";

export const PAYMENT_CURRENCY = "NGN";
export const MIN_DONATION_AMOUNT = 100;
export const MAX_DONATION_AMOUNT = 100_000_000;

const VALID_DONATION_PURPOSES = new Set([
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

export function getWebhookSecret(provider: "paystack" | "flutterwave") {
  return provider === "paystack"
    ? process.env.PAYSTACK_SECRET_KEY
    : process.env.FLUTTERWAVE_SECRET_HASH;
}

export function verifyPaystackSignature(
  payload: string,
  signature: string | null,
  secret: string | undefined
): boolean {
  if (!signature || !secret) return false;
  return verifyDigest("sha512", payload, signature, secret);
}

export function verifyFlutterwaveSignature(
  signature: string | null,
  secretHash: string | undefined
): boolean {
  return Boolean(signature && secretHash && signature === secretHash);
}

function verifyDigest(
  algorithm: "sha512",
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = createHmac(algorithm, secret).update(payload).digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(signature, "utf8");

  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}
