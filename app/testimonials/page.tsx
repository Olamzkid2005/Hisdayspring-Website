import type { Metadata } from "next";
import { BackButton } from "@/components/ui";
import { TestimonialsSection } from "@/components/sections";

export const metadata: Metadata = {
  title: "Testimonies",
  description:
    "Divine Encounters — hear how God has transformed lives through His Power and Grace at Hisdayspring.",
};

export default function TestimonialsPage() {
  return (
    <>
      <section className="pt-28 md:pt-32 pb-4 md:pb-8 bg-surface-container-low px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <BackButton />
        </div>
      </section>
      <TestimonialsSection />
    </>
  );
}
