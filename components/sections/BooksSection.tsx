"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { books } from "@/data/books";

const coverGradients = [
  "from-primary to-primary-container",
  "from-secondary to-secondary-container",
  "from-primary-container to-primary",
];

function BookCover({ title, index }: { title: string; index: number }) {
  const gradient = coverGradients[index % coverGradients.length];

  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-6 relative overflow-hidden`}>
      <div className="w-3/4 h-px bg-white/20 mb-6" />
      <h4 className="font-serif text-white text-center text-lg leading-snug drop-shadow-lg relative z-10">
        {title}
      </h4>
      <div className="w-3/4 h-px bg-white/20 mt-6" />
    </div>
  );
}

export function BooksSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="books" ref={ref} className="py-16 max-w-7xl mx-auto px-4 md:py-24 md:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-secondary font-bold tracking-[0.2em] uppercase mb-3">
            Publications
          </p>
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-on-surface">
            The Written Word
          </h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-md text-on-surface-variant italic leading-relaxed"
        >
          Transform your life with anointed books on faith, prosperity,
          leadership, and divine purpose — written by Pastor Blessing Olamijulo.
        </motion.p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-16">
        {books.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group"
          >
            <div className="aspect-[3/4] bg-surface-container rounded-xl overflow-hidden mb-6 relative">
              <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
                <BookCover title={book.title} index={index} />
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <a
                  href={book.purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-primary px-6 py-2 rounded-full font-bold transition-transform scale-95 group-hover:scale-100"
                >
                  Add to Cart
                </a>
              </div>
              <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-secondary-container/90 backdrop-blur-sm text-secondary px-3 py-1 rounded-full text-sm font-bold">
                ₦{book.price.toLocaleString()}
              </div>
            </div>
            <h3 className="font-bold text-lg leading-tight mb-1 text-on-surface group-hover:text-primary transition-colors">
              {book.title}
            </h3>
            <p className="text-secondary font-bold">
              ₦{book.price.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mt-16"
      >
        <a
          href="https://pastorblessing.com/shop/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded-full font-bold hover:bg-primary/90 transition-colors"
        >
          View All Resources
          <ArrowRight className="w-4 h-4" />
        </a>
      </motion.div>
    </section>
  );
}
