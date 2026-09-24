/**
 * Accessibility checks for the whole homepage.
 *
 * Two layers on purpose:
 *
 * - the assembled page, because that is the only way cross-section problems
 *   show up (heading order running Hero -> About -> ... -> Contact, duplicate
 *   ids, competing landmarks);
 * - each section alone, so a failure names the section rather than one selector
 *   buried in a thousand-node tree.
 *
 * `SermonsSection` reads `/api/livestream`, so `fetch` is stubbed to an offline
 * payload; nothing else on the page touches the network. jest-axe disables the
 * colour-contrast category under jsdom, so colour is not covered here.
 */

import type { ComponentType } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import Home from "@/app/page";
import * as eventsData from "@/data/events";
import {
  AboutSection,
  ContactSection,
  EventsSection,
  GallerySection,
  GiveSection,
  HeroSection,
  MinistriesSection,
  PastorSection,
  SermonsSection,
  ServiceTimesSection,
  SocialSection,
} from "@/components/sections";

expect.extend(toHaveNoViolations);

jest.setTimeout(30000);

/**
 * The element floor is the important half: axe reports zero violations for a
 * tree that failed to render, so a section that silently unmounted would
 * otherwise read as accessible. The floor is low on purpose — `EventsSection`
 * legitimately renders only its empty state, because every seeded event has
 * already ended. Its populated markup is checked separately below.
 */
async function expectNoAxeViolations(container: HTMLElement) {
  expect(container.querySelectorAll("*").length).toBeGreaterThan(5);

  const results = await axe(container);

  expect(results).toHaveNoViolations();
  expect(results.passes.length).toBeGreaterThan(0);
}

/** [label, anchor id on the page, component] */
const sections: Array<[string, string, ComponentType]> = [
  ["HeroSection", "home", HeroSection],
  ["AboutSection", "about", AboutSection],
  ["PastorSection", "welcome", PastorSection],
  ["ServiceTimesSection", "services", ServiceTimesSection],
  ["SermonsSection", "sermons", SermonsSection],
  ["MinistriesSection", "ministries", MinistriesSection],
  ["EventsSection", "events", EventsSection],
  ["GiveSection", "give", GiveSection],
  ["GallerySection", "gallery", GallerySection],
  ["SocialSection", "social", SocialSection],
  ["ContactSection", "contact", ContactSection],
];

describe("homepage accessibility", () => {
  // The jest config does not restore mocks automatically, and the events spy
  // below would otherwise leak into every later check in this file.
  afterEach(() => jest.restoreAllMocks());

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

  // Without this, dropping a section from `Home` would silently reduce what the
  // assembled-page check below covers.
  it("mounts every section this suite checks", () => {
    const { container } = render(<Home />);

    sections.forEach(([, anchor]) => {
      expect(container.querySelector(`#${anchor}`)).not.toBeNull();
    });
  });

  // The lightbox only exists once a photo is opened, so a passive render of
  // the gallery never puts it in front of axe.
  it("checks the gallery lightbox once it is open", async () => {
    const { container } = render(<GallerySection />);

    fireEvent.click(screen.getAllByRole("button", { name: /^View / })[0]);
    expect(
      screen.getByRole("dialog", { name: "Image lightbox" })
    ).toBeInTheDocument();

    await expectNoAxeViolations(container);
  });

  it("has no axe violations as one assembled page", async () => {
    const { container } = render(<Home />);

    await expectNoAxeViolations(container);
  });

  // `scheduledEvents` in data/events.ts is deliberately empty until the church
  // confirms an event, so this section renders its empty state and nothing
  // else. Feeding it the archived events puts the real card markup — images,
  // links, the details control — in front of axe rather than leaving it
  // unchecked.
  it("checks the events markup with events present, not just the empty state", async () => {
    jest
      .spyOn(eventsData, "getUpcomingEvents")
      .mockReturnValue(eventsData.pastEvents);

    const { container } = render(<EventsSection />);

    expect(container.querySelectorAll("*").length).toBeGreaterThan(50);
    await expectNoAxeViolations(container);
  });

  describe.each(sections)("%s", (_label, _anchor, Section) => {
    it("has no axe violations on its own", async () => {
      const { container } = render(<Section />);

      await expectNoAxeViolations(container);
    });
  });
});
