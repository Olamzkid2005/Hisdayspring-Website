import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackButton({
  href = "/",
  label = "Back to Home",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-[44px] items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold hover:bg-white hover:text-primary transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </Link>
  );
}
