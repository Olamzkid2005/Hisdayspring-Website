/**
 * Accessibility checks for the two form surfaces outside /giving.
 *
 * These forms only ever hand off to the visitor's own mail client or WhatsApp —
 * nothing is posted anywhere — so the states worth checking are the ones a real
 * visitor sees: the clean form, and the form with its validation errors open,
 * which is when labels, `aria-describedby` and the alert regions actually exist.
 *
 * There is no newsletter form in the codebase to check; only an unused
 * `NewsletterFormData` type.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { ContactSection } from "@/components/sections/ContactSection";
import { PrayerSection } from "@/components/sections/PrayerSection";

expect.extend(toHaveNoViolations);

/**
 * axe reports "incomplete" rather than "violation" when it cannot finish a
 * check, and jest-axe disables the entire colour-contrast category under jsdom
 * because there is no layout to measure. A clean run here therefore means
 * structure, names and ARIA — not colour.
 *
 * The `passes` floor stops a run that silently checked a near-empty tree from
 * reading as a pass: axe 4.10 clears 14 rules against these forms.
 */
async function expectNoAxeViolations(container: HTMLElement) {
  const results = await axe(container);

  expect(results).toHaveNoViolations();
  expect(results.passes.length).toBeGreaterThanOrEqual(10);
}

/**
 * axe only validates `aria-describedby` when it is present — it cannot tell
 * that a field *should* point at its error message. So assert the wiring
 * directly, or the error state can regress to an unassociated red paragraph.
 */
function expectErrorLinkedToField(field: HTMLElement) {
  expect(field).toHaveAttribute("aria-invalid", "true");

  const describedBy = field.getAttribute("aria-describedby");
  const message = describedBy ? document.getElementById(describedBy) : null;

  expect(message).not.toBeNull();
  expect(message).toHaveTextContent(/required/i);
}

describe("form accessibility", () => {
  describe("contact section", () => {
    it("has no axe violations as rendered", async () => {
      const { container } = render(<ContactSection />);

      await expectNoAxeViolations(container);
    });

    it("has no axe violations with every validation error showing", async () => {
      const { container } = render(<ContactSection />);

      // Both forms live in this section: the contact message form and the
      // inline prayer form.
      container
        .querySelectorAll("form")
        .forEach((form) => fireEvent.submit(form));

      const alerts = await screen.findAllByRole("alert");
      expect(alerts.length).toBeGreaterThan(0);

      await expectNoAxeViolations(container);
    });

    it("points each error at the field it belongs to", async () => {
      const { container } = render(<ContactSection />);

      container
        .querySelectorAll("form")
        .forEach((form) => fireEvent.submit(form));
      await screen.findAllByRole("alert");

      expectErrorLinkedToField(screen.getByRole("textbox", { name: /^Message/i }));
      expectErrorLinkedToField(
        screen.getByRole("textbox", { name: /Prayer Request/i })
      );
      expectErrorLinkedToField(screen.getByRole("combobox", { name: /Subject/i }));
    });
  });

  describe("prayer page section", () => {
    it("has no axe violations as rendered", async () => {
      const { container } = render(<PrayerSection />);

      await expectNoAxeViolations(container);
    });

    it("has no axe violations with validation errors showing", async () => {
      const { container } = render(<PrayerSection />);

      fireEvent.submit(container.querySelector("form") as HTMLFormElement);

      const alerts = await screen.findAllByRole("alert");
      expect(alerts.length).toBeGreaterThan(0);

      await expectNoAxeViolations(container);
    });

    it("points the request error at the request field", async () => {
      const { container } = render(<PrayerSection />);

      fireEvent.submit(container.querySelector("form") as HTMLFormElement);
      await screen.findAllByRole("alert");

      expectErrorLinkedToField(
        screen.getByRole("textbox", { name: /Prayer Request/i })
      );
    });
  });
});
