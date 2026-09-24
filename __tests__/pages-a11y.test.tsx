/**
 * Accessibility checks for the remaining content pages.
 *
 * Each of these is a single route with no interactive flow of its own, so one
 * axe pass per page is the whole check. `/live` reads `/api/livestream`, so
 * `fetch` is stubbed to an offline payload; nothing else here touches the
 * network. jest-axe disables the colour-contrast category under jsdom, so
 * colour is not covered.
 */

import type { ComponentType } from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import BooksPage from "@/app/books/page";
import RadioPage from "@/app/radio/page";
import LivePage from "@/app/live/page";
import TestimonialsPage from "@/app/testimonials/page";
import WelfarePage from "@/app/welfare/page";
import CrusadePage from "@/app/crusade/page";

expect.extend(toHaveNoViolations);

jest.setTimeout(30000);

/**
 * The element floor matters: axe reports zero violations for a tree that failed
 * to render, so a page that silently rendered nothing — `/welfare` and
 * `/crusade` both `return null` when their ministry is missing from the data —
 * would otherwise read as accessible.
 */
async function expectNoAxeViolations(container: HTMLElement, minNodes = 20) {
  expect(container.querySelectorAll("*").length).toBeGreaterThan(minNodes);

  const results = await axe(container);

  expect(results).toHaveNoViolations();
  expect(results.passes.length).toBeGreaterThan(0);
}

/** `/live` reads `/api/livestream`; nothing else on these pages hits the network. */
function stubFetch(payload: unknown) {
  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    writable: true,
    value: jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => payload,
    }),
  });
}

const pages: Array<[string, ComponentType]> = [
  ["/books", BooksPage],
  ["/radio", RadioPage],
  ["/testimonials", TestimonialsPage],
  ["/welfare", WelfarePage],
  ["/crusade", CrusadePage],
];

const LIVE_VIDEO_ID = "06DxTU6V5uU";

describe("content page accessibility", () => {
  afterEach(() => jest.restoreAllMocks());

  beforeEach(() => stubFetch({ isLive: false }));

  describe.each(pages)("%s", (_path, Page) => {
    it("has no axe violations", async () => {
      const { container } = render(<Page />);

      await expectNoAxeViolations(container);
    });
  });

  // /live is checked on its own because it starts on a loading spinner and
  // only fills in once `/api/livestream` answers — and the two answers render
  // completely different markup, including a YouTube iframe when live.
  describe("/live", () => {
    it("has no axe violations when the stream is offline", async () => {
      const { container } = render(<LivePage />);

      await screen.findByText(/Join us live every Sunday/i);
      await expectNoAxeViolations(container);
    });

    it("has no axe violations when a stream is live", async () => {
      stubFetch({
        isLive: true,
        videoId: LIVE_VIDEO_ID,
        title: "Sunday Service",
      });

      const { container } = render(<LivePage />);

      // The embedded player only exists in this branch, and it is most of the
      // page — hence the smaller node floor, which the iframe check backs up.
      await screen.findByTitle(/Sunday Service/i);
      expect(container.querySelector("iframe")).not.toBeNull();
      await expectNoAxeViolations(container, 8);
    });
  });
});
