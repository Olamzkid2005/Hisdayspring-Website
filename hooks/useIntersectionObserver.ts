"use client";

import { useState, useEffect, useRef, type RefObject } from "react";

export interface IntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
}

/**
 * Hook to observe when an element enters or leaves the viewport
 * Returns isIntersecting boolean
 */
export function useIntersectionObserver(
  options: IntersectionObserverOptions = {}
): [RefObject<HTMLDivElement | null>, boolean] {
  const { threshold = 0.1, rootMargin = "0px", root = null } = options;

  const ref = useRef<HTMLDivElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, root]);

  return [ref, isIntersecting];
}

/**
 * Simplified hook that returns a ref and triggers a callback when visible
 */
export function useOnVisible(
  callback: () => void,
  options: IntersectionObserverOptions = {}
): RefObject<HTMLDivElement | null> {
  const { threshold = 0.1, rootMargin = "0px", root = null } = options;

  const ref = useRef<HTMLDivElement | null>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          callback();
        }
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [callback, threshold, rootMargin, root]);

  return ref;
}
