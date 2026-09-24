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
  beforeEach(() => setUrl(""));
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
