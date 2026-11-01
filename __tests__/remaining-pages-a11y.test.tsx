/**
 * Accessibility checks for routes the page-level suite does not cover:
 * pastors, prayer, privacy, terms, not-found, error, the two book utility
 * pages and a ministry detail. jest-axe disables colour contrast under jsdom.
 */
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import PastorsPage from "@/app/pastors/page";
import PrayerPage from "@/app/prayer/page";
import PrivacyPage from "@/app/privacy/page";
import TermsPage from "@/app/terms/page";
import NotFound from "@/app/not-found";
import ErrorPage from "@/app/error";
import VerifyPage from "@/app/books/verify/page";
import ReceiptPage from "@/app/books/receipt/page";
import { MinistryDetail } from "@/components/ministry/MinistryDetail";
import { ministries } from "@/data/ministries";

expect.extend(toHaveNoViolations);
jest.setTimeout(30000);

async function check(ui: React.ReactElement, minNodes = 15) {
  const { container } = render(ui);
  expect(container.querySelectorAll("*").length).toBeGreaterThan(minNodes);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}

beforeEach(() => {
  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    writable: true,
    value: jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ isLive: false }),
    }),
  });
});

describe("audit a11y sweep", () => {
  it("/pastors", async () => {
    await check(<PastorsPage />);
  });

  it("/prayer", async () => {
    await check(<PrayerPage />);
  });

  it("/privacy", async () => {
    await check(<PrivacyPage />);
  });

  it("/terms", async () => {
    await check(<TermsPage />);
  });

  it("/not-found", async () => {
    await check(<NotFound />);
  });

  it("/error", async () => {
    // The page logs the error on mount; that is expected, not a test failure.
    jest.spyOn(console, "error").mockImplementation(() => {});
    await check(<ErrorPage error={new Error("boom")} reset={jest.fn()} />, 3);
  });

  it("/books/verify", async () => {
    await check(<VerifyPage />);
  });

  it("/books/receipt", async () => {
    await check(<ReceiptPage />, 3);
  });

  it("ministry detail", async () => {
    await check(<MinistryDetail ministry={ministries[0]} />);
  });
});
