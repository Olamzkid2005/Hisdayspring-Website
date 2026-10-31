"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

import { aboutContent } from "@/data";
import { ReadMore } from "@/components/ui";

const EYEBROW =
  "font-label text-xs font-bold uppercase tracking-[0.3em] text-secondary";

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

        {/* Mission and Vision sit side by side across the full width; the
            statistics cards that used to occupy the right-hand columns have
            been removed at the church's request. */}
        <div className="mt-6 grid grid-cols-1 gap-8 md:gap-10">
          <div className="grid gap-6 sm:grid-cols-2 md:gap-8">
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
        </div>
      </div>
    </section>
  );
}
