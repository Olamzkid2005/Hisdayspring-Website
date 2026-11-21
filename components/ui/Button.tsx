"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import {
  buttonClasses,
  type ButtonSize,
  type ButtonVariant,
} from "@/lib/ui/button-classes";

/**
 * The class helpers live in `lib/ui/button-classes.ts` because this module is a
 * client boundary: calling a value exported from here in a server component
 * fails the build. They are re-exported for the client components that already
 * import them from this path.
 */
export { buttonClasses } from "@/lib/ui/button-classes";
export type { ButtonSize, ButtonVariant } from "@/lib/ui/button-classes";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
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
