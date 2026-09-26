import type { Metadata, Viewport } from "next";
import { Noto_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { CookieConsent } from "@/components/utility/CookieConsent";
import { Analytics } from "@vercel/analytics/react";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-headline",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1c1c" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://hisdayspring.org"),
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
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Hisdayspring Ministries International — Raising holy, healthy and wealthy people",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hisdayspring Ministries International",
    description:
      "Raising holy, healthy and wealthy people with a sense of dominion and world evangelism.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: "Hisdayspring Ministries International",
    description:
      "Raising holy, healthy and wealthy people with a sense of dominion and world evangelism by the power of the Holy Spirit.",
    url: "https://hisdayspring.org",
    telephone: "+234-906-619-2155",
    email: "hello@hisdayspring.org",
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: "Plot 200, 21 Road, Beside Faith Academy, Gate Bus Stop, Gowon Estate",
        addressLocality: "Ipaja",
        addressRegion: "Lagos",
        postalCode: "100278",
        addressCountry: "NG",
      },
    ],
    worshipTime: "Sundays 8:00am & 10:30am",
    sameAs: [
      "https://facebook.com/hisdayspring",
      "https://instagram.com/hisdayspring",
      "https://youtube.com/@hisdayspring",
    ],
  };

  return (
    <html lang="en" className={`${notoSerif.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-screen flex flex-col antialiased font-body">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:rounded-full focus:bg-primary focus:text-on-primary focus:font-bold"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navigation />
        <main id="main-content" className="flex-1 pt-24">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
