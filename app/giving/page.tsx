import type { Metadata } from "next";
import GivingClient from "./GivingClient";

export const metadata: Metadata = {
  title: "Give Online",
  description:
    "Give your tithes, offerings, seeds and donations online to Hisdayspring Evangelical Ministries International — securely by card or bank transfer.",
};

export default function GivingPage() {
  return <GivingClient />;
}
