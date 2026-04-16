"use client";

import { Loader2 } from "lucide-react";

export type SpinnerSize = "sm" | "md" | "lg";

export interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

export function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <Loader2
      className={`
        ${sizeStyles[size]}
        animate-spin text-primary-600
        ${className}
      `.trim()}
      aria-label="Loading"
    />
  );
}
