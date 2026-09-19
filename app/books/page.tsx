import Image from "next/image";
import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { books } from "@/data/books";
import { BackButton } from "@/components/ui";

export const metadata: Metadata = {
  title: "Books",
  description:
    "Books and resources by Pastor Blessing Olamijulo — devotionals, relationship wisdom, and spiritual growth materials.",
};

export default function BooksPage() {
  return (
    <>
      <section className="relative min-h-[45vh] flex items-end overflow-hidden bg-surface-container-low">
        <img
          src="https://images.unsplash.com/photo-1493552152660-f915ab47ae9d?w=1920&q=80"
          alt="Books"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-12 md:pb-16">
          <div className="mb-6">
            <BackButton />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold tracking-wider uppercase mb-6">
            <BookOpen className="w-4 h-4" />
            Resources
          </div>
          <h1 className="font-headline text-4xl md:text-6xl text-white leading-tight">
            Books &amp; Resources
          </h1>
          <p className="text-white/80 text-base md:text-lg mt-4 max-w-2xl leading-relaxed">
            Books and devotionals by Pastor Blessing Olamijulo — written to
            strengthen your faith, build godly relationships, and guide your
            walk with God.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-surface-container-low">
                  <Image
                    src={book.imageUrl}
                    alt={book.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      book.availability === "in-stock"
                        ? "bg-secondary-container text-on-secondary-container"
                        : book.availability === "digital-only"
                          ? "bg-primary-container text-on-primary-container"
                          : "bg-surface-variant text-on-surface-variant"
                    }`}
                  >
                    {book.availability.replace("-", " ")}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="font-headline text-lg text-on-surface leading-snug">
                    {book.title}
                  </h2>
                  <p className="text-secondary font-semibold text-sm mt-1">
                    {book.author}
                  </p>
                  <p className="text-sm text-on-surface-variant mt-3 leading-relaxed flex-1">
                    {book.description}
                  </p>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-outline-variant/30">
                    <span className="font-headline font-bold text-primary">
                      ₦{book.price.toLocaleString()}
                    </span>
                    <a
                      href={book.purchaseUrl ?? "https://pastorblessing.com/shop/"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container hover:text-on-primary transition-colors"
                    >
                      Get Book
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
