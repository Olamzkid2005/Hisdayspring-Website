import { initializeDonation, verifyDonation } from "@/lib/api/bachs";

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

function sentPayload(fetchMock: jest.Mock): Record<string, unknown> {
  const [, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
  return JSON.parse(String(requestInit.body));
}

describe("bachs browser adapter", () => {
  afterEach(() => jest.restoreAllMocks());

  it("starts a checkout through the server route", async () => {
    const fetchMock = mockFetch({
      ok: true,
      status: 200,
      body: {
        success: true,
        checkoutId: "chk_test123",
        authorizationUrl: "https://checkout.bachs.io/c/test",
        reference: "hisdayspring-tithes-1",
      },
    });

    await expect(
      initializeDonation({
        email: "donor@example.com",
        amount: 5000,
        name: "Jane Donor",
        phone: "+2348000000000",
        purpose: "tithes",
        paymentMethod: "card-payment",
      })
    ).resolves.toMatchObject({
      success: true,
      checkoutId: "chk_test123",
      authorizationUrl: "https://checkout.bachs.io/c/test",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/payments/bachs/initialize",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("sends the amount in Naira, not minor units", async () => {
    const fetchMock = mockFetch({
      ok: true,
      status: 200,
      body: { success: true, authorizationUrl: "https://checkout.bachs.io/c/x" },
    });

    await initializeDonation({
      email: "donor@example.com",
      amount: 5000,
      name: "Jane Donor",
      phone: "+2348000000000",
      purpose: "offerings",
      paymentMethod: "card-payment",
    });

    const payload = sentPayload(fetchMock);
    expect(payload.amount).toBe(5000);
    expect(payload.amount).not.toBe(500000);
  });

  it("sends the purpose and payment method but no routing fields", async () => {
    const fetchMock = mockFetch({
      ok: true,
      status: 200,
      body: { success: true, authorizationUrl: "https://checkout.bachs.io/c/x" },
    });

    await initializeDonation({
      email: "donor@example.com",
      amount: 5000,
      name: "Jane Donor",
      phone: "+2348000000000",
      purpose: "pastoral-giving",
      paymentMethod: "bank-transfer",
    });

    const payload = sentPayload(fetchMock);
    const metadata = payload.metadata as Record<string, unknown>;

    expect(metadata.purpose).toBe("pastoral-giving");
    expect(metadata.type).toBe("donation");
    expect(payload.paymentMethod).toBe("bank-transfer");

    // Settlement is resolved server-side; the client never names a destination.
    expect(payload.transfer_data).toBeUndefined();
    expect(payload.subaccount).toBeUndefined();
    expect(payload.platform_fee).toBeUndefined();
  });

  it("normalizes server-side failures", async () => {
    mockFetch(
      { ok: false, status: 502, body: { message: "Provider unavailable" } },
      { ok: false, status: 400, body: { message: "A valid checkout ID is required" } }
    );

    await expect(
      initializeDonation({
        email: "donor@example.com",
        amount: 5000,
        name: "Jane Donor",
        phone: "+2348000000000",
        purpose: "offerings",
        paymentMethod: "card-payment",
      })
    ).resolves.toEqual({ success: false, message: "Provider unavailable" });

    await expect(verifyDonation("bad id")).resolves.toMatchObject({
      success: false,
      pending: false,
    });
  });

  it("verifies a checkout by id", async () => {
    const fetchMock = mockFetch({
      ok: true,
      status: 200,
      body: { success: true, status: "completed" },
    });

    await expect(verifyDonation("chk_test123")).resolves.toMatchObject({
      success: true,
      pending: false,
      status: "completed",
    });

    const payload = sentPayload(fetchMock);
    expect(payload.checkoutId).toBe("chk_test123");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/payments/bachs/verify",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("reports a network failure instead of throwing", async () => {
    const fetchMock = jest.fn().mockRejectedValue(new Error("offline"));
    Object.defineProperty(globalThis, "fetch", {
      configurable: true,
      writable: true,
      value: fetchMock,
    });
    jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(verifyDonation("chk_test123")).resolves.toMatchObject({
      success: false,
      pending: false,
    });
    await expect(
      initializeDonation({
        email: "donor@example.com",
        amount: 5000,
        name: "Jane Donor",
        phone: "+2348000000000",
        purpose: "offerings",
        paymentMethod: "card-payment",
      })
    ).resolves.toEqual({
      success: false,
      message: "Unable to connect to the payment service",
    });
  });

  it("retries while the checkout is still open and reports pending", async () => {
    // The redirect race: Bachs bounces the buyer back before the session
    // settles, so the first verify sees `open` and a later one sees success.
    const fetchMock = mockFetch(
      { ok: true, status: 200, body: { success: false, status: "open" } },
      { ok: true, status: 200, body: { success: false, status: "open" } },
      { ok: true, status: 200, body: { success: true, status: "completed" } }
    );

    await expect(
      verifyDonation("chk_race", { delayMs: 1 })
    ).resolves.toMatchObject({ success: true, status: "completed" });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("reports pending without retrying past the cap", async () => {
    const fetchMock = mockFetch(
      ...Array.from({ length: 5 }, () => ({
        ok: true,
        status: 200,
        body: { success: false, status: "open" },
      }))
    );

    // Default cap: 4 retries + the first attempt = 5 calls.
    await expect(
      verifyDonation("chk_stuck", { delayMs: 1 })
    ).resolves.toMatchObject({
      success: false,
      pending: true,
      status: "open",
    });
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });

  it("does not retry terminal states", async () => {
    const fetchMock = mockFetch({
      ok: true,
      status: 200,
      body: { success: false, status: "expired" },
    });

    await expect(verifyDonation("chk_dead")).resolves.toMatchObject({
      success: false,
      pending: false,
      status: "expired",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
