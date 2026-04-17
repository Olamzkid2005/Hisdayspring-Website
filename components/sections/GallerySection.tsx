"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { galleryPhotos, galleryCategories } from "@/data/gallery";
import type { GalleryCategory } from "@/types";

const bentoSizes = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
];

export function GallerySection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | "all">("all");
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const filteredPhotos =
    activeCategory === "all"
      ? galleryPhotos
      : galleryPhotos.filter((photo) => photo.category === activeCategory);

  const bentoPhotos = filteredPhotos.slice(0, 5);

  const goToPrev = () => {
    setSelectedPhoto((prev) =>
      prev === null
        ? filteredPhotos.length - 1
        : (prev - 1 + filteredPhotos.length) % filteredPhotos.length
    );
  };

  const goToNext = () => {
    setSelectedPhoto((prev) =>
      prev === null ? 0 : (prev + 1) % filteredPhotos.length
    );
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const handleLightboxKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowLeft") {
      goToPrev();
    } else if (e.key === "ArrowRight") {
      goToNext();
    }
  };

  return (
    <section id="gallery" ref={ref} className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-16 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-headline text-5xl md:text-6xl text-primary font-bold mb-3">
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

      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-[400px_400px] auto-rows-[250px] md:auto-rows-auto gap-4">
        {bentoPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`group relative rounded-xl overflow-hidden cursor-pointer ${
              bentoSizes[index] || ""
            }`}
            onClick={() => {
              const filteredIndex = filteredPhotos.findIndex(
                (p) => p.id === photo.id
              );
              setSelectedPhoto(filteredIndex >= 0 ? filteredIndex : 0);
            }}
            role="button"
            tabIndex={0}
            aria-label={`View ${photo.caption || photo.eventName || "gallery photo"}`}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { const filteredIndex = filteredPhotos.findIndex((p) => p.id === photo.id); setSelectedPhoto(filteredIndex >= 0 ? filteredIndex : 0); } }}
          >
            <img
              src={photo.imageUrl}
              alt={photo.caption || photo.eventName || "Gallery photo"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 backdrop-blur-sm bg-black/20">
              <p className="text-white text-sm font-medium truncate drop-shadow-md">
                {photo.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex justify-center mt-10"
      >
        <button
          onClick={() => {
            const firstPhoto = filteredPhotos[0];
            if (firstPhoto) {
              const idx = filteredPhotos.findIndex((p) => p.id === firstPhoto.id);
              setSelectedPhoto(idx >= 0 ? idx : 0);
            }
          }}
          className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
        >
          View All Photos
        </button>
      </motion.div>

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
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrev();
                  }}
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-12 h-12 md:w-10 md:h-10" />
                </button>

                <button
                  type="button"
                  className="absolute right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
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
                  className="max-w-5xl max-h-[70vh] mx-4"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  role="img"
                >
                  <img
                    src={filteredPhotos[selectedPhoto].imageUrl}
                    alt={filteredPhotos[selectedPhoto].caption || "Gallery photo"}
                    className="max-w-full max-h-[70vh] object-contain rounded-sm"
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