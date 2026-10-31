/**
 * Hero carousel content.
 *
 * The opening slide is permanent. Every other slide is drawn from the gallery
 * pool newest shoot first (see `lib/hero-slides.ts`), so publishing a batch
 * with a later date in `data/gallery.ts` brings it straight into the hero and
 * pushes the older photos out — no change needed here.
 */

import { lagosToday } from "@/lib/lagos-time";

export interface HeroSlide {
  image: string;
  alt: string;
  caption?: string;
}

interface FeaturedHeroSlide extends HeroSlide {
  /** Last Lagos date (inclusive) the slide may appear. */
  until: string;
}

export const HERO_SLIDE_COUNT = 12;

export const FIRST_HERO_SLIDE: HeroSlide = {
  image: "/images/Very good hero.JPG",
  alt: "Hisdayspring Ministries",
};

/**
 * Event handbills pinned near the front of the carousel for a fixed window.
 * They drop out on their own after `until`, so a past event cannot stay in the
 * hero just because nobody removed the entry.
 */
export const FEATURED_HERO_SLIDES: FeaturedHeroSlide[] = [
  {
    image: "/images/events/november-mega-thanksgiving.webp",
    alt: "November Mega Thanksgiving Service flyer",
    caption: "Sun 1 Nov · 8 AM, 10 AM & 12 NOON",
    until: "2026-11-01",
  },
];

export function getFeaturedHeroSlides(
  today: string = lagosToday()
): HeroSlide[] {
  return FEATURED_HERO_SLIDES.filter((slide) => today <= slide.until).map(
    (slide) => ({
      image: slide.image,
      alt: slide.alt,
      caption: slide.caption,
    })
  );
}
