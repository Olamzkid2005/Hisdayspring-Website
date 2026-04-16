import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { CookieConsent } from "@/components/utility/CookieConsent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Hisdayspring Ministries International",
    template: "%s | Hisdayspring Ministries International",
  },
  description:
    "Raising holy, healthy and wealthy people with a sense of dominion and world evangelism by the power of the Holy Spirit. Join us at Hisdayspring Evangelical Ministries International.",
  keywords: [
    "church",
    "ministry",
    "Lagos",
    "Nigeria",
    "Pentecostal",
    "Hisdayspring",
    "Christian",
    "worship",
  ],
  authors: [{ name: "Hisdayspring Ministries International" }],
  creator: "Hisdayspring Ministries International",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Hisdayspring Ministries International",
    title: "Hisdayspring Ministries International",
    description:
      "Raising holy, healthy and wealthy people with a sense of dominion and world evangelism.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hisdayspring Ministries International",
    description:
      "Raising holy, healthy and wealthy people with a sense of dominion and world evangelism.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <CookieConsent />
      </body>
    </html>
  );
}
