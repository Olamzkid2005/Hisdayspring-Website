/**
 * Button styling, split out of `components/ui/Button.tsx`.
 *
 * The Button module carries `"use client"`, so any value exported from it
 * becomes a *client reference* — calling `buttonClasses()` from a server
 * component fails the build with "Attempted to call buttonClasses() from the
 * server". The classes themselves are pure strings, so they live here, in a
 * module with no directive, and the client Button imports them.
 *
 * Server pages that need a link to look like a button import from this path.
 * Client components may keep importing from `@/components/ui/Button`.
 */

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-container",
  secondary: "bg-secondary text-on-secondary hover:brightness-110",
  outline: "border border-outline-variant text-on-surface hover:bg-surface-container-lowest",
  ghost: "text-on-surface hover:bg-surface-container-lowest",
};

export const sizeStyles: Record<ButtonSize, string> = {
  // min-h keeps small buttons tappable on phones (>=44px, Apple HIG).
  sm: "min-h-[44px] px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-2.5 text-base rounded-full",
  lg: "px-8 py-4 text-lg rounded-full",
};

export const baseStyles =
  "inline-flex items-center justify-center font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

/**
 * The classes a Button renders with, for the times a **link** has to look like
 * one. Wrapping the Button component in `<Link>` produces a `<button>` inside
 * an `<a>` — invalid interactive nesting that assistive technology announces
 * unpredictably — so a navigating control should be a `Link` carrying these
 * classes instead.
 */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = ""
): string {
  return `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();
}
