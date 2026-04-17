"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
      <span className="text-primary font-bold text-lg">{name.charAt(0)}</span>
    </div>
  );
}

function CardLight({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="bg-surface-container-lowest p-4 sm:p-8 rounded-xl shadow-sm relative">
      <Quote className="absolute top-4 left-4 w-10 h-10 text-primary opacity-20" />
      <p className="italic text-lg text-on-surface mb-6 leading-relaxed pl-2 pt-4">
        &ldquo;{testimonial.testimony}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <Avatar name={testimonial.name} />
        <div>
          <p className="font-bold text-on-surface">{testimonial.name}</p>
          {testimonial.date && (
            <p className="text-sm text-on-surface-variant">
              {new Date(testimonial.date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function CardBrand({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="bg-primary text-on-primary p-4 sm:p-8 rounded-xl">
      <p className="italic text-lg leading-relaxed mb-6 opacity-90">
        &ldquo;{testimonial.testimony}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <Avatar name={testimonial.name} />
        <div>
          <p className="font-bold">{testimonial.name}</p>
          {testimonial.date && (
            <p className="text-sm opacity-70">
              {new Date(testimonial.date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const cardVariants = [CardLight, CardBrand];

const col1 = [0, 3, 6].filter((i) => i < testimonials.length);
const col2 = [1, 4, 7].filter((i) => i < testimonials.length);
const col3 = [2, 5].filter((i) => i < testimonials.length);

export function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" ref={ref} className="bg-surface-container-high py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-on-surface mb-4">
            Divine Encounters
          </h2>
          <p className="text-zinc-500 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Hear from members of our community about how God has transformed their lives
            through His Power and Grace.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6">
            {col1.map((idx, cardIdx) => {
              const Card = cardVariants[cardIdx % cardVariants.length];
              return (
                <motion.div
                  key={testimonials[idx].id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: cardIdx * 0.1 }}
                >
                  <Card testimonial={testimonials[idx]} />
                </motion.div>
              );
            })}
          </div>

          <div className="space-y-6 md:mt-12">
            {col2.map((idx, cardIdx) => {
              const Card = cardVariants[cardIdx % cardVariants.length];
              return (
                <motion.div
                  key={testimonials[idx].id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: cardIdx * 0.1 }}
                >
                  <Card testimonial={testimonials[idx]} />
                </motion.div>
              );
            })}
          </div>

          <div className="space-y-6">
            {col3.map((idx, cardIdx) => {
              const Card = cardVariants[cardIdx % cardVariants.length];
              return (
                <motion.div
                  key={testimonials[idx].id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: cardIdx * 0.1 }}
                >
                  <Card testimonial={testimonials[idx]} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}