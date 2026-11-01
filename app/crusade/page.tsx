import type { Metadata } from "next";
import { MinistryDetail } from "@/components/ministry/MinistryDetail";
import { ministries } from "@/data/ministries";
import { cloudinaryLoader } from "@/lib/cdn/cloudinary-loader";

const crusade = ministries.find((m) => m.id === "crusade");

export const metadata: Metadata = {
  title: "Healing From Heaven Crusade",
  description: crusade?.description,
  openGraph: {
    title: "Healing From Heaven Crusade | Hisdayspring Ministries International",
    description: crusade?.description,
    // Social previews must be absolute and live on the CDN: /images is not
    // deployed with the app, so a bare repo path 404s in production.
    images: crusade?.imageUrl
      ? [{ url: cloudinaryLoader({ src: crusade.imageUrl, width: 1200, quality: 75 }) }]
      : [],
  },
  alternates: { canonical: "/crusade" },
};

export default function CrusadePage() {
  if (!crusade) return null;
  return <MinistryDetail ministry={crusade} backHref="/" backLabel="Back to Home" showDonateCta />;
}
