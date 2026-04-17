"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import type { Testimonial } from "@/types";

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="px-4 py-8">
      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg h-full">
        <Quote className="w-12 h-12 text-accent-500/30 mb-6" />
        <p className="text-primary-900 text-lg md:text-xl leading-relaxed mb-8">
          &ldquo;{testimonial.testimony}&rdquo;
        </p>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-200 flex items-center justify-center">
            <span className="text-primary-700 font-bold text-xl">
              {testimonial.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-bold text-primary-900">{testimonial.name}</div>
            {testimonial.date && (
              <div className="text-muted text-sm">
                {new Date(testimonial.date).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section id="testimonials" ref={ref} className="py-28 md:py-36 bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-100 text-accent-700 text-sm font-medium mb-6">
            <Quote className="w-4 h-4" />
            Testimonies
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-900 mb-6">
            What God Has Done
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Hear from members of our community about how God has transformed their lives.
          </p>
          <div className="w-24 h-1 bg-accent-500 mx-auto rounded-full mt-8" />
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Testimonials */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goToPrev}
              className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-primary-700 hover:bg-primary-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-8 bg-accent-500"
                      : "bg-primary-300 hover:bg-primary-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-primary-700 hover:bg-primary-50 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
