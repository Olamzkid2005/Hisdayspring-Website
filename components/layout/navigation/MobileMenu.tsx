"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { NavigationLink } from "@/types";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: NavigationLink[];
  dropdownLinks: NavigationLink[];
  moreLinks: NavigationLink[];
  activeId: string;
  onNavigateSection: (id: string) => void;
  onNavigateHref: (href: string) => void;
}

export function MobileMenu({
  open,
  onClose,
  links,
  dropdownLinks,
  moreLinks,
  activeId,
  onNavigateSection,
  onNavigateHref,
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        // Above the cookie banner (z-50): the drawer's own Give Online CTA
        // used to sit underneath the banner and was unreachable on first visit.
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-inverse-surface/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(event) => event.stopPropagation()}
            className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-surface-container-lowest shadow-2xl"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-outline-variant">
                <Image
                  src="/images/logo/Logo-Website.png"
                  alt="Hisdayspring"
                  width={128}
                  height={32}
                  className="h-8 w-auto"
                />
                <button
                  onClick={onClose}
                  className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                {links.map((link, index) =>
                  link.id === "ministries" ? (
                    <div key={link.id}>
                      <motion.button
                        onClick={() => onNavigateSection(link.id)}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`block w-full text-left px-6 py-4 text-base font-medium border-b border-outline-variant/20 transition-colors font-headline ${
                          activeId === link.id
                            ? "text-primary font-bold bg-primary/5"
                            : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                        }`}
                      >
                        {link.label}
                      </motion.button>
                      {dropdownLinks.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => onNavigateHref(item.href)}
                          className="block w-full text-left px-10 py-3 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low border-b border-outline-variant/20 transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <motion.button
                      key={link.id}
                      onClick={() => onNavigateSection(link.id)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`block w-full text-left px-6 py-4 text-base font-medium border-b border-outline-variant/20 transition-colors font-headline ${
                        activeId === link.id
                          ? "text-primary font-bold bg-primary/5"
                          : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                      }`}
                    >
                      {link.label}
                    </motion.button>
                  )
                )}

                <div>
                  <div className="block w-full text-left px-6 py-4 text-base font-medium border-b border-outline-variant/20 font-headline text-on-surface-variant">
                    More
                  </div>
                  {moreLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => onNavigateHref(link.href)}
                      className="block w-full text-left px-10 py-3 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low border-b border-outline-variant/20 transition-colors"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-outline-variant">
                <button
                  onClick={() => onNavigateSection("giving")}
                  className="block w-full bg-primary text-on-primary px-6 py-3 rounded-full font-medium text-center hover:brightness-110 transition-all min-h-[44px]"
                >
                  Give Online
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
