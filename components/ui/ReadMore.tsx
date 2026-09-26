"use client";

import { useState, type ReactNode } from "react";

/**
 * Long copy that would otherwise dominate a phone screen.
 *
 * Collapsed to `clamp` lines on mobile with a Read more / Show less toggle, and
 * always fully expanded from `md` up, so desktop reading is unchanged.
 *
 * `clamp` is passed in as a literal Tailwind class (e.g. "line-clamp-6") rather
 * than assembled from a number: Tailwind only emits classes it can find as
 * literal strings in the source, so `line-clamp-${n}` would produce nothing.
 *
 * Accepts either `text` (a single paragraph) or `children` (several paragraphs
 * that should collapse together as one block).
 */
export function ReadMore({
  text,
  children,
  clamp,
  className = "",
  textClassName = "text-on-surface-variant leading-relaxed",
}: {
  text?: string;
  children?: ReactNode;
  /** Literal Tailwind clamp class, e.g. "line-clamp-3". */
  clamp: string;
  className?: string;
  textClassName?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <div className={`${text ? textClassName : ""} ${open ? "" : `${clamp} md:line-clamp-none`}`}>
        {text ? text : children}
      </div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="md:hidden mt-1 inline-flex min-h-[44px] items-center text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors"
      >
        {open ? "Show less" : "Read more"}
      </button>
    </div>
  );
}
