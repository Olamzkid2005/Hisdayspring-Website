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
      <section className="pt-28 md:pt-32 pb-4 md:pb-8 bg-surface-container-low px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <BackButton />
        </div>
      </section>
      <LiveStreamSection />
    </>
  );
}
