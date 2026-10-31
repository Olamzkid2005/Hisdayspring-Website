/**
 * Builds the hero carousel's slide list.
 *
 * The previous version sampled `galleryPhotos.slice(0, 10)`, which took ten
 * consecutive frames from one shoot and never reached the other photos. Slides
 * are now spread across the whole gallery: each category gets a share of the
 * slots and an even stride through its photos, then the categories are
 * interleaved so consecutive slides alternate ministries.
 *
 * Photos used by the fixed opening slides are excluded from the pick, and the
 * remaining gallery entries are de-duplicated by image URL: four of the recent
 * service photos also live in the gallery data, and the carousel must not show
 * the same photo twice in one rotation.
 */

import { galleryPhotos } from "@/data/gallery";
import {
  FEATURED_EVENT_SLIDE,
  FIRST_HERO_SLIDE,
  HERO_SLIDE_COUNT,
  RECENT_HERO_SLIDES,
  type HeroSlide,
} from "@/data/hero";
import type { GalleryPhoto } from "@/types";

/** Slides 1 and 2 are fixed, the rest come from the gallery. */
const HERO_GALLERY_SLIDES = HERO_SLIDE_COUNT - 2;

function pickGallerySlides(
  count: number,
  excludedImages: ReadonlySet<string>
): GalleryPhoto[] {
  // One entry per image, skipping anything an earlier slide already shows.
  const seenImages = new Set(excludedImages);
  const available: GalleryPhoto[] = [];
  for (const photo of galleryPhotos) {
    if (seenImages.has(photo.imageUrl)) continue;
    seenImages.add(photo.imageUrl);
    available.push(photo);
  }

  const byCategory = new Map<string, GalleryPhoto[]>();
  for (const photo of available) {
    const bucket = byCategory.get(photo.category);
    if (bucket) bucket.push(photo);
    else byCategory.set(photo.category, [photo]);
  }

  const categories = [...byCategory.values()];
  const share = Math.floor(count / categories.length);
  const remainder = count % categories.length;

  const buckets = categories.map((photos, index) => {
    const take = Math.min(share + (index < remainder ? 1 : 0), photos.length);
    return Array.from({ length: take }, (_, i) =>
      photos[Math.floor((i * photos.length) / take)]
    );
  });

  // One from each category in turn, so the order alternates ministries rather
  // than playing three Sunday services back to back.
  const picks: GalleryPhoto[] = [];
  for (let round = 0; picks.length < count; round++) {
    let tookOne = false;
    for (const bucket of buckets) {
      if (picks.length >= count) break;
      if (round < bucket.length) {
        picks.push(bucket[round]);
        tookOne = true;
      }
    }
    if (!tookOne) break;
  }
  return picks;
}

function heroSlideFrom(photo: GalleryPhoto): HeroSlide {
  return {
    image: photo.imageUrl,
    // Gallery captions are camera filenames ("U3A7207", "DSC 0358"); the event
    // name is what the photo actually shows to a screen reader.
    alt: photo.eventName
      ? `${photo.eventName} at Hisdayspring Ministries`
      : "Hisdayspring Ministries",
  };
}

export function buildHeroSlides(): HeroSlide[] {
  const fixedSlides = [
    FIRST_HERO_SLIDE,
    FEATURED_EVENT_SLIDE,
    ...RECENT_HERO_SLIDES,
  ];
  const fixedImages = new Set(fixedSlides.map((slide) => slide.image));

  return [
    ...fixedSlides,
    ...pickGallerySlides(
      HERO_GALLERY_SLIDES - RECENT_HERO_SLIDES.length,
      fixedImages
    ).map(heroSlideFrom),
  ];
}
