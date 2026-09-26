"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, ChevronDown } from "lucide-react";
import { galleryPhotos } from "@/data/gallery";
import type { GalleryPhoto } from "@/types";

const HERO_COUNT = 12;
/** Slides 1 and 2 are fixed (see below), the rest come from the gallery. */
const HERO_GALLERY_SLIDES = HERO_COUNT - 2;
const FIRST_HERO = "/images/Very good hero.JPG";

/**
 * Permanent second slide: the current flagship event handbill. When the
 * conference has passed, swap this path (and the caption) for whatever is
 * next — the rest of the carousel carries on automatically.
 */
const FEATURED_EVENT_SLIDE = {
  image: "/images/events/greater-works-conference.webp",
  alt: "Greater Works Ministers & Leaders Conference — Making Ministry Impact, 26–27 October 2026",
  caption: "Making Ministry Impact · 26 & 27 October, 9AM",
};

interface HeroSlide {
  image: string;
  alt: string;
  caption?: string;
}

/**
 * Slide 3 onwards: photos spread across the whole gallery.
 *
 * This used to be `galleryPhotos.slice(0, 10)`, which took the first ten
 * entries in file order — ten consecutive frames from one shoot, so the
 * carousel showed the same event over and over and never reached the other
 * 386 photos. Each category is now sampled with an even stride and the
 * categories are then interleaved, so ten slides cover the year's events.
 */
function pickGallerySlides(count: number): GalleryPhoto[] {
  const byCategory = new Map<string, GalleryPhoto[]>();
  for (const photo of galleryPhotos) {
    const bucket = byCategory.get(photo.category);
    if (bucket) bucket.push(photo);
    else byCategory.set(photo.category, [photo]);
  }

  // Split the slots evenly across the categories, then take each category's
  // share with an even stride. The split stops Sunday services crowding out
  // the smaller ministries; the stride stops consecutive slides being
  // neighbouring frames from the same moment, which is what read as one photo
  // on repeat.
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
    // The gallery captions are camera filenames ("U3A7207", "DSC 0358"), which
    // is what a screen reader used to announce. The event name is what the
    // photo actually shows.
    alt: photo.eventName
      ? `${photo.eventName} at Hisdayspring Ministries`
      : "Hisdayspring Ministries",
  };
}

export function HeroSection() {
  const [heroSlides] = useState<HeroSlide[]>(() => [
    { image: FIRST_HERO, alt: "Hisdayspring Ministries" },
    FEATURED_EVENT_SLIDE,
    ...pickGallerySlides(HERO_GALLERY_SLIDES).map(heroSlideFrom),
  ]);
  const [currentImage, setCurrentImage] = useState(0);

  // Auto-advance every 8s to a random slide that is not the one already up.
  // A plain uniform pick landed on the current index about once every twelve
  // ticks, and because the picture is keyed on the index nothing re-rendered —
  // so the carousel silently stalled for 8 seconds. Offsetting by 1..n-1 over
  // the remaining slides keeps it unpredictable but always a change.
  useEffect(() => {
    if (heroSlides.length < 2) return;
    const interval = setInterval(() => {
      setCurrentImage((current) => {
        const offset = 1 + Math.floor(Math.random() * (heroSlides.length - 1));
        return (current + offset) % heroSlides.length;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-surface-container-low">
        {/* No mode="wait": the incoming slide now mounts (and starts loading)
            while the outgoing one fades, instead of waiting out the whole 0.8s
            exit first and showing the backdrop in between. */}
        <AnimatePresence>
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={heroSlides[currentImage].image}
              alt={heroSlides[currentImage].alt}
              fill
              sizes="100vw"
              // The opening slide is the LCP image, so it must not be lazy.
              priority={currentImage === 0}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(26,28,28,0.4)] to-[rgba(26,28,28,0.8)]" />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
        }} />
        {/* Featured-event caption — only while the handbill slide is up. */}
        {heroSlides[currentImage].caption && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:block absolute bottom-16 left-1/2 -translate-x-1/2 z-20 w-full max-w-xl px-4 text-center"
          >
            <span className="inline-block px-5 py-2.5 rounded-full bg-secondary-container/95 text-on-secondary-container text-sm font-bold shadow-lg">
              {heroSlides[currentImage].caption}
            </span>
          </motion.div>
        )}

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              // 24x24 hit area (WCAG 2.5.8); the visible dot stays 8px tall.
              className="-m-2 flex h-6 w-6 items-center justify-center p-2"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentImage}
            >
              <span
                className={`block h-2 rounded-full transition-all ${
                  index === currentImage
                    ? "w-6 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/60"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block mb-8"
          >
            <span className="inline-block px-6 py-2.5 rounded-full bg-secondary-container text-on-secondary-container uppercase tracking-widest text-xs font-bold">
              Welcome to Hisdayspring Ministries
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-headline text-3xl md:text-[5rem] leading-snug md:leading-tight text-white mb-5 md:mb-6"
          >
            Raising holy, healthy and{" "}
            <em className="text-secondary-container">Wealthy People</em>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mb-6 md:mb-10"
          >
            <div className="h-px w-32 bg-secondary origin-center" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => scrollToSection("sermons")}
              className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full bg-secondary-container text-on-secondary-container font-bold text-sm uppercase tracking-wide transition-transform hover:scale-105"
            >
              <PlayCircle className="w-5 h-5" />
              Watch Live Service
            </button>
            <button
              onClick={() => scrollToSection("services")}
              // Only one call to action on a phone (this one returns from md up).
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full border-2 border-white/30 text-white font-bold text-sm uppercase tracking-wide backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              Plan Your Visit
            </button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="hidden md:flex absolute bottom-16 left-1/2 -translate-x-1/2 flex-col items-center gap-2"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-white/40" />
        </motion.div>
        <span className="text-white/65 text-xs font-label uppercase tracking-widest">Scroll</span>
      </motion.div>
    </section>
  );
}