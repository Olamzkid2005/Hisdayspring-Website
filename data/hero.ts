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
  /**
   * How the slide fills the hero. Photographs are cropped to fill (`cover`);
   * a handbill carries dates and a venue in its margins, so cropping it can
   * throw the event away. Defaults to `cover`.
   */
  fit?: "cover" | "contain";
  /**
   * Portrait artwork for phones. A 2:1 handbill contained in a phone hero is a
   * 195px strip, and cropped to fill it loses three quarters of its width, so
   * handbills ship a tall version instead of one image stretched to fit both.
   */
  mobileImage?: string;
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
  {
    // Wide convention handbill, pinned until the last day of the convention.
    // It is a flyer rather than a photograph, so it sits behind the site
    // heading the same way the thanksgiving handbill did.
    image: "/images/events/light-convention-2026-hero.jpeg",
    alt: "Light Convention 2026 flyer, Exceeding Multiplication, December 17 to 20",
    caption: "Dec 17-20 · 9 AM & 5:30 PM",
    fit: "contain",
    mobileImage: "/images/events/light-convention-2026.jpeg",
    until: "2026-12-20",
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
      // Copied explicitly: every field left out here is dropped on the way to
      // the carousel, which is how the handbill first arrived without its fit.
      fit: slide.fit,
      mobileImage: slide.mobileImage,
    })
  );
}
