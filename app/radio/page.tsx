import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLink, Radio } from "lucide-react";
import { BackButton } from "@/components/ui";

export const metadata: Metadata = {
  title: "Hisdayspring Radio",
  description:
    "Broadcasting Life and Hope to the Ends of the Earth — listen to Hisdayspring Radio on Zeno.fm, streaming 24/7.",
};

export default function RadioPage() {
  return (
    <>
      <section className="relative min-h-[60vh] flex items-end overflow-hidden bg-surface-container-low">
        {/* Served through next/image + the Cloudinary loader (WebP/AVIF at the
            right width) instead of the raw 1920px Unsplash JPEG. */}
        <Image
          src="https://images.unsplash.com/photo-1478739273407-adb4b0981f27?w=1920&q=80"
          alt="Hisdayspring Radio"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-12 md:pb-16">
          <div className="mb-6">
            <BackButton />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold tracking-wider uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Live Broadcast
          </div>
          <h1 className="font-headline text-4xl md:text-6xl text-white leading-tight">
            Hisdayspring Radio
          </h1>
          <p className="text-white/80 text-base md:text-lg mt-4 max-w-2xl leading-relaxed">
            Broadcasting Life and Hope to the Ends of the Earth — streaming 24/7.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-surface-container-low">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-sm border border-outline-variant/20 text-center">
            <div className="inline-flex items-center gap-3 mx-auto">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <Radio className="w-6 h-6 text-on-secondary" />
              </div>
              <div className="text-left">
                <p className="font-headline text-xl text-on-surface font-bold">
                  Hisdayspring Radio
                </p>
                <p className="text-on-surface-variant text-sm">
                  Streaming 24/7 on Zeno.fm
                </p>
              </div>
            </div>

            <div className="mt-10 bg-surface-container-low rounded-2xl p-6 md:p-8 border border-outline-variant/20">
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                Click the button below to open the live stream on Zeno.fm and
                listen to the broadcast from anywhere in the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://zeno.fm/radio/hisdayspringradio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-on-primary rounded-full font-medium hover:bg-primary-container hover:text-on-primary transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  Open in Zeno.fm
                </a>
                <a
                  href="https://www.facebook.com/hisdayspring"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-outline-variant text-on-surface rounded-full font-medium hover:bg-white transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  Follow on Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
