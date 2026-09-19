"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="min-h-[60vh] flex items-center justify-center px-4 py-24 bg-surface">
      <div className="max-w-lg text-center">
        <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-on-error-container" />
        </div>
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-3">
          Something went wrong
        </h1>
        <p className="text-on-surface-variant mb-8">
          We hit an unexpected problem while loading this page. Please try
          again — if it keeps happening, please come back a little later.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity"
          >
            <RotateCcw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-outline-variant text-on-surface font-bold hover:bg-surface-container-low transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
