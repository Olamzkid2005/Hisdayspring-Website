/**
 * The testimony form on /testimonials, as a visitor meets it.
 *
 * The page is the one a printed QR code points at, so its two jobs are fixed:
 * it must refuse to send an incomplete testimony, and it must hand a *complete*
 * one to WhatsApp whether that fits in a URL or not.
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TestimonySection } from "@/components/sections/TestimonySection";
import { TESTIMONY_MAX_LENGTH } from "@/data/testimony";

function mockClipboard() {
  const writeText = jest.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  return writeText;
}

/**
 * jsdom refuses a click-driven submit while a `required` field is empty, which
 * would hide exactly the validation state these tests exist to check. The rest
 * of the suite submits the form node directly for the same reason.
 */
function submit(container: HTMLElement) {
  fireEvent.submit(container.querySelector("form") as HTMLFormElement);
}

function fillForm(options: { testimony: string }) {
  fireEvent.change(screen.getByLabelText(/your name/i), {
    target: { value: "Grace O." },
  });
  fireEvent.click(screen.getByLabelText(/yes, share it/i));
  fireEvent.change(screen.getByLabelText(/your testimony/i), {
    target: { value: options.testimony },
  });
}

describe("testimony form", () => {
  let openSpy: jest.SpyInstance;

  beforeEach(() => {
    openSpy = jest.spyOn(window, "open").mockImplementation(() => null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("asks for a testimony and a publish choice before doing anything", async () => {
    mockClipboard();
    render(<TestimonySection />);

    // `noValidate` is set on the form, so a real click reaches our validation
    // instead of a native browser bubble. Clicking proves that wiring.
    fireEvent.click(screen.getByRole("button", { name: /send by whatsapp/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(
      screen.getByText(/please choose whether we may share/i)
    ).toBeInTheDocument();
    expect(openSpy).not.toHaveBeenCalled();
  });

  it("opens WhatsApp with a short testimony prefilled", async () => {
    const writeText = mockClipboard();
    const { container } = render(<TestimonySection />);

    fillForm({ testimony: "God healed my mother after three years of prayer." });
    submit(container);

    await waitFor(() => expect(openSpy).toHaveBeenCalledTimes(1));

    const url = openSpy.mock.calls[0][0] as string;
    expect(url.startsWith("https://wa.me/2347085167576?text=")).toBe(true);
    expect(decodeURIComponent(url)).toContain(
      "God healed my mother after three years of prayer."
    );
    // Nothing to paste, so the clipboard stays untouched.
    expect(writeText).not.toHaveBeenCalled();
    expect(await screen.findByText(/already typed in/i)).toBeInTheDocument();
  });

  it("copies a long testimony to the clipboard instead of truncating the URL", async () => {
    const writeText = mockClipboard();
    const longTestimony = `God did this. ${"And more. ".repeat(300)}`;
    const { container } = render(<TestimonySection />);

    fillForm({ testimony: longTestimony.slice(0, TESTIMONY_MAX_LENGTH) });
    submit(container);

    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));

    // The clipboard carries the whole text, not the header.
    expect(writeText.mock.calls[0][0]).toContain(longTestimony.slice(0, 40));

    const url = openSpy.mock.calls[0][0] as string;
    expect(url.length).toBeLessThan(2000);
    expect(decodeURIComponent(url)).toContain("follows below");

    expect(await screen.findByText(/long-press the message box/i)).toBeInTheDocument();
  });

  it("offers an email route for a visitor without WhatsApp", async () => {
    mockClipboard();
    const { container } = render(<TestimonySection />);

    fillForm({ testimony: "God restored my marriage after two years." });
    submit(container);

    const emailLink = await screen.findByRole("link", { name: /send by email/i });
    expect(emailLink).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:hello@hisdayspring.org")
    );
  });

  it("explains the fallback when the clipboard is blocked", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: jest.fn().mockRejectedValue(new Error("NotAllowedError")),
      },
    });
    const { container } = render(<TestimonySection />);

    fillForm({ testimony: `God did this. ${"More. ".repeat(400)}` });
    submit(container);

    // The chat opened but the text did not copy, so the page must hand over the
    // text for a manual paste rather than leaving an empty message to send.
    expect(
      await screen.findByText(/did not copy/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByLabelText(/your testimony, ready to copy/i)
    ).toBeInTheDocument();
  });
});

describe("testimony form without a clipboard", () => {
  afterEach(() => jest.restoreAllMocks());

  it("shows the text to copy by hand instead of opening an empty chat", async () => {
    const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);
    // Older browsers, and any page served over plain http, have no async
    // clipboard — copying the text there is impossible, so WhatsApp must not be
    // opened at all or the church receives a message with no testimony in it.
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });

    const { container } = render(<TestimonySection />);
    const longTestimony = `God did this. ${"And more. ".repeat(300)}`.slice(
      0,
      TESTIMONY_MAX_LENGTH
    );

    fillForm({ testimony: longTestimony });
    submit(container);

    expect(openSpy).not.toHaveBeenCalled();
    const manualBox = (await screen.findByLabelText(
      /your testimony, ready to copy/i
    )) as HTMLTextAreaElement;
    expect(manualBox.value).toContain("God did this.");
  });
});

describe("testimony form corrections", () => {
  afterEach(() => jest.restoreAllMocks());

  it("clears the publish error as soon as an option is chosen", async () => {
    mockClipboard();
    render(<TestimonySection />);

    fireEvent.click(screen.getByRole("button", { name: /send by whatsapp/i }));
    expect(
      await screen.findByText(/please choose whether we may share/i)
    ).toBeInTheDocument();

    // Choosing an option is the visitor answering the question, so the error
    // must go without waiting for another submit.
    fireEvent.click(screen.getByLabelText(/yes, share it/i));

    expect(
      screen.queryByText(/please choose whether we may share/i)
    ).not.toBeInTheDocument();
  });

  it("drops a stale result panel when the testimony is edited", async () => {
    jest.spyOn(window, "open").mockImplementation(() => null);
    mockClipboard();
    render(<TestimonySection />);

    fillForm({ testimony: "God healed my mother after three years of prayer." });
    fireEvent.click(screen.getByRole("button", { name: /send by whatsapp/i }));
    expect(await screen.findByText(/already typed in/i)).toBeInTheDocument();

    // The panel's link carries the message built at submit time; editing must
    // not leave a live link to the version the visitor just corrected.
    fireEvent.change(screen.getByLabelText(/your testimony/i), {
      target: { value: "God healed my mother, and my father too." },
    });

    expect(screen.queryByText(/already typed in/i)).not.toBeInTheDocument();
  });
});
