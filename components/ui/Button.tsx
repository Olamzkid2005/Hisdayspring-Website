"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[#b80035] text-white hover:bg-[#d4264f]",
  secondary: "bg-[#735c00] text-white",
  outline: "border border-[#e5bdbe] text-[#1a1c1c] hover:bg-white",
  ghost: "text-[#1a1c1c] hover:bg-white",
};

const sizeStyles: Record<ButtonSize, string> = {
  // min-h keeps small buttons tappable on phones (>=44px, Apple HIG).
  sm: "min-h-[44px] px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-2.5 text-base rounded-full",
  lg: "px-8 py-4 text-lg rounded-full",
};

const baseStyles =
  "inline-flex items-center justify-center font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b80035] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

/**
 * The classes a Button renders with, for the times a **link** has to look like
 * one. Wrapping this component in `<Link>` produces a `<button>` inside an
 * `<a>` — invalid interactive nesting that assistive technology announces
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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={buttonClasses(variant, size, className)}
        {...props}
      >
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
