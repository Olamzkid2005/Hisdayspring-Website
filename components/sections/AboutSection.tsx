"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

import { aboutContent, statistics } from "@/data";
import { ReadMore } from "@/components/ui/ReadMore";
import { useCounterAnimation } from "@/hooks";

const EYEBROW =
  "font-label text-xs font-bold uppercase tracking-[0.3em] text-secondary";
const STAT_LABEL =
  "font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant";

function AnimatedCounter({
  value,
  suffix = "",
  className = "",
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const count = useCounterAnimation(value, isInView, { duration: 2200 });

  return (
    <span ref={ref} className={className}>
      {count}
      {suffix}
    </span>
  );
}

export function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: isInView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.55, delay },
  });

  return (
    <section
      id="about"
      ref={ref}
      className="relative overflow-hidden bg-surface px-6 py-8 md:px-12 md:py-14"
    >
      {/* Corner mark rather than a centred watermark: the crest art is only
          144x150, so at full width it was the softest thing on the page, and
          dead centre put it straight under the Vision copy. */}
      <Image
        src="/images/logo/logo crop.jpg"
        alt=""
        aria-hidden="true"
        width={800}
        height={400}
        sizes="(max-width: 768px) 40vw, 30vw"
        className="pointer-events-none absolute right-0 bottom-0 hidden w-[clamp(14rem,28vw,30rem)] translate-x-1/4 translate-y-1/4 object-contain opacity-[0.08] select-none md:block"
      />

      <div className="relative mx-auto max-w-7xl">
        <motion.p {...reveal()} className={EYEBROW}>
          Who we are
        </motion.p>

        {/* 7 + 5 = 12. This used to be 7 + 1 (divider) + 5 = 13, which pushed the
            stat cards onto a second row under Mission only and left the divider
            floating beside Vision with nothing to divide. */}
        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
          <div className="grid gap-6 sm:grid-cols-2 md:col-span-7 md:gap-8 md:border-r md:border-outline-variant/50 md:pr-10">
            <motion.div {...reveal(0.05)}>
              <span className="mb-3 block h-0.5 w-8 bg-primary/60" />
              <h2 className="font-headline mb-2 text-lg text-primary md:text-2xl">
                Our Mission
              </h2>
              <ReadMore
                text={aboutContent.mission}
                clamp="line-clamp-2"
                textClassName="text-sm md:text-base text-on-surface-variant font-light leading-relaxed"
              />
            </motion.div>

            <motion.div {...reveal(0.1)}>
              <span className="mb-3 block h-0.5 w-8 bg-secondary/60" />
              <h2 className="font-headline mb-2 text-lg text-secondary md:text-2xl">
                Our Vision
              </h2>
              <ReadMore
                text={aboutContent.vision}
                clamp="line-clamp-2"
                textClassName="text-sm md:text-base text-on-surface-variant font-light leading-relaxed"
              />
            </motion.div>
          </div>

          <div className="flex items-center md:col-span-5">
            <div className="grid w-full grid-cols-2 gap-4">
              {statistics.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  {...reveal(0.2 + index * 0.08)}
                  className="group flex flex-col items-center justify-center rounded-xl bg-surface-container-lowest p-4 text-center shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:ring-primary/20 md:p-6"
                >
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    className={`font-headline text-3xl md:text-4xl ${
                      index % 2 === 0 ? "text-primary" : "text-secondary"
                    }`}
                  />
                  <span className={`mt-3 ${STAT_LABEL}`}>{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
