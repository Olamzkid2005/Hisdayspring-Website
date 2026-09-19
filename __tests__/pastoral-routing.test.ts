/**
 * Route-level tests for pastoral-giving settlement routing.
 *
 * The subaccount MUST be resolved server-side from the validated purpose —
 * never from client input — so a malicious donor cannot redirect tithe money
 * into their own Paystack/Flutterwave subaccount.
 */

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: ResponseInit) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

import { POST as paystackInitialize } from "@/app/api/payments/paystack/initialize/route";
import { POST as flutterwaveInitialize } from "@/app/api/payments/flutterwave/initialize/route";

function makeRequest(body: unknown): Request {
  return {
    json: async () => body,
    url: "http://localhost:3000/api/payments/test",
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

describe("pastoral-giving settlement routing", () => {
  const originalPaystackKey = process.env.PAYSTACK_SECRET_KEY;
  const originalFlutterwaveKey = process.env.FLUTTERWAVE_SECRET_KEY;
  const originalPaystackSubaccount = process.env.PASTORAL_PAYSTACK_SUBACCOUNT;
  const originalFlutterwaveSubaccount =
    process.env.PASTORAL_FLUTTERWAVE_SUBACCOUNT_ID;

  beforeEach(() => {
    process.env.PAYSTACK_SECRET_KEY = "sk_test_key";
    process.env.FLUTTERWAVE_SECRET_KEY = "flw_test_key";
    delete process.env.PASTORAL_PAYSTACK_SUBACCOUNT;
    delete process.env.PASTORAL_FLUTTERWAVE_SUBACCOUNT_ID;
  });

  afterEach(() => {
    if (originalPaystackKey === undefined)
      delete process.env.PAYSTACK_SECRET_KEY;
    else process.env.PAYSTACK_SECRET_KEY = originalPaystackKey;
    if (originalFlutterwaveKey === undefined)
      delete process.env.FLUTTERWAVE_SECRET_KEY;
    else process.env.FLUTTERWAVE_SECRET_KEY = originalFlutterwaveKey;
    if (originalPaystackSubaccount === undefined)
      delete process.env.PASTORAL_PAYSTACK_SUBACCOUNT;
    else process.env.PASTORAL_PAYSTACK_SUBACCOUNT = originalPaystackSubaccount;
    if (originalFlutterwaveSubaccount === undefined)
      delete process.env.PASTORAL_FLUTTERWAVE_SUBACCOUNT_ID;
    else
      process.env.PASTORAL_FLUTTERWAVE_SUBACCOUNT_ID =
        originalFlutterwaveSubaccount;
    jest.restoreAllMocks();
  });

  describe("Paystack initialize route", () => {
    const paystackBody = (purpose: string, extra: object = {}) => ({
      email: "donor@example.com",
      amount: 5000,
      metadata: {
        name: "Jane Donor",
        phone: "+2348000000000",
        purpose,
        type: "donation",
      },
      ...extra,
    });

    it("settles pastoral-giving into the pastor's subaccount", async () => {
      process.env.PASTORAL_PAYSTACK_SUBACCOUNT = "ACCT_pastor123";
      const fetchMock = mockFetch({
        status: true,
        message: "Authorization URL created",
        data: {
          authorization_url: "https://paystack.test/checkout",
          reference: "ref_123",
        },
      });

      const response = await paystackInitialize(
        makeRequest(paystackBody("pastoral-giving"))
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(sentPayload(fetchMock).subaccount).toBe("ACCT_pastor123");
    });

    it("settles other purposes into the church account (no subaccount)", async () => {
      process.env.PASTORAL_PAYSTACK_SUBACCOUNT = "ACCT_pastor123";
      const fetchMock = mockFetch({
        status: true,
        data: {
          authorization_url: "https://paystack.test/checkout",
          reference: "ref_123",
        },
      });

      await paystackInitialize(makeRequest(paystackBody("tithes")));

      expect(sentPayload(fetchMock).subaccount).toBeUndefined();
    });

    it("ignores client-supplied subaccount codes (redirect attack)", async () => {
      process.env.PASTORAL_PAYSTACK_SUBACCOUNT = "ACCT_pastor123";
      const fetchMock = mockFetch({
        status: true,
        data: {
          authorization_url: "https://paystack.test/checkout",
          reference: "ref_123",
        },
      });

      // Attacker posts directly with their own subaccount for a tithe.
      await paystackInitialize(
        makeRequest(paystackBody("tithes", { subaccount: "ACCT_attacker" }))
      );

      expect(sentPayload(fetchMock).subaccount).toBeUndefined();
    });

    it("falls back to the church account when no subaccount is configured", async () => {
      const fetchMock = mockFetch({
        status: true,
        data: {
          authorization_url: "https://paystack.test/checkout",
          reference: "ref_123",
        },
      });

      await paystackInitialize(makeRequest(paystackBody("pastoral-giving")));

      expect(sentPayload(fetchMock).subaccount).toBeUndefined();
    });

    it("ignores malformed configured subaccount codes", async () => {
      process.env.PASTORAL_PAYSTACK_SUBACCOUNT = "not a valid code!";
      const fetchMock = mockFetch({
        status: true,
        data: {
          authorization_url: "https://paystack.test/checkout",
          reference: "ref_123",
        },
      });

      await paystackInitialize(makeRequest(paystackBody("pastoral-giving")));

      expect(sentPayload(fetchMock).subaccount).toBeUndefined();
    });
  });

  describe("Flutterwave initialize route", () => {
    const flutterwaveBody = (purpose: string, extra: object = {}) => ({
      email: "donor@example.com",
      amount: 5000,
      name: "Jane Donor",
      phone: "+2348000000000",
      metadata: {
        name: "Jane Donor",
        phone: "+2348000000000",
        purpose,
        type: "donation",
      },
      ...extra,
    });

    it("settles pastoral-giving into the pastor's subaccount", async () => {
      process.env.PASTORAL_FLUTTERWAVE_SUBACCOUNT_ID = "RS_pastor456";
      const fetchMock = mockFetch({
        status: "success",
        message: "Hosted Link",
        data: {
          link: "https://flutterwave.test/checkout",
          tx_ref: "hisdayspring-abc",
        },
      });

      const response = await flutterwaveInitialize(
        makeRequest(flutterwaveBody("pastoral-giving"))
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(sentPayload(fetchMock).subaccounts).toEqual([
        { id: "RS_pastor456" },
      ]);
    });

    it("settles other purposes into the church account (no subaccounts)", async () => {
      process.env.PASTORAL_FLUTTERWAVE_SUBACCOUNT_ID = "RS_pastor456";
      const fetchMock = mockFetch({
        status: "success",
        data: {
          link: "https://flutterwave.test/checkout",
          tx_ref: "hisdayspring-abc",
        },
      });

      await flutterwaveInitialize(makeRequest(flutterwaveBody("offerings")));

      expect(sentPayload(fetchMock).subaccounts).toBeUndefined();
    });

    it("ignores client-supplied subaccount IDs (redirect attack)", async () => {
      process.env.PASTORAL_FLUTTERWAVE_SUBACCOUNT_ID = "RS_pastor456";
      const fetchMock = mockFetch({
        status: "success",
        data: {
          link: "https://flutterwave.test/checkout",
          tx_ref: "hisdayspring-abc",
        },
      });

      await flutterwaveInitialize(
        makeRequest(flutterwaveBody("offerings", { subaccountId: "RS_attacker" }))
      );

      expect(sentPayload(fetchMock).subaccounts).toBeUndefined();
    });

    it("falls back to the church account when no subaccount is configured", async () => {
      const fetchMock = mockFetch({
        status: "success",
        data: {
          link: "https://flutterwave.test/checkout",
          tx_ref: "hisdayspring-abc",
        },
      });

      await flutterwaveInitialize(
        makeRequest(flutterwaveBody("pastoral-giving"))
      );

      expect(sentPayload(fetchMock).subaccounts).toBeUndefined();
    });
  });
});
