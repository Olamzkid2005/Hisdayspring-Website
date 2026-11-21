import type { Metadata } from "next";
import Image from "next/image";
import { BackButton } from "@/components/ui";
import { TestimonialsSection, TestimonySection } from "@/components/sections";

/**
 * Testimonies — photo hero, form, then the wall of testimonies.
 *
 * The church QR code lands here, so the form sits directly under the hero with
 * nothing between it and the visitor. The hero carries the page's h1 and a
 * "Back to Home" button, which is the same thing every other photo-led page
 * does (radio, books, pastors) — the navigation bar alone was too quiet an exit
 * for a page someone arrives on by scanning a code.
 *
 * One h1 for the page ("Testimonies"); the form and the wall are both h2.
 * /testify redirects here (next.config.ts).
 */
export const metadata: Metadata = {
  title: "Testimonies",
  description:
    "What God has done at Hisdayspring, told by the people He did it for. Share your own testimony and it opens in WhatsApp, ready to send to our team.",
  alternates: { canonical: "/testimonials" },
};

export default function TestimonialsPage() {
  return (
    <>
      <section className="relative min-h-[32vh] md:min-h-[46vh] flex items-end overflow-hidden bg-surface-container-low">
        {/* A real Sunday-service photo from the gallery CDN, not a stock image:
            this page is about what God has done in this church. Served through
            next/image + the Cloudinary loader so it arrives as WebP/AVIF. */}
        {/* The photo is a backdrop, not the subject. Its own opacity plus a
            lighter brand overlay (60% instead of 75%) keeps the congregation
            visible as texture without competing with the heading — at 50%
            image opacity the photo disappeared and the hero read as the flat
            burgundy block this page is meant to replace. */}
        <Image
          src="/images/gallery/DSC01089.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-primary/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 pt-[88px] md:pt-32 pb-6 md:pb-14">
          <div className="mb-6">
            <BackButton label="Back to Home" />
          </div>
          <h1 className="font-headline text-3xl md:text-6xl text-white leading-tight">
            Testimonies
          </h1>
          <p className="text-white/85 text-sm md:text-lg mt-2.5 md:mt-4 max-w-2xl leading-snug md:leading-relaxed">
            What God has done in this house, told by the people He did it for.
            Add yours below.
          </p>
        </div>
      </section>

      <TestimonySection />
      <TestimonialsSection />
    </>
  );
}
