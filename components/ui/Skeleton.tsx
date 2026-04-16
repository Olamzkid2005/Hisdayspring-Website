"use client";

export type SkeletonVariant = "text" | "circular" | "rectangular";

export interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: "h-4 rounded animate-pulse",
  circular: "rounded-full animate-pulse",
  rectangular: "rounded-lg animate-pulse",
};

export function Skeleton({
  variant = "text",
  className = "",
}: SkeletonProps) {
  return (
    <div
      className={`
        bg-primary-100
        ${variantStyles[variant]}
        ${className}
      `.trim()}
      aria-hidden="true"
    />
  );
}
