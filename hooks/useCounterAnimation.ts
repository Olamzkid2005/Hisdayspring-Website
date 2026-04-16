"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface UseCounterAnimationOptions {
  duration?: number; // Animation duration in ms
  startOnMount?: boolean;
  easing?: (t: number) => number; // Easing function
}

/**
 * Easing function - ease out expo
 */
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Hook to animate a counter from 0 to a target value
 * Triggers animation when the trigger value becomes true
 */
export function useCounterAnimation(
  target: number,
  trigger: boolean,
  options: UseCounterAnimationOptions = {}
): number {
  const { duration = 2000, easing = easeOutExpo } = options;

  const [count, setCount] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const triggerRef = useRef<boolean>(trigger);
  const hasAnimatedRef = useRef<boolean>(false);

  // Track if we should reset
  const shouldResetRef = useRef<boolean>(false);

  const animate = useCallback(() => {
    hasAnimatedRef.current = true;
    startTimeRef.current = performance.now();

    const step = (currentTime: number) => {
      if (!startTimeRef.current) return;

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);

      setCount(Math.floor(easedProgress * target));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(step);
      }
    };

    animationRef.current = requestAnimationFrame(step);
  }, [target, duration, easing]);

  // Handle animation trigger
  useEffect(() => {
    // If trigger becomes true and we haven't animated yet (or were reset)
    if (trigger && !hasAnimatedRef.current) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [trigger, animate]);

  // Update trigger ref and signal reset if needed
  useEffect(() => {
    if (triggerRef.current && !trigger) {
      // Trigger went from true to false
      shouldResetRef.current = true;
    }
    triggerRef.current = trigger;
  }, [trigger]);

  // Handle reset via event scheduling to avoid synchronous setState in effect
  useEffect(() => {
    if (shouldResetRef.current) {
      shouldResetRef.current = false;
      hasAnimatedRef.current = false;
      // Use setTimeout to avoid synchronous setState in effect body
      // This is a legitimate use case for counter reset
      setTimeout(() => {
        setCount(0);
        startTimeRef.current = null;
      }, 0);
    }
  });

  return count;
}

/**
 * Hook that returns an animated value that loops
 */
export function useLoopingCounter(
  target: number,
  interval: number = 3000
): number {
  const [count, setCount] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const duration = 1000;

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const startAnimation = () => {
      startTimeRef.current = performance.now();

      const step = (currentTime: number) => {
        if (!startTimeRef.current) return;

        const elapsed = currentTime - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);

        setCount(Math.floor(easedProgress * target));

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(step);
        } else {
          timeout = setTimeout(startAnimation, interval - duration);
        }
      };

      animationRef.current = requestAnimationFrame(step);
    };

    timeout = setTimeout(startAnimation, interval - duration);

    return () => {
      clearTimeout(timeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [target, interval, duration]);

  return count;
}
