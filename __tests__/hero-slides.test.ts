import { buildHeroSlides, buildHomeHeroSlides, nextHeroIndex } from "@/lib/hero-slides";
import { FIRST_HERO_SLIDE, HERO_SLIDE_COUNT, getFeaturedHeroSlides } from "@/data/hero";
import { galleryPhotos } from "@/data/gallery";
import type { GalleryPhoto } from "@/types";

describe("buildHeroSlides", () => {
  const slides = buildHeroSlides();
  const dateByImage = new Map(
    galleryPhotos.map((photo) => [photo.imageUrl, photo.date ?? ""])
  );

  it("always opens with the fixed welcome slide", () => {
    expect(slides[0]).toEqual(FIRST_HERO_SLIDE);
  });

  it("fills the configured carousel length", () => {
    expect(slides).toHaveLength(HERO_SLIDE_COUNT);
  });

  it("shows every image at most once", () => {
    const images = slides.map((slide) => slide.image);
    expect(new Set(images).size).toBe(images.length);
  });

  it("orders the pool newest shoot first", () => {
    const dates = slides
      .slice(1)
      .map((slide) => dateByImage.get(slide.image) ?? "");

    expect(dates.every(Boolean)).toBe(true);
    expect([...dates].sort((a, b) => b.localeCompare(a))).toEqual(dates);
  });

  it("fills every moving slot from the newest batch when it is large enough", () => {
    const newest = galleryPhotos
      .map((photo) => photo.date)
      .filter((date): date is string => Boolean(date))
      .sort()
      .pop();
    const newestImages = new Set(
      galleryPhotos
        .filter((photo) => photo.date === newest)
        .map((photo) => photo.imageUrl)
    );

    expect(newestImages.size).toBeGreaterThanOrEqual(HERO_SLIDE_COUNT - 1);
    for (const slide of slides.slice(1)) {
      expect(newestImages.has(slide.image)).toBe(true);
    }
  });

  it("spools into older gallery batches when the newest cannot fill every slot", () => {
    const photo = (id: string, date?: string): GalleryPhoto => ({
      id,
      imageUrl: `/images/${id}.jpg`,
      category: "sunday-services",
      date,
      eventName: id,
    });

    const pool = [
      photo("new-1", "2026-11-01"),
      photo("new-2", "2026-11-01"),
      photo("old-1", "2026-10-25"),
      photo("old-2", "2026-10-25"),
      photo("old-3", "2026-10-25"),
    ];

    const fromPool = buildHeroSlides(pool, 5);
    expect(fromPool).toHaveLength(5);
    expect(fromPool[0]).toEqual(FIRST_HERO_SLIDE);

    const images = fromPool.slice(1).map((slide) => slide.image);
    expect(images.slice(0, 2)).toEqual([
      "/images/new-1.jpg",
      "/images/new-2.jpg",
    ]);
    expect(images.slice(2).every((image) => image.includes("old-"))).toBe(true);
  });

  it("pins a featured handbill after the opener and keeps the carousel length", () => {
    const featured = {
      image: "/images/events/flyer.webp",
      alt: "Event flyer",
      caption: "Sun 1 Nov",
    };

    const withFeatured = buildHeroSlides(undefined, 5, FIRST_HERO_SLIDE, [featured]);
    expect(withFeatured).toHaveLength(5);
    expect(withFeatured[0]).toEqual(FIRST_HERO_SLIDE);
    expect(withFeatured[1]).toEqual(featured);
    expect(new Set(withFeatured.map((slide) => slide.image)).size).toBe(5);
  });

  it("drops a featured handbill after its final day", () => {
    // Asserted per handbill, not by count: several can be live at once, and a
    // count would pass for the wrong reason once one window overlaps another.
    const thanksgiving = (day: string) =>
      getFeaturedHeroSlides(day).some((slide) =>
        slide.image.includes("november-mega-thanksgiving")
      );

    expect(thanksgiving("2026-10-31")).toBe(true);
    expect(thanksgiving("2026-11-01")).toBe(true);
    expect(thanksgiving("2026-11-02")).toBe(false);
  });

  it("keeps the convention handbill up for the whole convention", () => {
    const convention = (day: string) =>
      getFeaturedHeroSlides(day).some((slide) =>
        slide.image.includes("light-convention-2026-hero")
      );

    expect(convention("2026-11-21")).toBe(true);
    expect(convention("2026-12-20")).toBe(true);
    expect(convention("2026-12-21")).toBe(false);
  });

  it("still spools undated gallery photos when nothing carries a date", () => {
    const pool: GalleryPhoto[] = ["a", "b", "c"].map((id) => ({
      id,
      imageUrl: `/images/${id}.jpg`,
      category: "sunday-services",
      eventName: id,
    }));

    const undated = buildHeroSlides(pool, 3);
    expect(undated).toHaveLength(3);
    expect(undated.slice(1).every((slide) => slide.image.startsWith("/images/"))).toBe(
      true
    );
  });
});

describe("handbill slides", () => {
  it("carries every field through to the carousel, including fit", () => {
    const handbill = getFeaturedHeroSlides("2026-11-21").find((slide) =>
      slide.image.includes("light-convention-2026-hero")
    );

    expect(handbill).toBeDefined();
    // Dropping a field in this mapping is invisible until it fails in the
    // browser, so the fit is asserted where it is handed over.
    expect(handbill?.fit).toBe("contain");
  });
});

describe("nextHeroIndex", () => {
  it("walks every slide in order before repeating", () => {
    const length = HERO_SLIDE_COUNT;
    const seen: number[] = [0];
    let index = 0;
    for (let step = 0; step < length - 1; step++) {
      index = nextHeroIndex(index, length);
      seen.push(index);
    }

    // Every slot shown exactly once, in order, with no jump and no repeat.
    expect(seen).toEqual([...Array(length).keys()]);
  });

  it("wraps back to the first slide", () => {
    expect(nextHeroIndex(HERO_SLIDE_COUNT - 1, HERO_SLIDE_COUNT)).toBe(0);
  });

  it("never stalls on the slide already showing", () => {
    for (let current = 0; current < HERO_SLIDE_COUNT; current++) {
      expect(nextHeroIndex(current, HERO_SLIDE_COUNT)).not.toBe(current);
    }
  });

  it("is a no-op when there is nothing to advance to", () => {
    expect(nextHeroIndex(0, 1)).toBe(0);
    expect(nextHeroIndex(0, 0)).toBe(0);
  });
});

describe("the home carousel", () => {
  const slides = buildHomeHeroSlides("2026-11-21");

  it("shows a different photo in every slot", () => {
    const images = slides.map((slide) => slide.image);

    // Duplicated slots read as a hero that only has two or three pictures.
    expect(new Set(images).size).toBe(images.length);
  });

  it("reaches the pinned convention handbill as it advances", () => {
    const handbill = slides.findIndex((slide) =>
      slide.image.includes("light-convention-2026-hero")
    );
    expect(handbill).toBeGreaterThan(0);

    // Sequential advance has to arrive at it, not jump past it.
    let index = 0;
    const visited = new Set<number>();
    for (let step = 0; step < slides.length; step++) {
      visited.add(index);
      index = nextHeroIndex(index, slides.length);
    }
    expect(visited.has(handbill)).toBe(true);
  });
});
