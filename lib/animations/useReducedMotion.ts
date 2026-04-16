"use client";

import { useReducedMotion as useMotiomReducedMotion } from "framer-motion";

/**
 * Hook to check if user prefers reduced motion
 * Uses Framer Motion's useReducedMotion internally
 * but can be replaced with native implementation if needed
 */
export function useReducedMotion(): boolean {
  return useMotiomReducedMotion() ?? false;
}

/**
 * Animation duration when reduced motion is preferred (in ms)
 * Used as fallback when CSS transitions should be disabled
 */
export const REDUCED_MOTION_DURATION = 0.01;
