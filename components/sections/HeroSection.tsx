"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlayCircle, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui";
import { buildHeroSlides } from "@/lib/hero-slides";
import { HeroCarousel } from "./hero/HeroCarousel";

export function HeroSection() {
  const [heroSlides] = useState(() => buildHeroSlides());
  const [currentImage, setCurrentImage] = useState(0);
  // Index of the last slide whose photo actually decoded. It is painted as a
  // static underlay, so when the carousel advances the previous photo stays up
  // while the next one downloads — otherwise the crossfade uncovers the grey
  // container and the hero looks empty for however long the image takes.
  const [paintedImage, setPaintedImage] = useState(0);

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
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <HeroCarousel
        slides={heroSlides}
        currentIndex={currentImage}
        paintedIndex={paintedImage}
        onSelect={setCurrentImage}
        onPainted={setPaintedImage}
      />

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
            <Badge
              tone="secondary"
              uppercase
              className="px-6 py-2.5 tracking-widest"
            >
              Welcome to Hisdayspring Ministries
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-headline text-3xl md:text-[5rem] leading-snug md:leading-tight text-white mb-5 md:mb-6"
          >
            Raising holy, healthy and{" "}
            <span className="text-secondary-container">Wealthy People</span>
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
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full border-2 border-white/20 text-white font-bold text-sm uppercase tracking-wide backdrop-blur-sm transition-colors hover:bg-white/20"
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
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 2.4,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-6 h-6 text-white/40" />
        </motion.div>
        <span className="text-white/60 text-xs font-label uppercase tracking-widest">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
