"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { ministries } from "@/data";
import type { Ministry } from "@/types";

const gradientOverlays = [
  "from-primary/90",
  "from-secondary/90",
  "from-primary/90",
  "from-secondary/90",
  "from-primary/90",
  "from-secondary/90",
  "from-primary/90",
  "from-secondary/90",
];

const topLevelMinistryIds = ["welfare", "crusade"];

function ministryHref(id: string) {
  return topLevelMinistryIds.includes(id) ? `/${id}` : `/ministries/${id}`;
}

function MinistryCard({ ministry, index }: { ministry: Ministry; index: number }) {
  const stagger = index % 2 === 1;
  const src = ministry.imageUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`flex-none w-[280px] md:w-80 snap-center ${stagger ? "mt-12" : ""}`}
    >
      <Link
        href={ministryHref(ministry.id)}
        aria-label={`Learn more about ${ministry.name}`}
        className="block h-[300px] md:h-[400px] relative rounded-2xl overflow-hidden group focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        {src ? (
          <img
            src={src}
            alt={ministry.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-on-surface-variant to-on-surface flex items-center justify-center">
            <Users className="w-16 h-16 text-white/30" />
          </div>
        )}
        <div className={`absolute inset-0 bg-gradient-to-t ${gradientOverlays[index % gradientOverlays.length]} to-transparent`} />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-headline text-2xl text-white mb-2">
            {ministry.name}
          </h3>
          <p className="text-white/80 text-sm line-clamp-3">
            {ministry.description}
          </p>
          <span className="inline-flex items-center gap-2 mt-4 text-white/90 text-sm font-semibold opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            Learn More <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function MinistriesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="ministries" ref={ref} className="max-w-7xl mx-auto px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h2 className="font-headline text-3xl md:text-5xl text-on-surface mb-4">Our Ministries</h2>
        <p className="text-on-surface-variant max-w-2xl mx-auto">
          Join one of our vibrant ministries and discover your place in the body of Christ.
        </p>
      </motion.div>

      <div className="flex gap-4 md:gap-8 overflow-x-auto pb-6 md:pb-8 snap-x hide-scrollbar">
        {ministries.map((ministry, index) => (
          <MinistryCard key={ministry.id} ministry={ministry} index={index} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mt-8"
      >
        <a
          href="https://wa.me/2348077829444?text=Hello, I would like to join one of the ministries at Hisdayspring"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-on-primary rounded-full font-medium hover:bg-primary-container hover:text-on-primary transition-colors"
        >
          Contact Us on WhatsApp
        </a>
      </motion.div>
    </section>
  );
}
