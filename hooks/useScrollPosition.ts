"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface ScrollPosition {
  scrollY: number;
  isScrolled: boolean;
}

/**
 * Hook to track scroll position with debouncing
 * Returns scrollY value and isScrolled boolean (scrollY > threshold)
 */
export function useScrollPosition(threshold: number = 50): ScrollPosition {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    scrollY: 0,
    isScrolled: false,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback(() => {
    // Debounce the scroll event
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const scrollY = window.scrollY;
      setScrollPosition({
        scrollY,
        isScrolled: scrollY > threshold,
      });
    }, 10);
  }, [threshold]);

  useEffect(() => {
    // Set initial position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleScroll]);

  return scrollPosition;
}
