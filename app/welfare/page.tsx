import type { Metadata } from "next";
import { MinistryDetail } from "@/components/ministry/MinistryDetail";
import { ministries } from "@/data/ministries";
import { cloudinaryLoader } from "@/lib/cdn/cloudinary-loader";

const welfare = ministries.find((m) => m.id === "welfare");

export const metadata: Metadata = {
  title: "Welfare Program",
  description: welfare?.description,
  openGraph: {
    title: "Welfare Program | Hisdayspring Ministries International",
    description: welfare?.description,
    // Social previews must be absolute and live on the CDN: /images is not
    // deployed with the app, so a bare repo path 404s in production.
    images: welfare?.imageUrl
      ? [{ url: cloudinaryLoader({ src: welfare.imageUrl, width: 1200, quality: 75 }) }]
      : [],
  },
  alternates: { canonical: "/welfare" },
};

export default function WelfarePage() {
  if (!welfare) return null;
  return <MinistryDetail ministry={welfare} backHref="/" backLabel="Back to Home" showDonateCta />;
}
