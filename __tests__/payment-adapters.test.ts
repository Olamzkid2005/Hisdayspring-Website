import { initializePayment, verifyPayment } from "@/lib/api/paystack";
import {
  initializeFlutterwavePayment,
  verifyFlutterwavePayment,
} from "@/lib/api/flutterwave";

function mockFetch(
  ...responses: Array<{ ok: boolean; status: number; body: unknown }>
) {
  const fetchMock = jest.fn();
  responses.forEach(({ ok, status, body }) => {
    fetchMock.mockResolvedValueOnce({
      ok,
      status,
      json: async () => body,
    });
  });
  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    writable: true,
    value: fetchMock,
  });
  return fetchMock;
}

describe("browser payment adapters", () => {
  afterEach(() => jest.restoreAllMocks());

  it("returns a successful Paystack initialization response", async () => {
    const fetchMock = mockFetch({
      ok: true,
      status: 200,
      body: {
        success: true,
        reference: "ps_ref",
        authorizationUrl: "https://paystack.test/checkout",
      },
    });

    await expect(
      initializePayment("donor@example.com", 100_000, { purpose: "tithes" })
    ).resolves.toMatchObject({
      success: true,
      authorizationUrl: "https://paystack.test/checkout",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/payments/paystack/initialize",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("normalizes provider failures and verification failures", async () => {
    mockFetch(
      { ok: false, status: 502, body: { message: "Provider unavailable" } },
      { ok: false, status: 404, body: { message: "Not found" } }
    );

    await expect(initializePayment("donor@example.com", 100_000)).resolves.toEqual({
      success: false,
      message: "Provider unavailable",
    });
    await expect(verifyPayment("missing_ref")).resolves.toBe(false);
  });

  it("supports successful Flutterwave initialization and verification", async () => {
    mockFetch(
      {
        ok: true,
        status: 200,
        body: {
          success: true,
          reference: "flw_ref",
          authorizationUrl: "https://flutterwave.test/checkout",
        },
      },
      { ok: true, status: 200, body: { success: true } }
    );

    await expect(
      initializeFlutterwavePayment(
        "donor@example.com",
        1000,
        "Jane Donor",
        "+2348000000000"
      )
    ).resolves.toMatchObject({ success: true });
    await expect(verifyFlutterwavePayment("12345")).resolves.toBe(true);
  });

  it("sends purpose metadata for pastoral giving so the server can route it", async () => {
    const fetchMock = mockFetch({
      ok: true,
      status: 200,
      body: { success: true, authorizationUrl: "https://paystack.test/checkout" },
    });

    await initializePayment("donor@example.com", 100_000, {
      purpose: "pastoral-giving",
      type: "donation",
    });

    const [, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
    const payload = JSON.parse(String(requestInit.body));
    expect(payload.metadata.purpose).toBe("pastoral-giving");
    // Routing is resolved server-side; the client never sends a subaccount.
    expect(payload.subaccount).toBeUndefined();
  });

  it("sends purpose metadata to Flutterwave for pastoral giving", async () => {
    const fetchMock = mockFetch({
      ok: true,
      status: 200,
      body: { success: true, authorizationUrl: "https://flutterwave.test/checkout" },
    });

    await initializeFlutterwavePayment(
      "donor@example.com",
      1000,
      "Jane Donor",
      "+2348000000000",
      { purpose: "pastoral-giving", type: "donation" }
    );

    const [, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
    const payload = JSON.parse(String(requestInit.body));
    expect(payload.metadata.purpose).toBe("pastoral-giving");
    expect(payload.subaccountId).toBeUndefined();
  });
});
