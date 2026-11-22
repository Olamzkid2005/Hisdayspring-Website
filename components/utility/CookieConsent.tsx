"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui";
import type { CookieConsent } from "@/types";

const COOKIE_CONSENT_KEY = "hisdayspring_cookie_consent";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user has already made a choice
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!storedConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    } else {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setConsent(JSON.parse(storedConsent));
      }, 0);
    }
  }, []);

  // The banner is pinned to the bottom of the viewport, which is also where
  // other CTAs live (the floating book checkout bar). Publish its height as a
  // CSS variable so those CTAs can sit above it instead of being covered.
  useEffect(() => {
    if (!showBanner) return;
    const banner = bannerRef.current;
    if (!banner) return;

    const root = document.documentElement;
    const syncOffset = () => {
      const height = Math.ceil(banner.getBoundingClientRect().height);
      if (height > 0) {
        root.style.setProperty("--consent-banner-offset", `${height + 16}px`);
      }
    };

    syncOffset();
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(syncOffset);
    observer?.observe(banner);
    window.addEventListener("resize", syncOffset);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", syncOffset);
      root.style.removeProperty("--consent-banner-offset");
    };
  }, [showBanner]);

  const handleAccept = () => {
    const newConsent: CookieConsent = {
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    setConsent(newConsent);
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent));
    setShowBanner(false);
  };

  const handleDecline = () => {
    const newConsent: CookieConsent = {
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    setConsent(newConsent);
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent));
    setShowBanner(false);
  };

  if (!showBanner || consent) {
    return null;
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          ref={bannerRef}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          role="region"
          aria-labelledby="cookie-consent-title"
          className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 md:px-6 md:pb-5"
        >
          {/* One bar: a short line of text and two buttons, stacked on phones
              and in a single row from sm up. The previous panel was a centred
              card half a phone screen tall, which buried whatever was under it. */}
          <div className="mx-auto flex max-w-3xl flex-col gap-2 rounded-xl border border-black/5 bg-white px-3 py-2.5 shadow-lg sm:flex-row sm:items-center sm:gap-4 sm:px-4 sm:py-3">
            <h3 id="cookie-consent-title" className="sr-only">
              We value your privacy
            </h3>
            <Cookie
              className="hidden h-5 w-5 shrink-0 text-secondary sm:block"
              aria-hidden
            />
            <p className="min-w-0 flex-1 text-xs leading-snug text-on-surface-variant sm:text-sm">
              {/* Beside two buttons, the long sentence wrapped to three lines on
                  a 390px phone. Stacked above them, the short one stays on one. */}
              <span className="sm:hidden">We use cookies. </span>
              <span className="hidden sm:inline">
                We use cookies to improve your experience.{" "}
              </span>
              <Link
                href="/privacy"
                className="font-medium text-secondary hover:underline"
              >
                Privacy Policy
              </Link>
            </p>
            {/* Short labels at every width: the accessible names below carry
                the full intent, and still contain the visible word (WCAG 2.5.3). */}
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleAccept}
                aria-label="Accept all cookies"
                className="flex-1 sm:flex-none"
              >
                Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecline}
                aria-label="Decline non-essential cookies"
                className="flex-1 sm:flex-none"
              >
                Decline
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
