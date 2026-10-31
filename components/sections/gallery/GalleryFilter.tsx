"use client";

import { motion } from "framer-motion";
import { galleryCategories } from "@/data/gallery";
import type { GalleryCategory } from "@/types";

interface GalleryFilterProps {
  activeCategory: GalleryCategory | "all";
  isInView: boolean;
  onChange: (category: GalleryCategory | "all") => void;
}

export function GalleryFilter({
  activeCategory,
  isInView,
  onChange,
}: GalleryFilterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15 }}
      // Phones get one scrollable row of filters instead of four wrapped rows
      // that pushed the photos off the screen.
      className="flex w-full flex-nowrap items-center gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-1 -mx-6 px-6 md:mx-0 md:w-auto md:flex-wrap md:gap-3 md:overflow-visible md:px-0 md:pb-0"
    >
      <button
        onClick={() => onChange("all")}
        className={`inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap px-4 md:px-6 py-2 rounded-full text-sm font-medium transition-colors ${
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
          onClick={() => onChange(cat.value)}
          className={`inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap px-4 md:px-6 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === cat.value
              ? "bg-primary text-on-primary"
              : "bg-surface-container-low text-on-surface-variant"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </motion.div>
  );
}
