import type { Metadata } from "next";
import { BackButton } from "@/components/ui";
import { PrayerSection } from "@/components/sections";

export const metadata: Metadata = {
  title: "Prayer Requests",
  description:
    "Share your prayer request with Hisdayspring — our team will stand with you in faith. All requests are confidential.",
};

export default function PrayerPage() {
  return (
    <>
      <section className="pt-28 md:pt-32 pb-4 md:pb-8 bg-surface-container-low px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <BackButton />
        </div>
      </section>
      <PrayerSection />
    </>
  );
}
