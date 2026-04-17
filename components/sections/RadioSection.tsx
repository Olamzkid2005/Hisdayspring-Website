"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Radio, ExternalLink } from "lucide-react";

export function RadioSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-16 px-4 md:py-24 md:px-8">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1478739273407-adb4b0981f27?w=1920&q=80')" }}
      />
      <div className="absolute inset-0 bg-primary/70" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-2xl mx-auto"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="p-8 md:p-10 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="uppercase tracking-widest text-xs font-bold text-white/90">
                Live Broadcast
              </span>
            </div>

            <h2 className="font-headline text-2xl md:text-4xl text-white mb-2">
              Hisdayspring Radio
            </h2>

            <p className="text-white/80 mb-6">
              Broadcasting Life and Hope to the Ends of the Earth
            </p>

            <div className="inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <Radio className="w-5 h-5 text-on-primary" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-sm">Hisdayspring Radio</p>
                <p className="text-white/60 text-xs">Streaming 24/7</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10">
            <iframe
              src="https://zeno.fm/radio/hisdayspringradio"
              width="100%"
              height="150"
              scrolling="no"
              allow="autoplay"
              title="Hisdayspring Radio"
              className="w-full border-0"
            />
          </div>
        </div>

        <div className="flex gap-3 md:gap-6 mt-6">
          <a
            href="https://zeno.fm/radio/hisdayspringradio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open in Zeno.fm
          </a>
          <a
            href="https://www.facebook.com/hisdayspring"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Follow on Facebook
          </a>
        </div>
      </motion.div>
    </section>
  );
}