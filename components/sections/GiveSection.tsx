"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { HeartHandshake, ArrowRight } from "lucide-react";

export function GiveSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="give" ref={ref} className="py-10 md:py-14 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 md:px-16 md:py-16 text-center"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,white,transparent_45%),radial-gradient(circle_at_80%_80%,white,transparent_45%)]" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <HeartHandshake className="w-10 h-10 md:w-12 md:h-12 text-secondary mx-auto mb-4" />
            <h2 className="font-headline text-3xl md:text-5xl text-on-primary font-bold mb-3">
              Support the Mission
            </h2>
            <p className="text-on-primary/80 text-base md:text-lg mb-8 max-w-xl mx-auto">
              Your generosity fuels the work of God and transforms lives across
              our communities.
            </p>
            <a
              href="/giving"
              className="inline-flex items-center gap-2 px-10 py-4 md:px-14 md:py-5 rounded-full bg-secondary text-on-secondary font-headline font-bold text-lg md:text-xl hover:brightness-110 transition-all shadow-xl shadow-black/20"
            >
              Give Online
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
