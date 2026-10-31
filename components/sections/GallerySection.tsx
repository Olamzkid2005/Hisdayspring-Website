"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react";
import { motion, useInView } from "framer-motion";
import { galleryPhotos } from "@/data/gallery";
import { shuffleArray } from "@/lib/shuffle";
import type { GalleryCategory } from "@/types";
import { GalleryFilter } from "./gallery/GalleryFilter";
import { GalleryGrid } from "./gallery/GalleryGrid";
import { GalleryTestimonials } from "./gallery/GalleryTestimonials";
import { GalleryLightbox } from "./gallery/GalleryLightbox";

/** Once-only client detection; there is nothing to subscribe to. */
const subscribeToNothing = () => () => {};
const trueOnClient = () => true;
const falseOnServer = () => false;

export function GallerySection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | "all">(
    "all"
  );
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  /** Id of the photo the lightbox has finished loading. */
  const [loadedPhoto, setLoadedPhoto] = useState<string | null>(null);
  const [shuffleTick, setShuffleTick] = useState(0);

  // False during SSR and the hydration render, true afterwards. The shuffle is
  // random, so running it on the server would produce a different order than
  // the client and the grid markup would not match on hydration.
  const isClient = useSyncExternalStore(
    subscribeToNothing,
    trueOnClient,
    falseOnServer
  );

  const filteredPhotos = useMemo(
    () =>
      activeCategory === "all"
        ? galleryPhotos
        : galleryPhotos.filter((photo) => photo.category === activeCategory),
    [activeCategory]
  );

  // Derived rather than mirrored into state: re-derives on mount, when the
  // category changes, and on every tick of the interval below.
  const shuffledPhotos = useMemo(
    () => (isClient ? shuffleArray(filteredPhotos, shuffleTick) : []),
    [isClient, filteredPhotos, shuffleTick]
  );

  // Auto-shuffle every 8 seconds while in view.
  useEffect(() => {
    if (!isInView || filteredPhotos.length <= 5) return;
    const interval = setInterval(
      () => setShuffleTick((tick) => tick + 1),
      8000
    );
    return () => clearInterval(interval);
  }, [isInView, filteredPhotos]);

  const goToPrev = useCallback(() => {
    setSelectedPhoto((prev) =>
      prev === null
        ? filteredPhotos.length - 1
        : (prev - 1 + filteredPhotos.length) % filteredPhotos.length
    );
  }, [filteredPhotos.length]);

  const goToNext = useCallback(() => {
    setSelectedPhoto((prev) =>
      prev === null ? 0 : (prev + 1) % filteredPhotos.length
    );
  }, [filteredPhotos.length]);

  const closeLightbox = () => setSelectedPhoto(null);

  const handleLightboxKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") closeLightbox();
    else if (event.key === "ArrowLeft") goToPrev();
    else if (event.key === "ArrowRight") goToNext();
  };

  const openFilteredIndex = (photoId: string) => {
    const index = filteredPhotos.findIndex((photo) => photo.id === photoId);
    setSelectedPhoto(index >= 0 ? index : 0);
  };

  return (
    <section
      id="gallery"
      ref={ref}
      className="py-10 md:py-16 px-6 md:px-12 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-end mb-5 md:mb-10 gap-5 md:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-headline text-3xl md:text-5xl text-primary font-bold mb-2 md:mb-3">
            Moments of Grace
          </h2>
          <p className="text-on-surface-variant text-base md:text-lg">
            Glimpses of worship, fellowship, and special moments at Hisdayspring.
          </p>
        </motion.div>

        <GalleryFilter
          activeCategory={activeCategory}
          isInView={isInView}
          onChange={setActiveCategory}
        />
      </div>

      <GalleryGrid
        photos={shuffledPhotos}
        isInView={isInView}
        onOpen={openFilteredIndex}
        onViewAll={() => {
          const first = filteredPhotos[0];
          if (first) openFilteredIndex(first.id);
        }}
      />

      <GalleryTestimonials isInView={isInView} />

      <GalleryLightbox
        photos={filteredPhotos}
        selectedIndex={selectedPhoto}
        loadedPhoto={loadedPhoto}
        onLoaded={setLoadedPhoto}
        onClose={closeLightbox}
        onPrev={goToPrev}
        onNext={goToNext}
        onKeyDown={handleLightboxKeyDown}
      />
    </section>
  );
}
