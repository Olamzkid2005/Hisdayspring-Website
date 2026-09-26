"use client";

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  // The extra bottom padding on phones keeps the last footer content clear of
  // the fixed WhatsApp button, which occupies the bottom ~80px from the right
  // edge, so this can't shrink much further without the two colliding.
  return (
    <footer className="bg-surface-container-low w-full pt-7 pb-24 md:py-12 px-4 md:px-8 border-t border-outline-variant/50">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 max-w-7xl mx-auto">
        <span className="text-xl font-semibold text-primary font-headline">
          Hisdayspring
        </span>

        <div className="flex flex-wrap justify-center gap-x-6 md:gap-x-8 gap-y-0 text-sm tracking-wide">
          <Link
            href="/#about"
            className="inline-flex min-h-[44px] items-center text-on-surface-variant hover:text-secondary transition-colors md:min-h-0"
          >
            About
          </Link>
          <Link
            href="/pastors"
            className="inline-flex min-h-[44px] items-center text-on-surface-variant hover:text-secondary transition-colors md:min-h-0"
          >
            Our Pastors
          </Link>
          <Link
            href="/welfare"
            className="inline-flex min-h-[44px] items-center text-on-surface-variant hover:text-secondary transition-colors md:min-h-0"
          >
            Welfare Program
          </Link>
          <Link
            href="/crusade"
            className="inline-flex min-h-[44px] items-center text-on-surface-variant hover:text-secondary transition-colors md:min-h-0"
          >
            Crusade
          </Link>
          <Link
            href="/books"
            className="inline-flex min-h-[44px] items-center text-on-surface-variant hover:text-secondary transition-colors md:min-h-0"
          >
            Books
          </Link>
          <Link
            href="/radio"
            className="inline-flex min-h-[44px] items-center text-on-surface-variant hover:text-secondary transition-colors md:min-h-0"
          >
            Radio Ministry
          </Link>
          <Link
            href="/giving"
            className="inline-flex min-h-[44px] items-center text-on-surface-variant hover:text-secondary transition-colors md:min-h-0"
          >
            Give Online
          </Link>
          <Link
            href="/privacy"
            className="inline-flex min-h-[44px] items-center text-on-surface-variant hover:text-secondary transition-colors md:min-h-0"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="inline-flex min-h-[44px] items-center text-on-surface-variant hover:text-secondary transition-colors md:min-h-0"
          >
            Terms and Conditions
          </Link>
        </div>

        <p className="text-on-surface-variant text-sm tracking-wide">
          &copy; {currentYear} Hisdayspring. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
