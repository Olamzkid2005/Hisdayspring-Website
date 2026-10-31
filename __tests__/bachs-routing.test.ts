/**
 * Route-level tests for the Bachs checkout routes.
 *
 * Two things are load-bearing here:
 *
 * 1. Corridors are chosen server-side from the payment method, so a client
 *    cannot ask for a payment rail the church has not enabled.
 * 2. No `transfer_data` (and no `platform_fee`) is ever sent, so every
 *    donation settles into the church account. Pastoral giving is deliberately
 *    deferred until Connect is approved and must not be silently routed by
 *    anything a client sends.
 */

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: ResponseInit) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

import { POST as bachsInitialize } from "@/app/api/payments/bachs/initialize/route";
import { POST as bachsVerify } from "@/app/api/payments/bachs/verify/route";
import { resetPaymentRateLimitsForTests } from "@/lib/server/request-guards";

const ORIGIN = "https://hisdayspring.org";
let requestSequence = 0;
let lastIdempotencyKey = "";

function makeRequest(body: unknown): Request {
  const idempotencyKey = `test-key-${++requestSequence}`;
  lastIdempotencyKey = idempotencyKey;
  const bytes = new Uint8Array(Buffer.from(JSON.stringify(body)));
  let consumed = false;
  return {
    body: {
      getReader: () => ({
        read: async () => {
          if (consumed) return { done: true, value: undefined };
          consumed = true;
          return { done: false, value: bytes };
        },
        cancel: async () => undefined,
        releaseLock: () => undefined,
      }),
    },
    url: `${ORIGIN}/api/payments/bachs/initialize`,
    headers: new Headers({
      "x-forwarded-for": "198.51.100.1",
      "idempotency-key": idempotencyKey,
    }),
  } as unknown as Request;
}

function mockFetch(
  body: unknown,
  { ok = true, status = 200 }: { ok?: boolean; status?: number } = {}
) {
  const fetchMock = jest.fn().mockResolvedValue({
    ok,
    status,
    json: async () => body,
  });
  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    writable: true,
    value: fetchMock,
  });
  return fetchMock;
}

function sentPayload(fetchMock: jest.Mock): Record<string, unknown> {
  const [, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
  return JSON.parse(String(requestInit.body));
}

function sentHeaders(fetchMock: jest.Mock): Record<string, string> {
  const [, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
  return requestInit.headers as Record<string, string>;
}

function sentUrl(fetchMock: jest.Mock): string {
  return fetchMock.mock.calls[0][0] as string;
}

const successResponse = {
  checkout_id: "chk_2N3o4P5q6R7s8T9u",
  checkout_url: "https://sandbox-checkout.bachs.io/c/V8xQ2mZpLj9RfTa",
  status: "open",
  reference: "hisdayspring-tithes-abcd",
};

function donationBody(purpose: string, extra: object = {}) {
  return {
    email: "donor@example.com",
    amount: 5000,
    paymentMethod: "card-payment",
    metadata: {
      name: "Jane Donor",
      phone: "+2348000000000",
      purpose,
      type: "donation",
    },
    ...extra,
  };
}

describe("bachs initialize route", () => {
  const originalKey = process.env.BACHS_SECRET_KEY;
  const originalBaseUrl = process.env.BACHS_API_BASE_URL;

  beforeEach(() => {
    requestSequence = 0;
    resetPaymentRateLimitsForTests();
    process.env.BACHS_SECRET_KEY = "sk_sandbox_testkey";
    delete process.env.BACHS_API_BASE_URL;
  });

  afterEach(() => {
    if (originalKey === undefined) delete process.env.BACHS_SECRET_KEY;
    else process.env.BACHS_SECRET_KEY = originalKey;
    if (originalBaseUrl === undefined) delete process.env.BACHS_API_BASE_URL;
    else process.env.BACHS_API_BASE_URL = originalBaseUrl;
    jest.restoreAllMocks();
  });

  it("returns 503 when no key is configured", async () => {
    delete process.env.BACHS_SECRET_KEY;
    const fetchMock = mockFetch(successResponse);

    const response = await bachsInitialize(makeRequest(donationBody("tithes")));

    expect(response.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("prices the checkout with a decimal NGN string at the sandbox URL", async () => {
    const fetchMock = mockFetch(successResponse);

    const response = await bachsInitialize(makeRequest(donationBody("tithes")));
    const body = await response.json();
    const payload = sentPayload(fetchMock);

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(sentUrl(fetchMock)).toBe(
      "https://sandbox-api.bachs.io/v1/checkout-sessions"
    );

    expect(payload.pricing).toEqual({ currency: "NGN", amount: "5000.00" });
    expect(payload.pricing).not.toEqual({ currency: "NGN", amount: 5000 });

    expect(payload.success_url).toBe(`${ORIGIN}/giving`);
    expect(payload.cancel_url).toBe(`${ORIGIN}/giving`);
  });

  it("sends a bearer key and a stable idempotency key", async () => {
    const fetchMock = mockFetch(successResponse);

    await bachsInitialize(makeRequest(donationBody("tithes")));

    const headers = sentHeaders(fetchMock);
    expect(headers.Authorization).toBe("Bearer sk_sandbox_testkey");
    expect(headers["Idempotency-Key"]).toMatch(/^checkout_[a-f0-9]{64}$/);
  });

  it("maps the payment method to a corridor server-side", async () => {
    let fetchMock = mockFetch(successResponse);

    await bachsInitialize(
      makeRequest(donationBody("tithes", { paymentMethod: "card-payment" }))
    );
    expect(sentPayload(fetchMock).payment_method_types).toEqual(["NGN_CARD"]);

    fetchMock = mockFetch(successResponse);
    await bachsInitialize(
      makeRequest(donationBody("tithes", { paymentMethod: "bank-transfer" }))
    );
    expect(sentPayload(fetchMock).payment_method_types).toEqual([
      "NGN_BANK_TRANSFER",
    ]);
  });

  it("ignores a client-supplied payment method it does not support", async () => {
    const fetchMock = mockFetch(successResponse);

    // NGN mobile money is not a Bachs corridor, so it must be refused rather
    // than quietly downgraded to another rail.
    const response = await bachsInitialize(
      makeRequest(donationBody("tithes", { paymentMethod: "mobile-money" }))
    );

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("never routes funds away from the church account", async () => {
    for (const purpose of [
      "tithes",
      "offerings",
      "seeds-and-donations",
    ]) {
      const fetchMock = mockFetch(successResponse);
      await bachsInitialize(makeRequest(donationBody(purpose)));
      const payload = sentPayload(fetchMock);

      expect(payload.transfer_data).toBeUndefined();
      expect(payload.platform_fee).toBeUndefined();
      expect(payload.destination_amount).toBeUndefined();
    }
  });

  it("ignores client-supplied routing fields (redirect attack)", async () => {
    const fetchMock = mockFetch(successResponse);

    await bachsInitialize(
      makeRequest(
        donationBody("tithes", {
          transfer_data: { destination: "acct_attacker", amount: "5000.00" },
          platform_fee: "0.00",
          subaccount: "ACCT_attacker",
        })
      )
    );

    const payload = sentPayload(fetchMock);
    expect(payload.transfer_data).toBeUndefined();
    expect(payload.platform_fee).toBeUndefined();
  });

  it("rejects an amount below the NGN minimum before calling the gateway", async () => {
    const fetchMock = mockFetch(successResponse);

    const response = await bachsInitialize(
      makeRequest(donationBody("tithes", { amount: 99 }))
    );

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects direct online pastoral giving so the donor cannot misroute it", async () => {
    const fetchMock = mockFetch(successResponse);
    const response = await bachsInitialize(
      makeRequest(donationBody("pastoral-giving"))
    );
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("surfaces the account's real deposit limit on rejection", async () => {
    const fetchMock = mockFetch(
      {
        detail: "Deposit limit exceeded for NGN",
        error_code: "DEPOSIT_LIMIT_EXCEEDED",
        details: { max_allowed_amount: "2000000", currency: "NGN" },
      },
      { ok: false, status: 400 }
    );

    const response = await bachsInitialize(
      makeRequest(donationBody("tithes", { amount: 5_000_000 }))
    );
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body.success).toBe(false);
    // The donor is told the actual ceiling, not a generic failure.
    expect(body.message).toContain("2,000,000");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("maps the created session back to the client contract", async () => {
    mockFetch(successResponse);

    const response = await bachsInitialize(makeRequest(donationBody("tithes")));
    const body = await response.json();

    expect(body.checkoutId).toBe("chk_2N3o4P5q6R7s8T9u");
    expect(body.authorizationUrl).toBe(
      "https://sandbox-checkout.bachs.io/c/V8xQ2mZpLj9RfTa"
    );
  });
});

describe("bachs verify route", () => {
  const originalKey = process.env.BACHS_SECRET_KEY;

  beforeEach(() => {
    resetPaymentRateLimitsForTests();
    process.env.BACHS_SECRET_KEY = "sk_sandbox_testkey";
    delete process.env.BACHS_API_BASE_URL;
  });

  afterEach(() => {
    if (originalKey === undefined) delete process.env.BACHS_SECRET_KEY;
    else process.env.BACHS_SECRET_KEY = originalKey;
    if (process.env.BACHS_API_BASE_URL === undefined)
      delete process.env.BACHS_API_BASE_URL;
    jest.restoreAllMocks();
  });

  it("treats only a fully paid checkout as paid", async () => {
    const fetchMock = mockFetch({
      checkout_id: "chk_abc",
      status: "completed",
      reference: "hisdayspring-tithes-1",
      amount_paid: "5000.00",
      amount_remaining: "0.00",
      currency: "NGN",
      metadata: { type: "donation", amount: "5000.00", purpose: "tithes" },
    });

    const response = await bachsVerify(makeRequest({ checkoutId: "chk_abc" }));
    const body = await response.json();

    expect(body.success).toBe(true);
    expect(body.donation).toEqual({ amount: 5000, purpose: "tithes" });
    expect(sentUrl(fetchMock)).toBe(
      "https://sandbox-api.bachs.io/v1/checkout-sessions/chk_abc"
    );
  });

  it("does not treat checkout.completed without a collected payment as paid", async () => {
    mockFetch({
      checkout_id: "chk_unpaid",
      status: "completed",
      metadata: { type: "book-order", items: "made-to-be-whole:1", fulfillment: "pickup" },
    });
    const response = await bachsVerify(makeRequest({ checkoutId: "chk_unpaid" }));
    expect((await response.json()).success).toBe(false);
  });

  it("does not treat an open or expired checkout as paid", async () => {
    for (const status of ["open", "expired", "cancelled"]) {
      mockFetch({
        checkout_id: "chk_abc",
        status,
        amount_paid: "5000.00",
        amount_remaining: "0.00",
        currency: "NGN",
        metadata: { type: "donation", amount: "5000.00" },
      });
      const response = await bachsVerify(makeRequest({ checkoutId: "chk_abc" }));
      const body = await response.json();

      expect(body.success).toBe(false);
      expect(body.status).toBe(status);
    }
  });

  it("rejects a malformed checkout id before calling the gateway", async () => {
    const fetchMock = mockFetch({ checkout_id: "chk_abc", status: "completed" });

    const response = await bachsVerify(makeRequest({ checkoutId: "chk/../x" }));

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
