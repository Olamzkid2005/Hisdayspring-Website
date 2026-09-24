import { createHmac } from "node:crypto";
import {
  isValidDonationAmount,
  isValidEmail,
  isValidMetadata,
} from "@/lib/server/payments";
import {
  BACHS_SIGNATURE_TOLERANCE_SECONDS,
  formatBachsAmount,
  resolveBachsBaseUrl,
  verifyBachsWebhookSignature,
} from "@/lib/server/bachs";

function sign(secret: string, timestamp: number, body: string): string {
  return createHmac("sha256", secret)
    .update(`${timestamp}.${body}`, "utf8")
    .digest("hex");
}

describe("donation validation", () => {
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
    expect(isValidDonationAmount(1000.5)).toBe(false);
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
});

describe("bachs amount formatting", () => {
  // Bachs takes a decimal string at the currency's precision and never minor
  // units. Sending kobo-style integers is the single easiest way to charge a
  // donor 100x, so this is worth asserting directly.
  it("sends a decimal string, not minor units", () => {
    expect(formatBachsAmount(1000)).toBe("1000.00");
    expect(formatBachsAmount(1000)).not.toBe("100000");
    expect(formatBachsAmount(50000)).toBe("50000.00");
    expect(formatBachsAmount(100)).toBe("100.00");
  });

  it("always carries two decimal places", () => {
    expect(formatBachsAmount(99.5)).toBe("99.50");
    expect(formatBachsAmount(1)).toBe("1.00");
  });
});

describe("bachs base url resolution", () => {
  const originalBaseUrl = process.env.BACHS_API_BASE_URL;

  beforeEach(() => {
    delete process.env.BACHS_API_BASE_URL;
  });

  afterEach(() => {
    if (originalBaseUrl === undefined) delete process.env.BACHS_API_BASE_URL;
    else process.env.BACHS_API_BASE_URL = originalBaseUrl;
  });

  it("routes sandbox and live keys to their own deployments", () => {
    expect(resolveBachsBaseUrl("sk_sandbox_abc123")).toBe(
      "https://sandbox-api.bachs.io"
    );
    expect(resolveBachsBaseUrl("sk_live_abc123")).toBe("https://api.bachs.io");
  });

  it("refuses to guess for an unrecognised key or a missing key", () => {
    expect(resolveBachsBaseUrl("sk_test_abc123")).toBeUndefined();
    expect(resolveBachsBaseUrl("nonsense")).toBeUndefined();
    expect(resolveBachsBaseUrl(undefined)).toBeUndefined();
  });

  it("honours an explicit base url override", () => {
    process.env.BACHS_API_BASE_URL = "http://localhost:4010";
    expect(resolveBachsBaseUrl("sk_live_abc123")).toBe("http://localhost:4010");
  });
});

describe("bachs webhook signature verification", () => {
  const secret = "whsec_test_secret";
  const body = JSON.stringify({
    id: "evt_1",
    type: "collection.succeeded",
    data: { amount: "75000.00", currency: "NGN" },
  });
  const now = 1_800_000_000;

  it("accepts a correctly signed X-Bachs-Signature-V2 header", () => {
    const digest = sign(secret, now, body);

    expect(
      verifyBachsWebhookSignature({
        rawBody: body,
        signatureV2: `t=${now},v1=${digest}`,
        secret,
        nowSeconds: now,
      })
    ).toBe(true);
  });

  it("rejects a tampered body, a wrong secret and a missing signature", () => {
    const digest = sign(secret, now, body);

    expect(
      verifyBachsWebhookSignature({
        rawBody: `${body} `,
        signatureV2: `t=${now},v1=${digest}`,
        secret,
        nowSeconds: now,
      })
    ).toBe(false);

    expect(
      verifyBachsWebhookSignature({
        rawBody: body,
        signatureV2: `t=${now},v1=${digest}`,
        secret: "wrong_secret",
        nowSeconds: now,
      })
    ).toBe(false);

    expect(
      verifyBachsWebhookSignature({
        rawBody: body,
        signatureV2: null,
        secret,
        nowSeconds: now,
      })
    ).toBe(false);

    expect(
      verifyBachsWebhookSignature({
        rawBody: body,
        signatureV2: `t=${now},v1=${digest}`,
        secret: undefined,
        nowSeconds: now,
      })
    ).toBe(false);
  });

  it("rejects a stale delivery outside the tolerance window", () => {
    const stale = now - BACHS_SIGNATURE_TOLERANCE_SECONDS - 1;
    const digest = sign(secret, stale, body);

    expect(
      verifyBachsWebhookSignature({
        rawBody: body,
        signatureV2: `t=${stale},v1=${digest}`,
        secret,
        nowSeconds: now,
      })
    ).toBe(false);

    // Just inside the window is still accepted.
    const fresh = now - BACHS_SIGNATURE_TOLERANCE_SECONDS + 1;
    expect(
      verifyBachsWebhookSignature({
        rawBody: body,
        signatureV2: `t=${fresh},v1=${sign(secret, fresh, body)}`,
        secret,
        nowSeconds: now,
      })
    ).toBe(true);
  });

  it("accepts any signature during a secret rotation", () => {
    // Rotation signs each delivery with both the old and the new secret.
    const oldSecret = "whsec_old";
    const newSecret = "whsec_new";
    const header = `t=${now},v1=${sign(oldSecret, now, body)},v1=${sign(
      newSecret,
      now,
      body
    )}`;

    expect(
      verifyBachsWebhookSignature({
        rawBody: body,
        signatureV2: header,
        secret: newSecret,
        nowSeconds: now,
      })
    ).toBe(true);
    expect(
      verifyBachsWebhookSignature({
        rawBody: body,
        signatureV2: header,
        secret: oldSecret,
        nowSeconds: now,
      })
    ).toBe(true);
    expect(
      verifyBachsWebhookSignature({
        rawBody: body,
        signatureV2: header,
        secret: "whsec_unrelated",
        nowSeconds: now,
      })
    ).toBe(false);
  });

  it("supports the legacy signature and timestamp headers", () => {
    const digest = sign(secret, now, body);

    expect(
      verifyBachsWebhookSignature({
        rawBody: body,
        signature: digest,
        timestamp: String(now),
        secret,
        nowSeconds: now,
      })
    ).toBe(true);

    expect(
      verifyBachsWebhookSignature({
        rawBody: body,
        signature: digest,
        timestamp: String(now - 10_000),
        secret,
        nowSeconds: now,
      })
    ).toBe(false);
  });
});
