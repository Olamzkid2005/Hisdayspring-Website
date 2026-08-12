import type { Metadata } from "next";
import { MinistryDetail } from "@/components/ministry/MinistryDetail";
import { ministries } from "@/data/ministries";

const crusade = ministries.find((m) => m.id === "crusade");

export const metadata: Metadata = {
  title: "Healing From Heaven Crusade",
  description: crusade?.description,
  openGraph: {
    title: "Healing From Heaven Crusade | Hisdayspring Ministries International",
    description: crusade?.description,
    images: crusade?.imageUrl ? [{ url: crusade.imageUrl }] : [],
  },
};

export default function CrusadePage() {
  if (!crusade) return null;
  return <MinistryDetail ministry={crusade} backHref="/" backLabel="Back to Home" showDonateCta />;
}
