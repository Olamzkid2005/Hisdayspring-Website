/**
 * Tests for the book-order pipeline.
 *
 * The two load-bearing invariants:
 *
 * 1. Pricing happens server-side from `data/books.ts`. A tampered client can
 *    change quantities and titles, but never the total — buying a ₦3,000 book
 *    for ₦50 must be impossible.
 * 2. A paid order is reconstructable from the checkout alone (metadata), so
 *    the verify and download routes can confirm it with no database.
 */

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: ResponseInit) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

import { POST as bookOrderInitialize } from "@/app/api/payments/bachs/book-order/initialize/route";
import {
  priceBookOrder,
  decodeBookOrder,
} from "@/lib/server/book-orders";
import { books } from "@/data/books";

const ORIGIN = "https://hisdayspring.org";

function makeRequest(body: unknown): Request {
  return {
    json: async () => body,
    url: `${ORIGIN}/api/payments/bachs/book-order/initialize`,
    headers: new Headers(),
  } as unknown as Request;
}

function mockFetch(body: unknown, ok = true, status = 200) {
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

const madeToBeWhole = books.find((book) => book.id === "made-to-be-whole")!;

function orderBody(extra: object = {}) {
  return {
    name: "Jane Buyer",
    email: "buyer@example.com",
    phone: "+2348000000000",
    paymentMethod: "card-payment",
    fulfillment: "pickup",
    items: [{ bookId: "made-to-be-whole", quantity: 2 }],
    ...extra,
  };
}

describe("priceBookOrder", () => {
  it("prices from the catalog, not from anything the client sent", () => {
    const order = priceBookOrder(
      [{ bookId: "made-to-be-whole", quantity: 2 }],
      "pickup"
    );

    expect(order).not.toBeNull();
    expect(order!.total).toBe(madeToBeWhole.price * 2);
    expect(order!.itemsToken).toBe("made-to-be-whole:2");
  });

  it("merges duplicate titles and clamps quantities into bounds", () => {
    const order = priceBookOrder(
      [
        { bookId: "made-to-be-whole", quantity: 1 },
        { bookId: "made-to-be-whole", quantity: 50 },
      ],
      "pdf"
    );

    expect(order).not.toBeNull();
    expect(order!.items).toEqual([{ bookId: "made-to-be-whole", quantity: 20 }]);
  });

  it("rejects unknown books, bad fulfillment, and empty carts", () => {
    expect(priceBookOrder([{ bookId: "ghost-book", quantity: 1 }], "pickup")).toBeNull();
    expect(priceBookOrder([{ bookId: "made-to-be-whole", quantity: 1 }], "drone-drop")).toBeNull();
    expect(priceBookOrder([], "pickup")).toBeNull();
    expect(priceBookOrder([{ bookId: "made-to-be-whole", quantity: 0 }], "pickup")).toBeNull();
    expect(priceBookOrder("nonsense", "pickup")).toBeNull();
  });

  it("rejects more distinct titles than the metadata budget allows", () => {
    const tooMany = books.slice(0, 11).map((book) => ({
      bookId: book.id,
      quantity: 1,
    }));

    expect(priceBookOrder(tooMany, "pickup")).toBeNull();
  });
});

describe("decodeBookOrder", () => {
  it("round-trips an order through the token", () => {
    const order = priceBookOrder(
      [{ bookId: "made-to-be-whole", quantity: 3 }],
      "pdf"
    );
    expect(order).not.toBeNull();

    const decoded = decodeBookOrder(order!.itemsToken, "pdf");
    expect(decoded).not.toBeNull();
    expect(decoded!.total).toBe(madeToBeWhole.price * 3);
    expect(decoded!.lines[0].title).toBe(madeToBeWhole.title);
    expect(decoded!.catalogMatch).toBe(true);
  });

  it("flags orders that no longer match the catalog instead of failing", () => {
    const decoded = decodeBookOrder("vanished-book:2", "pickup");
    expect(decoded).not.toBeNull();
    expect(decoded!.catalogMatch).toBe(false);
    expect(decoded!.lines[0].title).toBe("vanished-book");
  });

  it("rejects malformed tokens outright", () => {
    expect(decodeBookOrder("made-to-be-whole", "pickup")).toBeNull();
    expect(decodeBookOrder("made-to-be-whole:0", "pickup")).toBeNull();
    expect(decodeBookOrder("made-to-be-whole:x", "pickup")).toBeNull();
    expect(decodeBookOrder("", "pickup")).toBeNull();
    expect(decodeBookOrder("made-to-be-whole:2", "unexpected")).toBeNull();
  });
});

describe("book-order initialize route", () => {
  const originalKey = process.env.BACHS_SECRET_KEY;
  const originalBaseUrl = process.env.BACHS_API_BASE_URL;

  beforeEach(() => {
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

  it("returns 503 when Bachs is not configured", async () => {
    delete process.env.BACHS_SECRET_KEY;
    mockFetch({});

    const response = await bookOrderInitialize(makeRequest(orderBody()));
    expect(response.status).toBe(503);
  });

  it("returns 400 for invalid buyer details or payment method", async () => {
    mockFetch({});

    expect(
      (await bookOrderInitialize(makeRequest(orderBody({ email: "nope" }))))
        .status
    ).toBe(400);
    expect(
      (await bookOrderInitialize(makeRequest(orderBody({ name: "" })))).status
    ).toBe(400);
    expect(
      (
        await bookOrderInitialize(
          makeRequest(orderBody({ paymentMethod: "mobile-money" }))
        )
      ).status
    ).toBe(400);
  });

  it("returns 400 when the cart is invalid", async () => {
    mockFetch({});

    const response = await bookOrderInitialize(
      makeRequest(orderBody({ items: [{ bookId: "ghost", quantity: 1 }] }))
    );
    expect(response.status).toBe(400);
  });

  it("prices server-side and records the order in metadata", async () => {
    const fetchMock = mockFetch({
      checkout_id: "chk_order123",
      checkout_url: "https://checkout.bachs.io/c/abc",
      status: "open",
      reference: "hisdayspring-book-x",
    });

    const response = await bookOrderInitialize(makeRequest(orderBody()));
    const payload = sentPayload(fetchMock);

    expect(response.status).toBe(200);
    // ₦2,000 × 2 — the catalog price, not anything a client claimed.
    expect(payload.pricing).toEqual({
      currency: "NGN",
      amount: `${(madeToBeWhole.price * 2).toFixed(2)}`,
    });
    expect(payload.metadata).toMatchObject({
      type: "book-order",
      items: "made-to-be-whole:2",
      fulfillment: "pickup",
    });
    // The success URL lands the buyer back on /books.
    expect(payload.success_url).toBe(`${ORIGIN}/books`);
  });
});
