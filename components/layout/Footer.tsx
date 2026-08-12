"use client";

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-50 w-full py-8 md:py-12 px-4 md:px-8 border-t border-zinc-200/50">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
        <span className="text-xl font-semibold text-rose-700 font-headline">
          Hisdayspring
        </span>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm tracking-wide">
          <Link
            href="/#about"
            className="text-zinc-500 hover:text-amber-600 transition-colors"
          >
            About
          </Link>
          <Link
            href="/pastors"
            className="text-zinc-500 hover:text-amber-600 transition-colors"
          >
            Our Pastors
          </Link>
          <Link
            href="/welfare"
            className="text-zinc-500 hover:text-amber-600 transition-colors"
          >
            Welfare Program
          </Link>
          <Link
            href="/crusade"
            className="text-zinc-500 hover:text-amber-600 transition-colors"
          >
            Crusade
          </Link>
          <Link
            href="/books"
            className="text-zinc-500 hover:text-amber-600 transition-colors"
          >
            Books
          </Link>
          <Link
            href="/radio"
            className="text-zinc-500 hover:text-amber-600 transition-colors"
          >
            Radio Ministry
          </Link>
          <Link
            href="/giving"
            className="text-zinc-500 hover:text-amber-600 transition-colors"
          >
            Give Online
          </Link>
          <Link
            href="/privacy"
            className="text-zinc-500 hover:text-amber-600 transition-colors"
          >
            Privacy Policy
          </Link>
        </div>

        <p className="text-zinc-500 text-sm tracking-wide">
          &copy; {currentYear} Hisdayspring. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
