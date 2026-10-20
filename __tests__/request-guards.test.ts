jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: ResponseInit) => ({
      status: init?.status ?? 200,
      headers: init?.headers,
      json: async () => body,
    }),
  },
}));

import { GET as downloadBookOrder } from "@/app/api/payments/bachs/book-order/download/route";
import { isBachsConfigured, getBachsCheckoutSession } from "@/lib/server/bachs";
import {
  checkPaymentRateLimit,
  deriveCheckoutIdentity,
  readJsonBody,
  resetPaymentRateLimitsForTests,
} from "@/lib/server/request-guards";

jest.mock("@/lib/server/bachs", () => ({
  isBachsConfigured: jest.fn(),
  getBachsCheckoutSession: jest.fn(),
}));

jest.mock("@/data/books", () => {
  const actual = jest.requireActual<typeof import("@/data/books")>("@/data/books");
  return { ...actual, PDF_DELIVERY_ENABLED: true };
});

const mockedIsBachsConfigured = jest.mocked(isBachsConfigured);
const mockedGetBachsCheckoutSession = jest.mocked(getBachsCheckoutSession);

function mockRequest(
  url: string,
  chunks: Uint8Array[] = [],
  headers: Record<string, string> = {}
): Request {
  let nextChunk = 0;
  return {
    url,
    headers: new Headers(headers),
    body:
      chunks.length === 0
        ? null
        : {
            getReader: () => ({
              read: async () =>
                nextChunk < chunks.length
                  ? { done: false, value: chunks[nextChunk++] }
                  : { done: true, value: undefined },
              cancel: async () => undefined,
              releaseLock: () => undefined,
            }),
          },
  } as unknown as Request;
}

function requestWithBody(body: string, maxLength = true): Request {
  const bytes = new Uint8Array(Buffer.from(body));
  return mockRequest(
    "https://hisdayspring.org/api/payments",
    [bytes],
    maxLength ? { "content-length": String(bytes.byteLength) } : {}
  );
}

describe("payment request guards", () => {
  beforeEach(() => {
    resetPaymentRateLimitsForTests();
    mockedIsBachsConfigured.mockReturnValue(true);
    mockedGetBachsCheckoutSession.mockReset();
    jest.restoreAllMocks();
  });

  it("parses bounded JSON and rejects oversized requests from their length", async () => {
    expect(await readJsonBody(requestWithBody('{"amount":500}'), 128)).toEqual({
      ok: true,
      value: { amount: 500 },
    });

    expect(await readJsonBody(requestWithBody('{"amount":500}'), 4)).toEqual({
      ok: false,
      reason: "too-large",
    });
  });

  it("rejects malformed JSON and streams that cross the byte limit", async () => {
    expect(await readJsonBody(requestWithBody("{"), 128)).toEqual({
      ok: false,
      reason: "invalid",
    });

    const streamedRequest = mockRequest(
      "https://hisdayspring.org/api/payments",
      [new Uint8Array(5), new Uint8Array(5)]
    );
    expect(await readJsonBody(streamedRequest, 8)).toEqual({
      ok: false,
      reason: "too-large",
    });
  });

  it("limits requests by trusted edge IP without trusting forwarded headers", () => {
    const request = mockRequest("https://hisdayspring.org/api/payments", [], {
      "cf-connecting-ip": "198.51.100.42",
      "x-forwarded-for": "203.0.113.1",
    });
    expect(checkPaymentRateLimit(request, "checkout", 2, 60_000, 1_000)).toEqual({
      allowed: true,
    });
    expect(checkPaymentRateLimit(request, "checkout", 2, 60_000, 2_000)).toEqual({
      allowed: true,
    });
    expect(checkPaymentRateLimit(request, "checkout", 2, 60_000, 3_000)).toEqual({
      allowed: false,
      retryAfterSeconds: 58,
    });
  });

  it("fails open without a trusted edge IP and expires old buckets", () => {
    const untrustedOnly = mockRequest("https://hisdayspring.org/api/payments", [], {
      "x-forwarded-for": "198.51.100.42",
    });
    for (let index = 0; index < 3; index++) {
      expect(checkPaymentRateLimit(untrustedOnly, "checkout", 1, 100, index)).toEqual({
        allowed: true,
      });
    }

    const trusted = mockRequest("https://hisdayspring.org/api/payments", [], {
      "cf-connecting-ip": "198.51.100.42",
    });
    expect(checkPaymentRateLimit(trusted, "checkout", 1, 100, 0)).toEqual({
      allowed: true,
    });
    expect(checkPaymentRateLimit(trusted, "checkout", 1, 100, 101)).toEqual({
      allowed: true,
    });
  });

  it("refuses to deliver a completed book order with a mismatched paid amount", async () => {
    const order = await import("@/lib/server/book-orders").then(({ priceBookOrder }) =>
      priceBookOrder([{ bookId: "made-to-be-whole", quantity: 1 }], "pdf")
    );
    expect(order).not.toBeNull();
    mockedGetBachsCheckoutSession.mockResolvedValue({
      ok: true,
      data: {
        checkoutId: "chk_pdf",
        checkoutUrl: "",
        status: "completed",
        reference: "hisdayspring-book-order-test",
        amountPaid: "1.00",
        amountRemaining: "0.00",
        currency: "NGN",
        metadata: {
          type: "book-order",
          items: order!.itemsToken,
          fulfillment: "pdf",
          order_snapshot: order!.orderSnapshot,
        },
      },
    });
    const fetchMock = jest.fn();
    Object.defineProperty(globalThis, "fetch", {
      configurable: true,
      writable: true,
      value: fetchMock,
    });

    const response = await downloadBookOrder(
      mockRequest(
        "https://hisdayspring.org/api/payments/bachs/book-order/download?checkout_id=chk_pdf&book=made-to-be-whole"
      )
    );
    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({
      message: "Payment amount does not match this order.",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("derives stable provider identities for the same client retry", () => {
    const payload = { email: "donor@example.com", amount: 5000 };
    const first = deriveCheckoutIdentity("donation", "tithes", "retry-key-1", payload);
    const retry = deriveCheckoutIdentity("donation", "tithes", "retry-key-1", payload);
    const changed = deriveCheckoutIdentity("donation", "tithes", "retry-key-2", payload);

    expect(first).toEqual(retry);
    expect(first.idempotencyKey).toMatch(/^checkout_[a-f0-9]{64}$/);
    expect(first.reference).toMatch(/^hisdayspring-tithes-[a-f0-9]{48}$/);
    expect(changed.idempotencyKey).not.toBe(first.idempotencyKey);
  });
});
