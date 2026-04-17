"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Book, ExternalLink } from "lucide-react";
import { books } from "@/data/books";

function BookCard({ book, index }: { book: typeof books[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      {/* Cover */}
      <div className="aspect-[3/4] bg-primary-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-primary-300 flex items-center justify-center">
          <Book className="w-16 h-16 text-primary-500/30" />
        </div>
        {/* Price badge */}
        <div className="absolute top-3 right-3 px-3 py-1 bg-accent-500 text-primary-900 text-sm font-bold rounded-full">
          ₦{book.price.toLocaleString()}
        </div>
        {/* Format badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {book.format === "physical" && (
            <span className="px-2 py-1 bg-white/90 text-primary-900 text-xs rounded-full">
              Physical
            </span>
          )}
          {book.format === "ebook" && (
            <span className="px-2 py-1 bg-white/90 text-primary-900 text-xs rounded-full">
              E-book
            </span>
          )}
          {book.format === "both" && (
            <>
              <span className="px-2 py-1 bg-white/90 text-primary-900 text-xs rounded-full">
                Physical
              </span>
              <span className="px-2 py-1 bg-accent-500/90 text-primary-900 text-xs rounded-full">
                E-book
              </span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-serif font-bold text-lg text-primary-900 mb-1 line-clamp-2 group-hover:text-accent-600 transition-colors">
          {book.title}
        </h3>
        <p className="text-muted text-sm mb-3">by {book.author}</p>
        <p className="text-muted/80 text-sm line-clamp-3 mb-4">{book.description}</p>

        <a
          href={book.purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-900 text-white text-sm font-medium rounded-full hover:bg-primary-800 transition-colors"
        >
          Buy Now
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}

export function BooksSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="books" ref={ref} className="py-28 md:py-36 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            <Book className="w-4 h-4" />
            Resources
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-900 mb-6">
            Books & Resources
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Transform your life with books written by Pastor Blessing Olamijulo on faith,
            prosperity, leadership, and more.
          </p>
          <div className="w-24 h-1 bg-accent-500 mx-auto rounded-full mt-8" />
        </motion.div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book, index) => (
            <BookCard key={book.id} book={book} index={index} />
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="https://pastorblessing.com/shop/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-900 text-white rounded-full font-medium hover:bg-primary-800 transition-colors"
          >
            View All Resources at pastorblessing.com
            <ExternalLink className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
