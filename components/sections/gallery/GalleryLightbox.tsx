"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryPhoto } from "@/types";

interface GalleryLightboxProps {
  photos: GalleryPhoto[];
  selectedIndex: number | null;
  loadedPhoto: string | null;
  onLoaded: (photoId: string) => void;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
}

export function GalleryLightbox({
  photos,
  selectedIndex,
  loadedPhoto,
  onLoaded,
  onClose,
  onPrev,
  onNext,
  onKeyDown,
}: GalleryLightboxProps) {
  const currentPhotoId =
    selectedIndex === null ? null : photos[selectedIndex]?.id ?? null;
  const lightboxLoaded =
    currentPhotoId !== null && loadedPhoto === currentPhotoId;

  return (
    <AnimatePresence>
      {selectedIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          onClick={onClose}
          onKeyDown={onKeyDown}
          tabIndex={0}
        >
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-shrink-0 h-[8vh] md:h-[10vh] bg-black" />

            <div className="flex-1 relative flex items-center justify-center min-h-0">
              <button
                type="button"
                className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
                onClick={onClose}
                aria-label="Close lightbox"
              >
                <X className="w-10 h-10 md:w-8 md:h-8" />
              </button>

              <button
                type="button"
                className="absolute left-4 p-2 text-white/80 hover:text-white transition-colors z-10"
                onClick={(event) => {
                  event.stopPropagation();
                  onPrev();
                }}
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-12 h-12 md:w-10 md:h-10" />
              </button>

              <button
                type="button"
                className="absolute right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
                onClick={(event) => {
                  event.stopPropagation();
                  onNext();
                }}
                aria-label="Next photo"
              >
                <ChevronRight className="w-12 h-12 md:w-10 md:h-10" />
              </button>

              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-5xl h-[70vh] mx-4 flex flex-col items-center justify-center"
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
              >
                {/* Deliberately not role="img": that role makes its children
                    presentational, which would hide the caption below from
                    assistive technology while still leaving the photo itself
                    unnamed. The photo is decorative; the caption carries the
                    meaning. */}
                {!lightboxLoaded && (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  </div>
                )}
                {/* Same reasoning as the grid: the caption and event name are
                    printed under the photo, so this image is decorative. */}
                <Image
                  src={photos[selectedIndex].imageUrl}
                  alt=""
                  fill
                  sizes="100vw"
                  onLoad={() => {
                    if (currentPhotoId) onLoaded(currentPhotoId);
                  }}
                  className={`object-contain rounded-sm transition-opacity duration-300 ${
                    lightboxLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />
                {(photos[selectedIndex].caption ||
                  photos[selectedIndex].eventName) && (
                  <div className="text-center mt-4">
                    <p className="text-white font-medium">
                      {photos[selectedIndex].eventName}
                    </p>
                    {photos[selectedIndex].caption && (
                      <p className="text-white/60 text-sm">
                        {photos[selectedIndex].caption}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                {selectedIndex + 1} / {photos.length}
              </div>
            </div>

            <div className="flex-shrink-0 h-[8vh] md:h-[10vh] bg-black" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
