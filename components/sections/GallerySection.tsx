"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { galleryPhotos, galleryCategories } from "@/data/gallery";
import type { GalleryCategory } from "@/types";

export function GallerySection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | "all">("all");
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const filteredPhotos =
    activeCategory === "all"
      ? galleryPhotos
      : galleryPhotos.filter((photo) => photo.category === activeCategory);

  const goToPrev = useCallback(() => {
    setSelectedPhoto((prev) =>
      prev === null ? filteredPhotos.length - 1 : (prev - 1 + filteredPhotos.length) % filteredPhotos.length
    );
  }, [filteredPhotos.length]);

  const goToNext = useCallback(() => {
    setSelectedPhoto((prev) =>
      prev === null ? 0 : (prev + 1) % filteredPhotos.length
    );
  }, [filteredPhotos.length]);

  const closeLightbox = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  const handleLightboxKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        goToPrev();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    },
    [closeLightbox, goToPrev, goToNext]
  );

  return (
    <section id="gallery" ref={ref} className="py-28 md:py-36 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            <Camera className="w-4 h-4" />
            Gallery
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-900 mb-6">
            Our Community in Pictures
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Glimpses of worship, fellowship, and special moments at Hisdayspring.
          </p>
          <div className="w-24 h-1 bg-accent-500 mx-auto rounded-full mt-8" />
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-primary-900 text-white"
                : "bg-primary-100 text-primary-700 hover:bg-primary-200"
            }`}
          >
            All Photos
          </button>
          {galleryCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.value
                  ? "bg-primary-900 text-white"
                  : "bg-primary-100 text-primary-700 hover:bg-primary-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filteredPhotos.map((photo, index) => (
            <motion.button
              key={photo.id}
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-primary-100"
              onClick={() => setSelectedPhoto(index)}
              aria-label={`View ${photo.caption || photo.eventName || "gallery photo"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.imageUrl}
                alt={photo.caption || photo.eventName || "Gallery photo"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary-900/0 group-hover:bg-primary-900/40 transition-colors duration-300 flex items-center justify-center">
                <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          onClick={closeLightbox}
          onKeyDown={handleLightboxKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            type="button"
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation */}
          <button
            type="button"
            className="absolute left-4 p-2 text-white/80 hover:text-white transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-10 h-10" />
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
            <ChevronRight className="w-10 h-10" />
          </button>

          {/* Photo */}
          <div
            className="max-w-5xl max-h-[85vh] mx-4"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="img"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={filteredPhotos[selectedPhoto].imageUrl}
              alt={filteredPhotos[selectedPhoto].caption || "Gallery photo"}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
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
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {selectedPhoto + 1} / {filteredPhotos.length}
          </div>
        </div>
      )}
    </section>
  );
}