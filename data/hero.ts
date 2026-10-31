/**
 * Hero carousel content.
 *
 * The component used to own these paths and captions, which meant changing a
 * slide meant editing presentation code. The featured handbill also duplicated
 * an event that lives in `data/events.ts`; keep the next conference's copy in
 * sync when the handbill is swapped.
 */

export interface HeroSlide {
  image: string;
  alt: string;
  caption?: string;
}

export const HERO_SLIDE_COUNT = 12;

export const FIRST_HERO_SLIDE: HeroSlide = {
  image: "/images/Very good hero.JPG",
  alt: "Hisdayspring Ministries",
};

/**
 * Permanent second slide: the current flagship event handbill. When the
 * conference has passed, swap this path (and the caption) for whatever is
 * next — the rest of the carousel carries on automatically.
 */
export const FEATURED_EVENT_SLIDE: HeroSlide = {
  image: "/images/events/greater-works-conference.webp",
  alt: "Greater Works Ministers & Leaders Conference — Making Ministry Impact, 26–27 October 2026",
  caption: "Making Ministry Impact · 26 & 27 October, 9AM",
};

/** Recent service and outreach photos, shown after the static opening slides. */
export const RECENT_HERO_SLIDES: HeroSlide[] = [
  // Last Sunday's service (25 October 2026) leads the recent group, ahead of
  // the earlier crusade photos.
  {
    image: "/images/gallery/_DSC7107.jpg",
    alt: "The worship team leading praise at the Power Lifting Sunday service",
  },
  {
    image: "/images/gallery/_DSC7078.jpg",
    alt: "A pastor ministering from the pulpit at the Power Lifting Sunday service",
  },
  {
    image: "/images/gallery/_DSC7249.jpg",
    alt: "The congregation gathered for the Power Lifting Sunday service",
  },
  {
    image: "/images/gallery/_DSC7182.jpg",
    alt: "Ministers praying for a member during the Power Lifting Sunday service",
  },
  {
    image: "/images/launch/_DSC4002.jpg",
    alt: "Hisdayspring crusade outreach at a community venue",
  },
  {
    image: "/images/launch/_DSC2549.jpg",
    alt: "Worshippers gathered together during a Hisdayspring service",
  },
];
