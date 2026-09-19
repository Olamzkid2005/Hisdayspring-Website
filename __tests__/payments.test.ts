import { createHmac } from "node:crypto";
import {
  isValidDonationAmount,
  isValidEmail,
  isValidMetadata,
  verifyFlutterwaveSignature,
  verifyPaystackSignature,
} from "@/lib/server/payments";

describe("payment security helpers", () => {
  const metadata = {
    name: "Jane Donor",
    phone: "+2348000000000",
    purpose: "offerings",
    type: "donation" as const,
  };

  it("validates donation input boundaries", () => {
    expect(isValidDonationAmount(100)).toBe(true);
    expect(isValidDonationAmount(99)).toBe(false);
    expect(isValidDonationAmount(100_000_001)).toBe(false);
    expect(isValidEmail("donor@example.com")).toBe(true);
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidMetadata(metadata)).toBe(true);
    expect(isValidMetadata({ ...metadata, purpose: "unknown" })).toBe(false);
  });

  it("accepts pastoral-giving as a valid donation purpose", () => {
    expect(
      isValidMetadata({
        name: "Jane Donor",
        phone: "+2348000000000",
        purpose: "pastoral-giving",
        type: "donation",
      })
    ).toBe(true);
  });

  it("accepts only a valid Paystack HMAC signature", () => {
    const payload = JSON.stringify({ event: "charge.success" });
    const secret = "paystack-secret";
    const signature = createHmac("sha512", secret)
      .update(payload)
      .digest("hex");

    expect(verifyPaystackSignature(payload, signature, secret)).toBe(true);
    expect(verifyPaystackSignature(payload, "invalid", secret)).toBe(false);
    expect(verifyPaystackSignature(payload, signature, undefined)).toBe(false);
  });

  it("accepts only the configured Flutterwave verification hash", () => {
    expect(verifyFlutterwaveSignature("flutterwave-secret", "flutterwave-secret")).toBe(true);
    expect(verifyFlutterwaveSignature("invalid", "flutterwave-secret")).toBe(false);
    expect(verifyFlutterwaveSignature(null, "flutterwave-secret")).toBe(false);
  });
});
