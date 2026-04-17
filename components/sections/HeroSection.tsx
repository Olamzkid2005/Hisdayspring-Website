"use client";

import { motion } from "framer-motion";
import { PlayCircle, ChevronDown } from "lucide-react";

export function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(26,28,28,0.4)] to-[rgba(26,28,28,0.8)]" />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
        }} />
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
            className="mb-8"
          >
            <span className="inline-block px-6 py-2.5 rounded-full bg-secondary-container text-on-secondary-container uppercase tracking-widest text-xs font-bold">
              Welcome to Hisdayspring Ministries
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-headline text-4xl md:text-[5rem] leading-tight text-white mb-6"
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
              className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full border-2 border-white/30 text-white font-bold text-sm uppercase tracking-wide backdrop-blur-sm transition-colors hover:bg-white/10"
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
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-white/40" />
        </motion.div>
        <span className="text-white/30 text-[10px] font-label uppercase tracking-widest">Scroll</span>
      </motion.div>
    </section>
  );
}