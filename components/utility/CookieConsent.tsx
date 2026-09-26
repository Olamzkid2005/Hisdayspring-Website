"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui";
import type { CookieConsent } from "@/types";

const COOKIE_CONSENT_KEY = "hisdayspring_cookie_consent";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState<CookieConsent | null>(null);

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
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Tighter padding on phones: the card used to cover ~half a 844px screen. */}
            <div className="p-4 md:p-8">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="hidden sm:flex flex-shrink-0 w-12 h-12 rounded-full bg-secondary-container items-center justify-center">
                  <Cookie className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif font-bold text-base md:text-lg text-on-surface">
                      We value your privacy
                    </h3>
                    <button
                      onClick={handleDecline}
                      className="p-1 text-on-surface-variant hover:text-on-surface transition-colors rounded-lg hover:bg-surface-container-low"
                      aria-label="Close cookie banner"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {/* Phones get a single line; the full explanation returns from md
                      up. The banner used to cover ~half an 844px screen. */}
                  <p className="md:hidden text-on-surface-variant text-sm leading-relaxed mb-3">
                    We use cookies to improve your experience.{" "}
                    <Link href="/privacy" className="text-secondary hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                  <p className="hidden md:block text-on-surface-variant text-sm leading-relaxed mb-3 md:mb-4">
                    We use cookies to enhance your browsing experience, serve personalized
                    content, and analyze our traffic. By clicking &quot;Accept&quot;, you consent
                    to our use of cookies. You can manage your preferences or learn more
                    about our cookie use in our{" "}
                    <Link
                      href="/privacy"
                      className="text-secondary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                  {/* One row with short labels on phones, stacked full labels from
                      md up. aria-label keeps the accessible name stable and still
                      contains the visible word (WCAG 2.5.3). */}
                  <div className="flex flex-row sm:gap-3 gap-2">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleAccept}
                      aria-label="Accept all cookies"
                      className="flex-1"
                    >
                      <span className="md:hidden">Accept</span>
                      <span className="hidden md:inline">Accept All Cookies</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={handleDecline}
                      aria-label="Decline non-essential cookies"
                      className="flex-1"
                    >
                      <span className="md:hidden">Decline</span>
                      <span className="hidden md:inline">Decline Non-Essential</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
