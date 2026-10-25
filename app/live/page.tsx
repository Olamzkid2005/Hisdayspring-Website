import type { Metadata } from "next";
import { BackButton } from "@/components/ui";
import { LiveStreamSection } from "@/components/sections";

export const metadata: Metadata = {
  title: "Live Stream",
  description:
    "Watch Hisdayspring services live on YouTube — Sunday services at 8am, 10am, or 12noon, and special events.",
};

export default function LivePage() {
  return (
    <>
      <section className="pt-28 md:pt-32 pb-8 md:pb-12 bg-surface-container-low px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <BackButton variant="light" />
          {/* The page opened with a bare back button and half a screen of empty
              band, and had no h1 at all. This is the page's heading. */}
          <h1 className="font-headline mt-6 max-w-3xl text-3xl text-on-surface md:mt-8 md:text-5xl">
            Join our live service
          </h1>
          <p className="mt-3 max-w-2xl text-on-surface-variant md:text-lg">
            Worship with us live every Sunday at 8am, 10am and 12noon (Lagos
            time) — wherever you are.
          </p>
        </div>
      </section>
      <LiveStreamSection />
    </>
  );
}
