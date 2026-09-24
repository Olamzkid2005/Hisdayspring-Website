/**
 * Behavioural tests for the /books ordering flow.
 *
 * The critical journey: pay → come back with ?checkout_id= → confirm
 * server-side → only then show downloads/pickup reference. Also covers the
 * staff verify page used at the bookstand.
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BooksClient from "@/app/books/BooksClient";
import BookVerifyPage from "@/app/books/verify/page";
import BookReceiptPage from "@/app/books/receipt/page";
import { books } from "@/data/books";

jest.setTimeout(15000);

function mockFetch(...responses: Array<{ ok: boolean; status: number; body: unknown }>) {
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

function setUrl(search = "") {
  window.history.replaceState({}, "", `/books${search}`);
}

const sample = books.find((book) => book.id === "made-to-be-whole")!;

function addToCart() {
  fireEvent.click(screen.getByRole("button", { name: `Add ${sample.title} to order` }));
}

function fillBuyer() {
  fireEvent.change(screen.getByLabelText(/Full Name/i), {
    target: { value: "Jane Buyer" },
  });
  fireEvent.change(screen.getByLabelText(/Email Address/i), {
    target: { value: "buyer@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/Phone Number/i), {
    target: { value: "+2348000000000" },
  });
}

describe("/books ordering", () => {
  beforeEach(() => {
    // The cart persists in localStorage across renders — clear it so each
    // test starts from an empty cart like a first-time visitor.
    window.localStorage.clear();
    setUrl("");
  });
  afterEach(() => jest.restoreAllMocks());

  it("adds to the cart, shows the total, and checks out", async () => {
    const fetchMock = mockFetch({
      ok: true,
      status: 200,
      body: { success: true, authorizationUrl: "https://checkout.bachs.io/c/x" },
    });
    const errorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    render(<BooksClient />);
    addToCart();

    // The floating cart bar only exists once something is in the cart.
    expect(screen.getByRole("button", { name: /Checkout/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Checkout/ }));
    fillBuyer();
    fireEvent.click(screen.getByRole("button", { name: /Pay ₦/ }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const payload = JSON.parse(String(init.body));
    expect(url).toBe("/api/payments/bachs/book-order/initialize");
    expect(payload.items).toEqual([{ bookId: sample.id, quantity: 1 }]);
    expect(payload.fulfillment).toBe("pickup");
    errorSpy.mockRestore();
  });

  it("rejects an invalid email before calling the server", async () => {
    const fetchMock = mockFetch();
    render(<BooksClient />);
    addToCart();
    fireEvent.click(screen.getByRole("button", { name: /Checkout/ }));

    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "Jane Buyer" },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "not-an-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Pay ₦/ }));

    await waitFor(() =>
      expect(screen.getByText(/valid email/i)).toBeInTheDocument()
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("confirms a returned checkout and shows the pickup reference", async () => {
    mockFetch({
      ok: true,
      status: 200,
      body: {
        success: true,
        checkoutId: "chk_pickup1",
        reference: "hisdayspring-book-abc",
        order: {
          fulfillment: "pickup",
          lines: [
            {
              bookId: sample.id,
              title: sample.title,
              quantity: 2,
              unitPrice: sample.price,
              lineTotal: sample.price * 2,
            },
          ],
          total: sample.price * 2,
          catalogMatch: true,
        },
      },
    });

    setUrl("?checkout_id=chk_pickup1");
    render(<BooksClient />);

    await waitFor(
      () =>
        expect(screen.getByText(/Order paid — thank you/i)).toBeInTheDocument(),
      { timeout: 3000 }
    );
    expect(screen.getByText(/Show this reference at the bookstand/i)).toBeInTheDocument();
    expect(screen.getByText(/hisdayspring-book-abc/i)).toBeInTheDocument();
  });

  it("restores the cart from a previous visit after refresh or navigation", async () => {
    mockFetch();

    // Simulate a cart saved by an earlier visit.
    window.localStorage.setItem(
      "hisdayspring-book-cart",
      JSON.stringify({ [sample.id]: 3 })
    );

    render(<BooksClient />);

    // The quantity stepper replaces the Add button once the saved cart is
    // restored, and the floating bar shows the persisted total.
    await waitFor(
      () =>
        expect(
          screen.getByRole("button", { name: /Checkout/ })
        ).toBeInTheDocument(),
      { timeout: 3000 }
    );
    expect(
      screen.getByLabelText(`${sample.title}: 3 copies`)
    ).toBeInTheDocument();
  });

  it("drops saved entries for books that are no longer offered", async () => {
    const fetchMock = mockFetch();

    window.localStorage.setItem(
      "hisdayspring-book-cart",
      JSON.stringify({ "vanished-book": 2, [sample.id]: 1 })
    );

    render(<BooksClient />);

    await waitFor(
      () =>
        expect(
          screen.getByRole("button", { name: /Checkout/ })
        ).toBeInTheDocument(),
      { timeout: 3000 }
    );
    // The vanished title is gone from the cart; the valid one survives.
    expect(
      screen.getByLabelText(`${sample.title}: 1 copy`)
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("empties the saved cart once the order is paid", async () => {
    window.localStorage.setItem(
      "hisdayspring-book-cart",
      JSON.stringify({ [sample.id]: 1 })
    );
    mockFetch({
      ok: true,
      status: 200,
      body: {
        success: true,
        checkoutId: "chk_paid1",
        order: {
          fulfillment: "pickup",
          lines: [
            {
              bookId: sample.id,
              title: sample.title,
              quantity: 1,
              unitPrice: sample.price,
              lineTotal: sample.price,
            },
          ],
          total: sample.price,
          catalogMatch: true,
        },
      },
    });

    setUrl("?checkout_id=chk_paid1");
    render(<BooksClient />);

    await waitFor(
      () =>
        expect(screen.getByText(/Order paid — thank you/i)).toBeInTheDocument(),
      { timeout: 3000 }
    );
    expect(window.localStorage.getItem("hisdayspring-book-cart")).toBe("{}");
  });

  it("shows PDF download links only for a paid pdf order", async () => {
    mockFetch({
      ok: true,
      status: 200,
      body: {
        success: true,
        checkoutId: "chk_pdforder",
        order: {
          fulfillment: "pdf",
          lines: [
            {
              bookId: sample.id,
              title: sample.title,
              quantity: 1,
              unitPrice: sample.price,
              lineTotal: sample.price,
            },
          ],
          total: sample.price,
          catalogMatch: true,
        },
      },
    });

    setUrl("?checkout_id=chk_pdforder");
    render(<BooksClient />);

    await waitFor(
      () =>
        expect(screen.getByText(/Order paid — thank you/i)).toBeInTheDocument(),
      { timeout: 3000 }
    );

    const link = screen.getByRole("link", {
      name: `Download ${sample.title} PDF`,
    });
    expect(link).toHaveAttribute(
      "href",
      `/api/payments/bachs/book-order/download?checkout_id=chk_pdforder&book=${sample.id}`
    );
  });

  it("does not treat an unverified checkout_id as paid", async () => {
    mockFetch({
      ok: true,
      status: 200,
      body: { success: false, message: "This checkout has not been completed" },
    });

    setUrl("?checkout_id=chk_fake");
    render(<BooksClient />);

    await waitFor(
      () =>
        expect(
          screen.getByText(/This checkout has not been completed/i)
        ).toBeInTheDocument(),
      { timeout: 3000 }
    );
    expect(screen.queryByText(/Order paid — thank you/i)).not.toBeInTheDocument();
  });
});

describe("/books clear cart", () => {
  beforeEach(() => setUrl(""));
  afterEach(() => jest.restoreAllMocks());

  it("empties the cart and hides the bar without calling out", () => {
    const fetchMock = mockFetch();

    render(<BooksClient />);
    addToCart();
    expect(screen.getByRole("button", { name: /Checkout/ })).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /Clear all items from your order/i })
    );

    expect(
      screen.queryByRole("button", { name: /Checkout/ })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: `Add ${sample.title} to order` })
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("/books receipt page", () => {
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

  function verifyResponse(overrides: object = {}) {
    return {
      ok: true,
      status: 200,
      body: {
        success: true,
        checkoutId: "chk_receipt1",
        reference: "hisdayspring-book-abc",
        paymentMethod: "NGN_CARD",
        order: {
          fulfillment: "pickup",
          lines: [
            {
              bookId: sample.id,
              title: sample.title,
              quantity: 2,
              unitPrice: sample.price,
              lineTotal: sample.price * 2,
            },
          ],
          total: sample.price * 2,
          catalogMatch: true,
          buyer: { name: "Jane Buyer", phone: "+2348000000000" },
        },
        ...overrides,
      },
    };
  }

  it("renders a verified receipt with logo, lines, total and reference", async () => {
    mockFetch(verifyResponse());

    setUrl("?checkout_id=chk_receipt1");
    render(<BookReceiptPage />);

    await waitFor(
      () => expect(screen.getByText(/Payment received/i)).toBeInTheDocument(),
      { timeout: 3000 }
    );
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
    expect(screen.getByText(sample.title)).toBeInTheDocument();
    // Line total and order total coincide here, so allow multiple matches.
    expect(screen.getAllByText("₦4,000").length).toBeGreaterThan(0);
    expect(screen.getByText(/hisdayspring-book-abc/i)).toBeInTheDocument();
    expect(screen.getByText(/Card payment/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Buyer/i)).toBeInTheDocument();
  });

  it("links the PDF download route for pdf orders", async () => {
    mockFetch(
      verifyResponse({
        order: {
          fulfillment: "pdf",
          lines: [
            {
              bookId: sample.id,
              title: sample.title,
              quantity: 1,
              unitPrice: sample.price,
              lineTotal: sample.price,
            },
          ],
          total: sample.price,
          catalogMatch: true,
        },
      })
    );

    setUrl("?checkout_id=chk_pdf1");
    render(<BookReceiptPage />);

    await waitFor(
      () => expect(screen.getAllByText(/Download PDF/i).length).toBeGreaterThan(0),
      { timeout: 3000 }
    );
    const link = screen
      .getAllByRole("link", { name: /Download PDF/i })[0]
      .getAttribute("href");
    expect(link).toContain(
      `/api/payments/bachs/book-order/download?checkout_id=chk_pdf1&book=${sample.id}`
    );
  });

  it("copies a shareable receipt link", async () => {
    mockFetch(verifyResponse());
    const writeText = mockClipboard();

    setUrl("?checkout_id=chk_receipt1");
    render(<BookReceiptPage />);

    await waitFor(
      () => expect(screen.getByText(/Payment received/i)).toBeInTheDocument(),
      { timeout: 3000 }
    );
    fireEvent.click(screen.getByRole("button", { name: /Copy link/i }));

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(
        expect.stringContaining(
          "/books/receipt?checkout_id=chk_receipt1"
        )
      )
    );
  });

  it("opens a chat with the church's WhatsApp number carrying the order message", async () => {
    mockFetch(verifyResponse());
    const openSpy = jest
      .spyOn(window, "open")
      .mockImplementation(() => null);

    setUrl("?checkout_id=chk_receipt1");
    render(<BookReceiptPage />);

    await waitFor(
      () => expect(screen.getByText(/Payment received/i)).toBeInTheDocument(),
      { timeout: 3000 }
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Send to church on WhatsApp/i })
    );

    expect(openSpy).toHaveBeenCalledTimes(1);
    const [url] = openSpy.mock.calls[0] as [string];
    // The church's number, not a generic share sheet.
    expect(url).toContain(`https://wa.me/2348077829444?text=`);
    const message = decodeURIComponent(
      url.split("text=")[1] ?? ""
    );
    expect(message).toContain("Hi, I just ordered");
    expect(message).toContain("Made To Be Whole");
    expect(message).toContain("₦4,000");
    expect(message).toContain("hisdayspring-book-abc");
    expect(message).toContain(
      "/books/receipt?checkout_id=chk_receipt1"
    );
  });

  it("refuses to render a receipt for an unpaid or bogus checkout", async () => {
    mockFetch({
      ok: true,
      status: 200,
      body: { success: false, message: "This checkout has not been completed" },
    });

    setUrl("?checkout_id=chk_fake");
    render(<BookReceiptPage />);

    await waitFor(
      () =>
        expect(screen.getByText(/Payment not confirmed/i)).toBeInTheDocument(),
      { timeout: 3000 }
    );
    expect(screen.queryByText(/Payment received/i)).not.toBeInTheDocument();
  });

  it("shows the invalid state for a malformed link", async () => {
    const fetchMock = mockFetch();

    setUrl("?checkout_id=");
    render(<BookReceiptPage />);

    await waitFor(() =>
      expect(
        screen.getByText(/receipt link is not valid/i)
      ).toBeInTheDocument()
    );    expect(fetchMock as jest.Mock).not.toHaveBeenCalled();
  });
});

describe("/books staff verify page", () => {
  beforeEach(() => setUrl(""));
  afterEach(() => jest.restoreAllMocks());

  it("shows a paid pickup order with titles, quantities and total", async () => {
    mockFetch({
      ok: true,
      status: 200,
      body: {
        success: true,
        checkoutId: "chk_pickup1",
        reference: "hisdayspring-book-abc",
        order: {
          fulfillment: "pickup",
          lines: [
            {
              bookId: sample.id,
              title: sample.title,
              quantity: 2,
              unitPrice: sample.price,
              lineTotal: sample.price * 2,
            },
          ],
          total: sample.price * 2,
          catalogMatch: true,
          buyer: { name: "Jane Buyer", phone: "+2348000000000" },
        },
      },
    });

    render(<BookVerifyPage />);

    fireEvent.change(screen.getByLabelText(/Buyer's reference or link/i), {
      target: { value: "chk_pickup1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Verify/ }));

    await waitFor(
      () => expect(screen.getByText(/Payment confirmed/i)).toBeInTheDocument(),
      { timeout: 3000 }
    );
    expect(screen.getByText(sample.title)).toBeInTheDocument();
    expect(screen.getByText(/Jane Buyer/)).toBeInTheDocument();
    expect(screen.getByText(/Hand over printed copies/i)).toBeInTheDocument();
  });

  it("refuses a bare nonsense reference without calling out", async () => {
    const fetchMock = mockFetch();

    render(<BookVerifyPage />);
    fireEvent.change(screen.getByLabelText(/Buyer's reference or link/i), {
      target: { value: "garbage!!!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Verify/ }));

    await waitFor(
      () => expect(screen.getByText(/Paste the buyer's reference/i)).toBeInTheDocument(),
      { timeout: 3000 }
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows an error when the payment cannot be confirmed", async () => {
    mockFetch({
      ok: true,
      status: 200,
      body: { success: false, message: "This checkout has not been completed" },
    });

    render(<BookVerifyPage />);
    fireEvent.change(screen.getByLabelText(/Buyer's reference or link/i), {
      target: { value: "chk_open1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Verify/ }));

    await waitFor(
      () => expect(screen.getByText(/Not verified/i)).toBeInTheDocument(),
      { timeout: 3000 }
    );
    expect(
      screen.getByText(/This checkout has not been completed/i)
    ).toBeInTheDocument();
  });
});
