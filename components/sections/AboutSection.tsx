"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

import { aboutContent, statistics } from "@/data";
import { useCounterAnimation } from "@/hooks";

function AnimatedCounter({
  value,
  suffix = "",
  colorClass,
}: {
  value: number;
  suffix?: string;
  colorClass: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useCounterAnimation(value, isInView, { duration: 3000 });

  return (
    <div ref={ref}>
      <span className={`text-3xl md:text-4xl font-headline ${colorClass}`}>
        {count}
        {suffix}
      </span>
    </div>
  );
}

export function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="py-10 md:py-14 px-6 md:px-12 bg-surface relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      <img
        src="/images/logo/logo crop.jpg"
        alt=""
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 select-none pointer-events-none"
        style={{ width: "clamp(20rem, 40vw, 50rem)", height: "auto", maxWidth: "70vw" }}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 relative">
        <div className="md:col-span-7 grid sm:grid-cols-2 gap-6 md:gap-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-headline text-primary text-lg md:text-2xl mb-2">Our Mission</h2>
            <p className="text-sm md:text-base text-on-surface-variant font-light leading-relaxed">
              {aboutContent.mission}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="font-headline text-secondary text-lg md:text-2xl mb-2">Our Vision</h2>
            <p className="text-sm md:text-base text-on-surface-variant font-light leading-relaxed">
              {aboutContent.vision}
            </p>
          </motion.div>
        </div>

        <div className="hidden md:flex items-stretch">
          <div className="w-px bg-secondary/20 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-secondary/40" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-secondary/40" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-secondary/60" />
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="grid grid-cols-2 gap-4">
            {statistics.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="group bg-surface-container-lowest p-4 md:p-6 rounded-xl flex flex-col justify-center items-center text-center border-l-4 border-transparent hover:border-l-secondary transition-all duration-300"
              >
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  colorClass={index % 2 === 0 ? "text-primary" : "text-secondary"}
                />
                <span className="font-label text-on-surface-variant tracking-widest uppercase text-xs font-bold mt-3">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}