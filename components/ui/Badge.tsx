import type { HTMLAttributes, ReactNode } from "react";

export type BadgeTone =
  | "primary"
  | "primary-soft"
  | "secondary"
  | "secondary-soft"
  | "tertiary"
  | "neutral"
  | "on-dark";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: BadgeSize;
  uppercase?: boolean;
  children: ReactNode;
}

const toneStyles: Record<BadgeTone, string> = {
  primary: "bg-primary-container/10 text-primary",
  "primary-soft": "bg-primary/10 text-primary",
  secondary: "bg-secondary-container text-on-secondary-container",
  "secondary-soft": "bg-secondary/10 text-secondary",
  tertiary: "bg-tertiary-container/10 text-tertiary",
  neutral: "bg-surface-container text-on-surface-variant",
  "on-dark": "border border-white/20 bg-white/10 text-white backdrop-blur-sm",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-xs",
  lg: "px-4 py-1 text-sm",
};

/** Text-scale utilities, kept apart from colour ones like `text-primary`. */
const TEXT_SIZES = new Set(["xs", "sm", "base", "lg", "xl", "2xl", "3xl"]);

/**
 * Identifies what a utility controls: `px-2` -> "px", `md:px-6` -> "md|px".
 * Matching keys are alternatives for the same slot, so the later one wins.
 */
function utilityKey(token: string): string | null {
  const parts = token.split(":");
  const utility = parts.pop() ?? "";
  if (!utility) return null;

  const variant = parts.join(":");
  const [root, value] = utility.split("-");
  if (!root) return null;

  const slot = root === "text" && value && TEXT_SIZES.has(value) ? "text-size" : root;
  return `${variant}|${slot}`;
}

/**
 * Drops a base utility when the caller's className supplies one for the same
 * slot.
 *
 * Concatenating classes and leaving the winner to Tailwind's generated order is
 * not a contract: `px-6` happens to come after `px-2` today, but the override
 * silently breaks if the default scale or the class order changes.
 */
function mergeClasses(base: string, overrides: string): string {
  const overrideKeys = new Set(
    overrides
      .split(/\s+/)
      .filter(Boolean)
      .map(utilityKey)
      .filter((key): key is string => key !== null)
  );

  const kept = base
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => {
      const key = utilityKey(token);
      return key === null || !overrideKeys.has(key);
    });

  return [...kept, overrides.trim()].filter(Boolean).join(" ");
}

/**
 * Pill label for categories, roles and small bits of metadata.
 *
 * One component keeps padding, radius and tone on the same scale; the ad-hoc
 * spans this replaces drifted between five different combination of padding,
 * font weight and container colour.
 */
export function Badge({
  tone = "primary",
  size = "sm",
  uppercase = false,
  className = "",
  children,
  ...props
}: BadgeProps) {
  const classes = mergeClasses(
    `inline-flex items-center rounded-full font-bold ${
      uppercase ? "uppercase tracking-wider" : ""
    } ${toneStyles[tone]} ${sizeStyles[size]}`,
    className
  );

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
