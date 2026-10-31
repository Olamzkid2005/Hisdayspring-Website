"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryPhoto } from "@/types";

const bentoSizes = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
];

interface GalleryGridProps {
  photos: GalleryPhoto[];
  isInView: boolean;
  onOpen: (photoId: string) => void;
  onViewAll: () => void;
}

export function GalleryGrid({
  photos,
  isInView,
  onOpen,
  onViewAll,
}: GalleryGridProps) {
  const bentoPhotos = photos.slice(0, 5);

  return (
    <>
      {/** ---- Bento grid with crossfade shuffle ---- */}
      {/* Two photos per row on a phone (four tiles) — a single 190px column of
          five photos was over a thousand pixels of scrolling on its own. */}
      <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-[400px_400px] auto-rows-[150px] md:auto-rows-auto gap-3 md:gap-4">
        {bentoPhotos.map((photo, index) => (
          <div
            key={`slot-${index}`}
            className={`group relative rounded-xl overflow-hidden cursor-pointer ${
              index === 4 ? "hidden md:block" : ""
            } ${bentoSizes[index] || ""}`}
            onClick={() => onOpen(photo.id)}
            role="button"
            tabIndex={0}
            aria-label={`View ${photo.caption || "gallery photo"}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onOpen(photo.id);
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                {/* The caption is rendered as visible text on this tile and
                    the tile is labelled "View <caption>", so repeating it as
                    alt text makes a screen reader announce it twice. */}
                <Image
                  src={photo.imageUrl}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </motion.div>
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
        className="flex justify-center mt-6 md:mt-8"
      >
        <button
          onClick={onViewAll}
          className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
        >
          View All Photos
        </button>
      </motion.div>
    </>
  );
}
