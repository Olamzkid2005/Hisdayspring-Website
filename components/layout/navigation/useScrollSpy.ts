"use client";

import { useEffect, useState } from "react";

/** Tracks which homepage section is currently under the fixed header. */
export function useScrollSpy(sectionIds: string[], enabled: boolean) {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of [...sectionIds].reverse()) {
        const element = document.getElementById(sectionId);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sectionId);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds, enabled]);

  return activeSection;
}
