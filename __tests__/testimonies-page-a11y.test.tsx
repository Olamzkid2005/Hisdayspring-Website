/**
 * Accessibility of /testimonials — one page: photo hero, form, then the wall.
 *
 * This is the route a printed QR code points at, so a first-time visitor meets
 * the form holding a phone in one hand, at church, possibly with large text
 * enabled. The custom radio group and the hand-rolled textarea are where a label
 * or an error association can silently go missing, so both states are checked —
 * and so is the heading order, because the wall's heading was an h1 until the
 * pages merged.
 *
 * jest-axe is imported here rather than in `jest.setup.ts` so axe-core is only
 * loaded by the suites that use it.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import TestimonialsPage from "@/app/testimonials/page";

expect.extend(toHaveNoViolations);

/**
 * The `passes` floor stops a run that silently checked a near-empty tree from
 * reading as a pass.
 */
async function expectNoAxeViolations(container: HTMLElement) {
  const results = await axe(container);

  expect(results).toHaveNoViolations();
  expect(results.passes.length).toBeGreaterThanOrEqual(10);
}

describe("/testimonials accessibility", () => {
  it("has exactly one h1, with the form and wall as h2 sections", () => {
    render(<TestimonialsPage />);

    const h1 = screen.getAllByRole("heading", { level: 1 });
    expect(h1).toHaveLength(1);
    expect(h1[0]).toHaveTextContent("Testimonies");

    expect(
      screen.getByRole("heading", { level: 2, name: "Share your testimony" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Divine Encounters" })
    ).toBeInTheDocument();
  });

  it("gives the visitor a clear way home from the hero", () => {
    render(<TestimonialsPage />);

    const home = screen.getByRole("link", { name: /back to home/i });
    expect(home).toHaveAttribute("href", "/");
  });

  it("puts the form before the wall in reading order", () => {
    const { container } = render(<TestimonialsPage />);

    const form = container.querySelector("form") as HTMLFormElement;
    const wall = container.querySelector("#testimonials") as HTMLElement;

    expect(form).not.toBeNull();
    expect(wall).not.toBeNull();
    // Node.compareDocumentPosition: 4 means `wall` follows `form`.
    expect(form.compareDocumentPosition(wall) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("has no axe violations as rendered", async () => {
    const { container } = render(<TestimonialsPage />);

    await expectNoAxeViolations(container);
  });

  it("has no axe violations with every validation error showing", async () => {
    const { container } = render(<TestimonialsPage />);

    fireEvent.submit(container.querySelector("form") as HTMLFormElement);

    const alerts = await screen.findAllByRole("alert");
    expect(alerts.length).toBeGreaterThan(0);

    await expectNoAxeViolations(container);
  });

  it("labels every field, including the custom radio group", () => {
    render(<TestimonialsPage />);

    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/branch/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your testimony/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/yes, share it/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/no, keep it private/i)).toBeInTheDocument();
  });

  it("ties the testimony error to the field it belongs to", async () => {
    const { container } = render(<TestimonialsPage />);

    fireEvent.submit(container.querySelector("form") as HTMLFormElement);
    await screen.findAllByRole("alert");

    const field = screen.getByLabelText(/your testimony/i);
    expect(field).toHaveAttribute("aria-invalid", "true");

    const describedBy = field.getAttribute("aria-describedby") ?? "";
    expect(describedBy).not.toBe("");

    const messages = describedBy
      .split(" ")
      .map((id) => document.getElementById(id)?.textContent ?? "");

    // An empty box reports "required"; a short one reports the minimum length.
    expect(messages.join(" ")).toMatch(/required|at least/i);
  });

  it("links the form to the wall it now sits above", () => {
    render(<TestimonialsPage />);

    const skipLink = screen.getByRole("link", {
      name: /read others’ testimonies/i,
    });

    expect(skipLink).toHaveAttribute("href", "#testimonials");
  });
});
