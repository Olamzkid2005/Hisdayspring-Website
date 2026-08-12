import type { Metadata } from "next";
import { MinistryDetail } from "@/components/ministry/MinistryDetail";
import { ministries } from "@/data/ministries";

const welfare = ministries.find((m) => m.id === "welfare");

export const metadata: Metadata = {
  title: "Welfare Program",
  description: welfare?.description,
  openGraph: {
    title: "Welfare Program | Hisdayspring Ministries International",
    description: welfare?.description,
    images: welfare?.imageUrl ? [{ url: welfare.imageUrl }] : [],
  },
};

export default function WelfarePage() {
  if (!welfare) return null;
  return <MinistryDetail ministry={welfare} backHref="/" backLabel="Back to Home" showDonateCta />;
}
