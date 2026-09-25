/**
 * Behavioural tests for the /giving checkout flow.
 *
 * These render the real page component, so they catch runtime problems that
 * typechecking cannot: the wrong endpoint, a malformed payload, an amount sent
 * in the wrong unit, and the return-from-checkout path where a hand-edited
 * `?checkout_id=` must never produce a thank-you.
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GivingPage from "@/app/giving/page";
import { bankAccounts, pastoralGivingAccount } from "@/data/donations";

// Every test here renders the whole giving page in jsdom and several of them
// wait on a fetch round trip, so jest's 5s default is tight enough to fail on a
// loaded machine even though nothing is wrong with the page.
jest.setTimeout(15000);

function mockFetch(
  ...responses: Array<{ ok: boolean; status: number; body: unknown }>
) {
  const fetchMock = jest.fn();
  responses.forEach(({ ok, status, body }) => {
    fetchMock.mockResolvedValueOnce({ ok, status, json: async () => body });
  });
  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    writable: true,
    value: fetchMock,
  });
  return fetchMock;
}

/**
 * jsdom's Location is fully read-only (assign is writable:false,
 * configurable:false), so a redirect cannot be stubbed. Reaching a real
 * navigation is itself the signal we want, and jsdom reports it through
 * console.error.
 */
function spyOnNavigation() {
  const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
  return () =>
    errorSpy.mock.calls.some((call) =>
      String(call[0]).includes("Not implemented: navigation")
    );
}

function setUrl(search = "") {
  window.history.replaceState({}, "", `/giving${search}`);
}

function fillDonorDetails() {
  fireEvent.change(screen.getByLabelText(/Full Name/i), {
    target: { value: "Jane Donor" },
  });
  fireEvent.change(screen.getByLabelText(/Email Address/i), {
    target: { value: "donor@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/Phone Number/i), {
    target: { value: "+2348000000000" },
  });
}

function chooseGift() {
  fireEvent.click(screen.getByRole("button", { name: /5,000/ }));
  fireEvent.click(screen.getByRole("button", { name: /Tithes/ }));
}

describe("/giving checkout flow", () => {
  beforeEach(() => setUrl(""));
  afterEach(() => jest.restoreAllMocks());

  it("posts the donation to the Bachs route and sends the donor to checkout", async () => {
    const fetchMock = mockFetch({
      ok: true,
      status: 200,
      body: {
        success: true,
        checkoutId: "chk_123",
        authorizationUrl: "https://checkout.bachs.io/c/x",
      },
    });
    const navigated = spyOnNavigation();

    render(<GivingPage />);
    chooseGift();
    fillDonorDetails();
    fireEvent.click(screen.getByRole("button", { name: /Donate ₦5,000/ }));

    await waitFor(() => expect(navigated()).toBe(true), { timeout: 3000 });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const payload = JSON.parse(String(init.body));

    expect(url).toBe("/api/payments/bachs/initialize");
    // Naira, not minor units — the donor must not be charged 100x.
    expect(payload.amount).toBe(5000);
    expect(payload.paymentMethod).toBe("card-payment");
    expect(payload.metadata).toMatchObject({
      name: "Jane Donor",
      purpose: "tithes",
      type: "donation",
    });
  });

  it("asks for a bank-transfer corridor when that method is chosen", async () => {
    const fetchMock = mockFetch({
      ok: true,
      status: 200,
      body: { success: true, authorizationUrl: "https://checkout.bachs.io/c/y" },
    });
    spyOnNavigation();

    render(<GivingPage />);
    chooseGift();
    fireEvent.click(
      screen.getByRole("button", { name: /Transfer securely via Bachs/ })
    );
    fillDonorDetails();
    fireEvent.click(screen.getByRole("button", { name: /Donate ₦5,000/ }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(String(init.body)).paymentMethod).toBe("bank-transfer");
  });

  it("blocks submission and never calls the gateway when the form is empty", async () => {
    const fetchMock = mockFetch();
    spyOnNavigation();

    render(<GivingPage />);
    fireEvent.click(screen.getByRole("button", { name: /Donate ₦0/ }));

    await waitFor(() =>
      expect(
        screen.getByText(/Please select or enter an amount/i)
      ).toBeInTheDocument()
    );
    expect(
      screen.getByText(/Please select a donation purpose/i)
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an amount below the gateway's NGN floor before calling out", async () => {
    const fetchMock = mockFetch();
    spyOnNavigation();

    render(<GivingPage />);
    fireEvent.click(screen.getByRole("button", { name: /Tithes/ }));
    fireEvent.change(screen.getByPlaceholderText(/Enter custom amount/i), {
      target: { value: "50" },
    });
    fillDonorDetails();
    fireEvent.click(screen.getByRole("button", { name: /Donate ₦50/ }));

    await waitFor(() =>
      expect(
        screen.getByText(/The minimum donation is ₦100/i)
      ).toBeInTheDocument()
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("surfaces a configuration error instead of failing silently", async () => {
    mockFetch({
      ok: false,
      status: 503,
      body: { success: false, message: "Payment system is not configured" },
    });
    const navigated = spyOnNavigation();

    render(<GivingPage />);
    chooseGift();
    fillDonorDetails();
    fireEvent.click(screen.getByRole("button", { name: /Donate ₦5,000/ }));

    await waitFor(() =>
      expect(
        screen.getByText(/Payment system is not configured/i)
      ).toBeInTheDocument()
    );
    // A failed start must not bounce the donor to a checkout.
    expect(navigated()).toBe(false);
  });

  it("confirms a returned checkout server-side and then thanks the donor", async () => {
    const fetchMock = mockFetch({
      ok: true,
      status: 200,
      body: { success: true, status: "completed", checkoutId: "chk_abc" },
    });
    const navigated = spyOnNavigation();

    // The return path reads the query string on mount.
    setUrl("?checkout_id=chk_abc");
    const replaceState = jest.spyOn(window.history, "replaceState");

    render(<GivingPage />);

    await waitFor(() =>
      expect(screen.getByText(/Thank you for your gift/i)).toBeInTheDocument()
    );

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/payments/bachs/verify");
    expect(JSON.parse(String(init.body)).checkoutId).toBe("chk_abc");

    // The id is echoed back so the donor has a reference to quote.
    expect(screen.getByText("chk_abc")).toBeInTheDocument();
    // The parameter is stripped so a refresh cannot replay the confirmation.
    expect(replaceState).toHaveBeenCalled();
    // Confirming a payment must not start another one.
    expect(navigated()).toBe(false);
  });

  it("refuses to thank the donor for a checkout that did not complete", async () => {
    const fetchMock = mockFetch({
      ok: true,
      status: 200,
      // A terminal failure — no amount of retrying can complete it, so the
      // page must give up after one verify.
      body: { success: false, status: "cancelled" },
    });

    setUrl("?checkout_id=chk_fake");
    render(<GivingPage />);

    await waitFor(() =>
      expect(
        screen.getByText(/could not confirm this payment/i)
      ).toBeInTheDocument()
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByText(/Thank you for your gift/i)
    ).not.toBeInTheDocument();
  });
});

describe("/giving pastor & ministerial giving", () => {
  beforeEach(() => setUrl(""));
  afterEach(() => jest.restoreAllMocks());

  function mockClipboard() {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    return writeText;
  }

  function choosePastoralGiving() {
    fireEvent.click(
      screen.getByRole("button", { name: /Pastor & Ministerial Giving/ })
    );
  }

  it("shows the pastor's own account and no online checkout", () => {
    const fetchMock = mockFetch();

    render(<GivingPage />);
    choosePastoralGiving();

    expect(
      screen.getByText(pastoralGivingAccount.accountNumber)
    ).toBeInTheDocument();
    expect(screen.getByText(pastoralGivingAccount.bankName)).toBeInTheDocument();
    expect(
      screen.getByText(pastoralGivingAccount.accountName)
    ).toBeInTheDocument();

    // A card gift cannot be routed to an individual, so offering one would
    // send the money to the church while the donor believed it reached the
    // pastor. There must be no checkout for this purpose at all.
    expect(
      screen.queryByRole("button", { name: /Card Payment/ })
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Select Amount/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Donate ₦/ })
    ).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not show the church accounts alongside the pastor's", () => {
    mockFetch();

    render(<GivingPage />);
    choosePastoralGiving();

    // Two sets of bank details on one screen is how a gift lands in the wrong
    // account, so the church card is hidden while this purpose is selected.
    bankAccounts.forEach((bank) => {
      expect(screen.queryByText(bank.accountNumber)).not.toBeInTheDocument();
    });
  });

  it("copies the pastor's account number to the clipboard", async () => {
    mockFetch();
    const writeText = mockClipboard();

    render(<GivingPage />);
    choosePastoralGiving();
    fireEvent.click(screen.getByRole("button", { name: /Copy account number/ }));

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(pastoralGivingAccount.accountNumber)
    );
    expect(
      await screen.findByRole("button", { name: /Account number copied/ })
    ).toBeInTheDocument();
  });

  it("copies the bank name, account number and account name in one paste", async () => {
    mockFetch();
    const writeText = mockClipboard();

    render(<GivingPage />);
    choosePastoralGiving();
    fireEvent.click(screen.getByRole("button", { name: /Copy bank details/ }));

    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    const copied = writeText.mock.calls[0][0] as string;
    expect(copied).toContain(pastoralGivingAccount.bankName);
    expect(copied).toContain(pastoralGivingAccount.accountNumber);
    expect(copied).toContain(pastoralGivingAccount.accountName);
  });

  it("fails loudly when the clipboard is unavailable", async () => {
    mockFetch();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: jest.fn().mockRejectedValue(new Error("denied")) },
    });

    render(<GivingPage />);
    choosePastoralGiving();
    fireEvent.click(screen.getByRole("button", { name: /Copy account number/ }));

    await waitFor(() =>
      expect(screen.getByText(/could not copy/i)).toBeInTheDocument()
    );
  });

  it("restores the church accounts and checkout when another purpose is chosen", () => {
    mockFetch();

    render(<GivingPage />);
    choosePastoralGiving();
    fireEvent.click(screen.getByRole("button", { name: /Tithes/ }));

    expect(
      screen.getByText(bankAccounts[0].accountNumber)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(pastoralGivingAccount.accountNumber)
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Card Payment/ })
    ).toBeInTheDocument();
  });

  it("opens straight to the pastor's account from a shared link", async () => {
    mockFetch();

    // This is the URL sent out to members, so it must not need a click.
    setUrl("?purpose=pastoral-giving");
    render(<GivingPage />);

    // The query string is only readable after mount, so allow a tick.
    await waitFor(
      () =>
        expect(
          screen.queryByText(/Select Amount/i)
        ).not.toBeInTheDocument(),
      { timeout: 3000 }
    );
    expect(
      screen.getByText(pastoralGivingAccount.accountNumber)
    ).toBeInTheDocument();
  });

  it("preselects an online purpose too, leaving the checkout available", async () => {
    const fetchMock = mockFetch();

    setUrl("?purpose=tithes");
    render(<GivingPage />);

    // The query string is applied a tick after mount, so wait for the purpose
    // to actually show as selected before submitting. Note the unselected
    // variant also contains "border-secondary" (as `hover:border-secondary`),
    // so the background token is what distinguishes the two.
    const tithes = screen.getByRole("button", { name: /Tithes/ });
    await waitFor(
      () => expect(tithes.className).toContain("bg-secondary-container/20"),
      { timeout: 3000 }
    );

    // Submitting now complains about the amount, not about the purpose —
    // proof the purpose was already chosen.
    fireEvent.click(screen.getByRole("button", { name: /Donate ₦0/ }));

    await waitFor(() =>
      expect(
        screen.getByText(/Please select or enter an amount/i)
      ).toBeInTheDocument()
    );
    expect(
      screen.queryByText(/Please select a donation purpose/i)
    ).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("ignores a purpose that is not offered", () => {
    mockFetch();

    setUrl("?purpose=free-money");
    render(<GivingPage />);

    expect(
      screen.queryByText(pastoralGivingAccount.accountNumber)
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Select Amount/i)).toBeInTheDocument();
  });

  it("keeps the address bar in step with the chosen purpose", () => {
    mockFetch();
    const replaceState = jest.spyOn(window.history, "replaceState");

    render(<GivingPage />);
    fireEvent.click(
      screen.getByRole("button", { name: /Pastor & Ministerial Giving/ })
    );

    expect(replaceState).toHaveBeenCalled();
    const calls = replaceState.mock.calls;
    const lastUrl = String(calls[calls.length - 1][2]);
    expect(lastUrl).toContain("purpose=pastoral-giving");
  });

  it("copies a church account's bank details from the details card", async () => {
    mockFetch();
    const writeText = mockClipboard();

    render(<GivingPage />);
    const bank = bankAccounts[0];
    fireEvent.click(
      screen.getByRole("button", { name: `Copy ${bank.bankName} bank details` })
    );

    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    const copied = writeText.mock.calls[0][0] as string;
    expect(copied).toContain(bank.bankName);
    expect(copied).toContain(bank.accountNumber);
    expect(copied).toContain(bank.accountName);
  });
});
