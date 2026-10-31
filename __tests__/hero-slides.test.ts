import { buildHeroSlides } from "@/lib/hero-slides";
import {
  FEATURED_EVENT_SLIDE,
  FIRST_HERO_SLIDE,
  HERO_SLIDE_COUNT,
  RECENT_HERO_SLIDES,
} from "@/data/hero";

describe("buildHeroSlides", () => {
  const slides = buildHeroSlides();
  const fixedImages = [
    FIRST_HERO_SLIDE,
    FEATURED_EVENT_SLIDE,
    ...RECENT_HERO_SLIDES,
  ].map((slide) => slide.image);

  it("shows every image at most once", () => {
    const images = slides.map((slide) => slide.image);
    expect(new Set(images).size).toBe(images.length);
  });

  it("does not repeat a photo from the fixed opening slides", () => {
    // Four of the recent service photos also live in the gallery data, so the
    // gallery pick has to skip them.
    const gallerySlides = slides.slice(fixedImages.length);
    expect(gallerySlides.length).toBeGreaterThan(0);
    for (const slide of gallerySlides) {
      expect(fixedImages).not.toContain(slide.image);
    }
  });

  it("fills the configured carousel length", () => {
    expect(slides).toHaveLength(HERO_SLIDE_COUNT);
  });
});
