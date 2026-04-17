"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Radio, Volume2, Headphones } from "lucide-react";

export function RadioSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isPlaying] = useState(false);

  return (
    <section id="radio" ref={ref} className="py-28 md:py-36 bg-primary-900">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/20 text-accent-400 text-sm font-medium mb-6">
            <Radio className="w-4 h-4" />
            Hisdayspring Radio
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
            Listen Live 24/7
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Tune in to Hisdayspring Radio for spirit-filled music, worship, and ministry
            broadcasts around the clock.
          </p>
          <div className="w-24 h-1 bg-accent-500 mx-auto rounded-full mt-8" />
        </motion.div>

        {/* Radio Player */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-primary-800 rounded-3xl p-8 md:p-12">
            {/* Station Info */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-accent-500 flex items-center justify-center">
                <Volume2 className="w-8 h-8 text-primary-900" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Hisdayspring Radio
                </h3>
                <p className="text-white/60">Streaming 24/7 from Lagos, Nigeria</p>
              </div>
            </div>

            {/* Now Playing */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/20 text-accent-400 text-sm">
                <Headphones className="w-4 h-4" />
                {isPlaying ? "Now Playing" : "Click Play to Start"}
              </div>
            </div>

            {/* Zeno.fm Embed */}
            <div className="rounded-2xl overflow-hidden bg-black/50">
              <iframe
                src="https://zeno.fm/radio/hisdayspringradio"
                width="100%"
                height="250"
                frameBorder="0"
                scrolling="no"
                allow="autoplay"
                title="Hisdayspring Radio"
                className="w-full"
              />
            </div>

            {/* Listen on other platforms */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://zeno.fm/radio/hisdayspringradio"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors"
              >
                Open in Zeno.fm
              </a>
              <a
                href="https://www.facebook.com/hisdayspring"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors"
              >
                Follow on Facebook
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
