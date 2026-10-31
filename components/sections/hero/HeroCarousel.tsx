"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui";
import type { HeroSlide } from "@/data/hero";

interface HeroCarouselProps {
  slides: HeroSlide[];
  currentIndex: number;
  /** Index of the last slide whose photo finished decoding. */
  paintedIndex: number;
  onSelect: (index: number) => void;
  onPainted: (index: number) => void;
}

/**
 * The photo backdrop of the hero.
 *
 * The last painted photo stays up as a static underlay so advancing the
 * carousel never uncovers the grey container while the next image downloads.
 */
export function HeroCarousel({
  slides,
  currentIndex,
  paintedIndex,
  onSelect,
  onPainted,
}: HeroCarouselProps) {
  const current = slides[currentIndex];

  return (
    <div className="absolute inset-0 bg-surface-container-low">
      {/* Decorative underlay: the last photo that finished loading. Never
          announced by screen readers, and the same URL the carousel asks for,
          so it costs no extra download. */}
      <Image
        src={slides[paintedIndex].image}
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="w-full h-full object-cover object-center"
      />

      {/* No mode="wait": the incoming slide mounts (and starts loading) while
          the outgoing one fades, instead of waiting out the whole exit first. */}
      <AnimatePresence>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={current.image}
            alt={current.alt}
            fill
            sizes="100vw"
            // The opening slide is the LCP image, so it must not be lazy.
            priority={currentIndex === 0}
            onLoad={() => onPainted(currentIndex)}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-on-surface/40 to-on-surface/80" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Featured-event caption — only while the handbill slide is up. */}
      {current.caption && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden md:block absolute bottom-16 left-1/2 -translate-x-1/2 z-20 w-full max-w-xl px-4 text-center"
        >
          <Badge tone="secondary" className="px-5 py-2.5 text-sm shadow-lg">
            {current.caption}
          </Badge>
        </motion.div>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((slide, index) => (
          <button
            key={`${slide.image}-${index}`}
            onClick={() => onSelect(index)}
            // 24x24 hit area (WCAG 2.5.8); the visible dot stays 8px tall.
            className="-m-2 flex h-6 w-6 items-center justify-center p-2"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex}
          >
            <span
              className={`block h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-6 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
