/**
 * Builds the hero carousel's slide list.
 *
 * The opening slide is fixed. Every other slot is filled from the gallery
 * pool with the newest shoot first: adding a batch with a later date puts it
 * into the rotation immediately and pushes older photos out. The picker only
 * reaches back to earlier dates when the newest batch cannot fill the
 * remaining slots.
 *
 * Within a date batch the photos are sampled with an even stride and shared
 * across categories, so consecutive slides are not neighbouring frames from
 * the same moment. Entries are de-duplicated by image URL, and the opening
 * slide's image is never repeated.
 */

import { galleryPhotos } from "@/data/gallery";
import {
  FIRST_HERO_SLIDE,
  HERO_SLIDE_COUNT,
  getFeaturedHeroSlides,
  type HeroSlide,
} from "@/data/hero";
import { lagosToday } from "@/lib/lagos-time";
import type { GalleryPhoto } from "@/types";

/**
 * Sample `count` photos from one pool: every category gets a share of the
 * slots and an even stride through its photos, then the categories are
 * interleaved so consecutive slides alternate ministries.
 */
function pickSpread(photos: GalleryPhoto[], count: number): GalleryPhoto[] {
  if (count <= 0 || photos.length === 0) return [];

  const byCategory = new Map<string, GalleryPhoto[]>();
  for (const photo of photos) {
    const bucket = byCategory.get(photo.category);
    if (bucket) bucket.push(photo);
    else byCategory.set(photo.category, [photo]);
  }

  const categories = [...byCategory.values()];
  const share = Math.floor(count / categories.length);
  const remainder = count % categories.length;

  const buckets = categories.map((group, index) => {
    const take = Math.min(share + (index < remainder ? 1 : 0), group.length);
    return Array.from({ length: take }, (_, i) =>
      group[Math.floor((i * group.length) / take)]
    );
  });

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

/**
 * Fill `count` slots from the newest date batches first, walking back through
 * the dates only for whatever the newest batch could not fill. Undated photos
 * come last.
 */
function pickNewest(photos: GalleryPhoto[], count: number): GalleryPhoto[] {
  const byDate = new Map<string, GalleryPhoto[]>();
  const undated: GalleryPhoto[] = [];

  for (const photo of photos) {
    if (!photo.date) {
      undated.push(photo);
      continue;
    }
    const bucket = byDate.get(photo.date);
    if (bucket) bucket.push(photo);
    else byDate.set(photo.date, [photo]);
  }

  const picks: GalleryPhoto[] = [];
  for (const date of [...byDate.keys()].sort((a, b) => b.localeCompare(a))) {
    if (picks.length >= count) break;
    picks.push(...pickSpread(byDate.get(date) ?? [], count - picks.length));
  }

  if (picks.length < count) {
    picks.push(...pickSpread(undated, count - picks.length));
  }

  return picks;
}

function pickGallerySlides(
  pool: readonly GalleryPhoto[],
  count: number,
  excludedImages: ReadonlySet<string>
): GalleryPhoto[] {
  // One entry per image, skipping anything an earlier slide already shows.
  const seenImages = new Set(excludedImages);
  const available: GalleryPhoto[] = [];
  for (const photo of pool) {
    if (seenImages.has(photo.imageUrl)) continue;
    seenImages.add(photo.imageUrl);
    available.push(photo);
  }

  return pickNewest(available, count);
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

export function buildHeroSlides(
  pool: readonly GalleryPhoto[] = galleryPhotos,
  count: number = HERO_SLIDE_COUNT,
  first: HeroSlide = FIRST_HERO_SLIDE,
  featured: readonly HeroSlide[] = []
): HeroSlide[] {
  const pinned = featured
    .filter((slide) => slide.image !== first.image)
    .slice(0, Math.max(0, count - 1));
  const excluded = new Set([first.image, ...pinned.map((slide) => slide.image)]);

  return [
    first,
    ...pinned,
    ...pickGallerySlides(pool, count - 1 - pinned.length, excluded).map(
      heroSlideFrom
    ),
  ];
}

/** The carousel the homepage renders, including any date-windowed handbills. */
export function buildHomeHeroSlides(today: string = lagosToday()): HeroSlide[] {
  return buildHeroSlides(
    galleryPhotos,
    HERO_SLIDE_COUNT,
    FIRST_HERO_SLIDE,
    getFeaturedHeroSlides(today)
  );
}
