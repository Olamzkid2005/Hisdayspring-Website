import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { BackButton } from "@/components/ui";
import BooksClient from "./BooksClient";

export const metadata: Metadata = {
  title: "Books",
  description:
    "Books and devotionals by Pastor Blessing Olamijulo — order online, pick up in church or download PDF copies.",
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
            Books and devotionals by Pastor Blessing Olamijulo — order online
            and pick up in church, or get instant PDF copies.
          </p>
        </div>
      </section>

      <BooksClient />
    </>
  );
}
