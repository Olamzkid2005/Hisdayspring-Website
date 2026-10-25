import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackButton({
  href = "/",
  label = "Back to Home",
  variant = "dark",
}: {
  href?: string;
  label?: string;
  /**
   * Which surface the button sits on. `dark` is for the photo/gradient heroes
   * (books, pastors, radio); `light` is for the plain surface bands used by
   * /live, /prayer and /testimonials, where white-on-white made the link
   * effectively invisible.
   */
  variant?: "dark" | "light";
}) {
  const surface =
    variant === "light"
      ? "border-outline-variant bg-surface-container-lowest text-primary shadow-sm hover:border-primary hover:bg-primary hover:text-on-primary"
      : "border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-primary";

  return (
    <Link
      href={href}
      className={`inline-flex min-h-[44px] items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${surface}`}
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </Link>
  );
}
