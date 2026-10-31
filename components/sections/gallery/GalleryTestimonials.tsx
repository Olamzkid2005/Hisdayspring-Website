"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";

const featuredTestimonials = testimonials.slice(0, 3);

interface GalleryTestimonialsProps {
  isInView: boolean;
}

export function GalleryTestimonials({ isInView }: GalleryTestimonialsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-10 md:mt-20"
    >
      <div className="text-center mb-4 md:mb-8">
        {/* The heading doubles as the link to the full page of testimonies,
            which was reachable only from the sitemap before. */}
        <h3 className="font-headline text-2xl md:text-4xl text-on-surface">
          <Link
            href="/testimonials"
            className="transition-colors hover:text-primary"
          >
            Divine Encounters
          </Link>
        </h3>
        <p className="text-on-surface-variant mt-2 max-w-2xl mx-auto text-sm md:text-base">
          Hear how God has transformed lives through His Power and Grace.
        </p>
      </div>
      {/* Phones swipe through the testimonies in one row (every card stays
          reachable) instead of stacking three of them down the page. */}
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-2 -mx-6 px-6 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
        {featuredTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
            className={`w-[85%] flex-none snap-start p-4 md:w-auto md:p-6 rounded-2xl ${
              index % 2 === 0
                ? "bg-surface-container-lowest shadow-sm border border-outline-variant/20"
                : "bg-primary text-on-primary"
            }`}
          >
            <Quote
              className={`w-6 h-6 mb-2 md:w-8 md:h-8 md:mb-3 ${
                index % 2 === 0 ? "text-primary/20" : "text-white/40"
              }`}
            />
            <p
              className={`text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-4 ${
                index % 2 === 0 ? "text-on-surface" : "text-on-primary/90"
              }`}
            >
              &ldquo;{testimonial.testimony}&rdquo;
            </p>
            <p
              className={`mt-3 md:mt-4 text-sm font-bold ${
                index % 2 === 0 ? "text-primary" : "text-white"
              }`}
            >
              {testimonial.name}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
