"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navigationLinks } from "@/data/navigation";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationLinks.map((link) => link.id);
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections.reverse()) {
        const element = document.getElementById(sectionId);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sectionId);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md">
        <div className="flex justify-between items-center px-4 md:px-8 py-4 max-w-screen-2xl mx-auto">
          <button
            onClick={() => scrollToSection("home")}
            className="text-2xl font-bold tracking-tight text-rose-700 font-headline"
          >
            Hisdayspring
          </button>

          <div className="hidden md:flex gap-8 items-center font-headline text-lg font-medium">
            {navigationLinks.slice(0, 8).map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`transition-colors ${
                  activeSection === link.id
                    ? "text-rose-700 font-bold border-b-2 border-amber-500 pb-1"
                    : "text-zinc-600 hover:text-rose-600"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:block">
            <button
              onClick={() => scrollToSection("give")}
              className="bg-primary text-on-primary px-6 py-2 rounded-full font-medium hover:brightness-110 transition-all min-h-[44px]"
            >
              Give Online
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-3 text-zinc-600 hover:text-rose-600 transition-colors relative z-50 pointer-events-auto touch-manipulation"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-zinc-950/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-zinc-100">
                  <span className="text-xl font-bold tracking-tight text-rose-700 font-headline">
                    Hisdayspring
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-zinc-600 hover:text-rose-600 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                  {navigationLinks.map((link, index) => (
                    <motion.button
                      key={link.id}
                      onClick={() => scrollToSection(link.id)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`block w-full text-left px-6 py-4 text-base font-medium border-b border-zinc-50 transition-colors font-headline ${
                        activeSection === link.id
                          ? "text-rose-700 font-bold bg-rose-50"
                          : "text-zinc-600 hover:text-rose-600 hover:bg-zinc-50"
                      }`}
                    >
                      {link.label}
                    </motion.button>
                  ))}
                </div>

                <div className="p-6 border-t border-zinc-100">
                  <button
                    onClick={() => scrollToSection("give")}
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
    </>
  );
}
