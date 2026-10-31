"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { NavigationLink } from "@/types";

interface DesktopMenuProps {
  links: NavigationLink[];
  dropdownLinks: NavigationLink[];
  moreLinks: NavigationLink[];
  activeId: string;
  moreIsActive: boolean;
  openDropdown: string | null;
  onOpenDropdown: (id: string | null) => void;
  onNavigateSection: (id: string) => void;
  onNavigateHref: (href: string) => void;
}

export function DesktopMenu({
  links,
  dropdownLinks,
  moreLinks,
  activeId,
  moreIsActive,
  openDropdown,
  onOpenDropdown,
  onNavigateSection,
  onNavigateHref,
}: DesktopMenuProps) {
  return (
    <div className="hidden lg:flex gap-4 xl:gap-7 items-center font-headline text-sm xl:text-base">
      {links.map((link) =>
        link.id === "ministries" ? (
          <div
            key={link.id}
            className="relative"
            onMouseEnter={() => onOpenDropdown(link.id)}
            onMouseLeave={() => onOpenDropdown(null)}
          >
            <button
              onClick={() => onNavigateSection(link.id)}
              className={`flex items-center gap-1 transition-colors whitespace-nowrap ${
                activeId === link.id
                  ? "text-primary font-bold border-b-2 border-secondary pb-1"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {link.label}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  openDropdown === link.id ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {openDropdown === link.id && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant p-2"
                >
                  {dropdownLinks.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onNavigateHref(item.href)}
                      className="block w-full text-left px-4 py-2.5 rounded-lg text-sm text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="my-2 h-px bg-surface-container-low" />
                  <button
                    onClick={() => onNavigateSection("ministries")}
                    className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
                  >
                    View All Ministries →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <button
            key={link.id}
            onClick={() => onNavigateSection(link.id)}
            className={`transition-colors whitespace-nowrap ${
              activeId === link.id
                ? "text-primary font-bold border-b-2 border-secondary pb-1"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {link.label}
          </button>
        )
      )}

      <div
        className="relative"
        onMouseEnter={() => onOpenDropdown("more")}
        onMouseLeave={() => onOpenDropdown(null)}
      >
        <button
          onClick={() => onOpenDropdown("more")}
          className={`flex items-center gap-1 transition-colors whitespace-nowrap ${
            openDropdown === "more" || moreIsActive
              ? "text-primary font-bold border-b-2 border-secondary pb-1"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          More
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              openDropdown === "more" ? "rotate-180" : ""
            }`}
          />
        </button>
        <AnimatePresence>
          {openDropdown === "more" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-3 w-64 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant p-2"
            >
              {moreLinks.slice(0, 2).map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigateHref(item.href)}
                  className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold text-on-surface hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <div className="my-2 h-px bg-surface-container-low" />
              {moreLinks.slice(2).map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigateHref(item.href)}
                  className="block w-full text-left px-4 py-2.5 rounded-lg text-sm text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
