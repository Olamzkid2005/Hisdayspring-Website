/**
 * Accessibility checks for /giving.
 *
 * The page is form-heavy and swaps a large chunk of itself for the pastoral
 * giving panel, which is exactly the kind of change that quietly drops a label
 * or breaks heading order. axe runs on the real component in both states.
 *
 * `jest-axe` registers its matcher here rather than in `jest.setup.ts` so
 * axe-core is only loaded by the files that need it — it is a large dependency
 * to pull into every suite.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import GivingPage from "@/app/giving/page";

expect.extend(toHaveNoViolations);

describe("/giving accessibility", () => {
  beforeEach(() => window.history.replaceState({}, "", "/giving"));
  afterEach(() => jest.restoreAllMocks());

  it("has no axe violations on the donation form", async () => {
    const { container } = render(<GivingPage />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations with pastoral giving selected", async () => {
    const { container } = render(<GivingPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /Pastor & Ministerial Giving/ })
    );

    // Guard against the panel silently not rendering, which would make this
    // test pass by checking an empty form.
    expect(screen.getByText(/Give directly to the pastor/i)).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations on the thank-you state", async () => {
    Object.defineProperty(globalThis, "fetch", {
      configurable: true,
      writable: true,
      value: jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () =>
          ({ success: true, status: "completed", checkoutId: "chk_axe" }),
      }),
    });

    window.history.replaceState({}, "", "/giving?checkout_id=chk_axe");
    const { container } = render(<GivingPage />);

    await screen.findByText(/Thank you for your gift/i);

    // axe does not flag this, so assert it directly: a <button> nested inside
    // a link is invalid interactive nesting and is announced unpredictably, so
    // navigation must be a plain Link.
    expect(container.querySelectorAll("a button, button a")).toHaveLength(0);
    expect(screen.getByRole("link", { name: /Back to Home/i })).toHaveAttribute(
      "href",
      "/"
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
