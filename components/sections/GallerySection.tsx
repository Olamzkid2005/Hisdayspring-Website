"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { galleryPhotos, galleryCategories } from "@/data/gallery";
import { testimonials } from "@/data/testimonials";
import type { GalleryCategory } from "@/types";

const featuredTestimonials = testimonials.slice(0, 3);

const bentoSizes = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
];

/** Fisher-Yates shuffle – returns a new array. */
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function GallerySection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | "all">("all");
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [lightboxLoaded, setLightboxLoaded] = useState(false);
  const [shuffledPhotos, setShuffledPhotos] = useState<typeof galleryPhotos>([]);

  const filteredPhotos =
    activeCategory === "all"
      ? galleryPhotos
      : galleryPhotos.filter((photo) => photo.category === activeCategory);

  // Seed shuffled on mount and when category changes
  useEffect(() => {
    setShuffledPhotos(shuffleArray(filteredPhotos));
  }, [filteredPhotos]);

  // Auto-shuffle every 8 seconds while in view
  useEffect(() => {
    if (!isInView || filteredPhotos.length <= 5) return;
    const interval = setInterval(() => {
      setShuffledPhotos(shuffleArray(filteredPhotos));
    }, 8000);
    return () => clearInterval(interval);
  }, [isInView, filteredPhotos]);

  const bentoPhotos = shuffledPhotos.slice(0, 5);

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

  const handleLightboxKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") goToPrev();
    else if (e.key === "ArrowRight") goToNext();
  };

  const openFilteredIndex = (photoId: string) => {
    const idx = filteredPhotos.findIndex((p) => p.id === photoId);
    setSelectedPhoto(idx >= 0 ? idx : 0);
    setLightboxLoaded(false);
  };

  // Reset loading state when lightbox photo changes
  useEffect(() => {
    setLightboxLoaded(false);
  }, [selectedPhoto]);

  return (
    <section id="gallery" ref={ref} className="py-12 md:py-16 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-10 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-headline text-3xl md:text-5xl text-primary font-bold mb-3">
            Moments of Grace
          </h2>
          <p className="text-on-surface-variant text-lg">
            Glimpses of worship, fellowship, and special moments at Hisdayspring.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap gap-3"
        >
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-primary text-on-primary"
                : "bg-surface-container-low text-on-surface-variant"
            }`}
          >
            All
          </button>
          {galleryCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.value
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface-variant"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>
      </div>

      {/** ---- Bento grid with crossfade shuffle ---- */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-[400px_400px] auto-rows-[250px] md:auto-rows-auto gap-4">
        {bentoPhotos.map((photo, index) => (
          <div
            key={`slot-${index}`}
            className={`group relative rounded-xl overflow-hidden cursor-pointer ${
              bentoSizes[index] || ""
            }`}
            onClick={() => openFilteredIndex(photo.id)}
            role="button"
            tabIndex={0}
            aria-label={`View ${photo.caption || "gallery photo"}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openFilteredIndex(photo.id);
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={photo.id}
                src={photo.imageUrl}
                alt={photo.caption || "Gallery photo"}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </AnimatePresence>
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Caption bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 backdrop-blur-sm bg-black/20">
              <p className="text-white text-sm font-medium truncate drop-shadow-md">
                {photo.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/** ---- View All trigger ---- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex justify-center mt-8"
      >
        <button
          onClick={() => {
            const first = filteredPhotos[0];
            if (first) openFilteredIndex(first.id);
          }}
          className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
        >
          View All Photos
        </button>
      </motion.div>

      {/** ---- Testimonials strip ---- */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-14 md:mt-20"
      >
        <div className="text-center mb-8">
          <h3 className="font-headline text-2xl md:text-4xl text-on-surface">
            Divine Encounters
          </h3>
          <p className="text-on-surface-variant mt-2 max-w-2xl mx-auto text-sm md:text-base">
            Hear how God has transformed lives through His Power and Grace.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {featuredTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`p-5 md:p-6 rounded-2xl ${
                index % 2 === 0
                  ? "bg-surface-container-lowest shadow-sm border border-outline-variant/20"
                  : "bg-primary text-on-primary"
              }`}
            >
              <Quote
                className={`w-8 h-8 mb-3 ${
                  index % 2 === 0 ? "text-primary/20" : "text-white/30"
                }`}
              />
              <p
                className={`text-sm md:text-base leading-relaxed line-clamp-4 ${
                  index % 2 === 0 ? "text-on-surface" : "text-on-primary/90"
                }`}
              >
                &ldquo;{testimonial.testimony}&rdquo;
              </p>
              <p
                className={`mt-4 text-sm font-bold ${
                  index % 2 === 0 ? "text-primary" : "text-white"
                }`}
              >
                {testimonial.name}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/** ---- Lightbox ---- */}
      <AnimatePresence>
        {selectedPhoto !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
            onClick={closeLightbox}
            onKeyDown={handleLightboxKeyDown}
            tabIndex={0}
          >
            <div className="absolute inset-0 flex flex-col">
              <div className="flex-shrink-0 h-[8vh] md:h-[10vh] bg-black" />

              <div className="flex-1 relative flex items-center justify-center min-h-0">
                <button
                  type="button"
                  className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
                  onClick={closeLightbox}
                  aria-label="Close lightbox"
                >
                  <X className="w-10 h-10 md:w-8 md:h-8" />
                </button>

                <button
                  type="button"
                  className="absolute left-4 p-2 text-white/80 hover:text-white transition-colors z-10"
                  onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-12 h-12 md:w-10 md:h-10" />
                </button>

                <button
                  type="button"
                  className="absolute right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
                  onClick={(e) => { e.stopPropagation(); goToNext(); }}
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-12 h-12 md:w-10 md:h-10" />
                </button>

                <motion.div
                  key={selectedPhoto}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-5xl max-h-[70vh] mx-4 flex flex-col items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  role="img"
                >
                  {!lightboxLoaded && (
                    <div className="flex items-center justify-center py-20">
                      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                  <img
                    src={filteredPhotos[selectedPhoto].imageUrl}
                    alt={filteredPhotos[selectedPhoto].caption || "Gallery photo"}
                    onLoad={() => setLightboxLoaded(true)}
                    className={`max-w-full max-h-[70vh] object-contain rounded-sm transition-opacity duration-300 ${
                      lightboxLoaded ? "opacity-100" : "opacity-0 absolute"
                    }`}
                  />
                  {(filteredPhotos[selectedPhoto].caption ||
                    filteredPhotos[selectedPhoto].eventName) && (
                    <div className="text-center mt-4">
                      <p className="text-white font-medium">
                        {filteredPhotos[selectedPhoto].eventName}
                      </p>
                      {filteredPhotos[selectedPhoto].caption && (
                        <p className="text-white/60 text-sm">
                          {filteredPhotos[selectedPhoto].caption}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                  {selectedPhoto + 1} / {filteredPhotos.length}
                </div>
              </div>

              <div className="flex-shrink-0 h-[8vh] md:h-[10vh] bg-black" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
