"use client";

/**
 * Staff verification page for the bookstand.
 *
 * A buyer shows their reference (or the full download-link URL). Staff paste
 * it here; the page asks our verify route, which checks the checkout against
 * Bachs' API — the record of truth — and shows exactly what was paid for
 * before any book is handed over. No login: the page leaks nothing on its own
 * (it requires a valid checkout id) and only confirms orders that were
 * actually paid.
 */

import { useState } from "react";
import { Check, AlertCircle, Search, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { verifyBookOrder, type VerifiedBookOrder } from "@/lib/api/bachs";

/** Accept a bare checkout id, or a URL pasted straight off a phone. */
function extractCheckoutId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (/^[A-Za-z0-9._:-]{1,200}$/.test(trimmed) && trimmed.includes("_")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const fromQuery = url.searchParams.get("checkout_id");
    if (fromQuery && /^[A-Za-z0-9._:-]{1,200}$/.test(fromQuery)) {
      return fromQuery;
    }
  } catch {
    // Not a URL — fall through.
  }

  return null;
}

export default function BookVerifyPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<VerifiedBookOrder | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const check = async () => {
    setError(null);
    setResult(null);
    setReference(null);

    const checkoutId = extractCheckoutId(query);
    if (!checkoutId) {
      setError(
        "Paste the buyer's reference (chk_...) or their full download-link URL."
      );
      return;
    }

    setIsChecking(true);
    try {
      const response = await verifyBookOrder(checkoutId);
      if (response.success) {
        setResult(response.order);
        setReference(response.reference ?? response.checkoutId);
      } else {
        setError(response.message);
      }
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-surface-container-low min-h-screen">
      <div className="max-w-2xl mx-auto px-4 md:px-8">
        <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-sm border border-outline-variant/20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Bookstand verification
          </div>
          <h1 className="font-headline text-2xl font-bold text-on-surface mb-2">
            Check a paid order
          </h1>
          <p className="text-sm text-on-surface-variant mb-8">
            Ask the buyer for their payment reference, paste it below, and hand
            over the books only once it shows as paid.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="flex-1">
              <Input
                label="Buyer's reference or link"
                name="checkoutQuery"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void check();
                }}
                placeholder="chk_... or https://...?checkout_id=chk_..."
                required
              />
            </div>
            <div className="sm:pt-7">
              <Button
                onClick={check}
                isLoading={isChecking}
                disabled={isChecking}
                aria-label="Verify payment"
              >
                {!isChecking && <Search className="w-4 h-4 mr-2" />}
                Verify
              </Button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="p-4 bg-error-container rounded-xl flex items-start gap-3 text-on-error-container mb-6"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Not verified</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-secondary-container/20 rounded-2xl border-2 border-secondary/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-on-surface">Payment confirmed</p>
                  {reference && (
                    <p className="font-mono text-xs text-on-surface-variant break-all">
                      {reference}
                    </p>
                  )}
                </div>
              </div>

              {(result.buyer?.name || result.buyer?.phone) && (
                <p className="text-sm text-on-surface-variant mb-4">
                  {[result.buyer?.name, result.buyer?.phone]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}

              <div className="space-y-2">
                {result.lines.map((line) => (
                  <div
                    key={line.bookId}
                    className="flex items-center justify-between gap-4 bg-surface-container-lowest rounded-xl px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-on-surface text-sm">
                        {line.title}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {line.quantity} copy{line.quantity === 1 ? "" : "ies"} ×
                        ₦{line.unitPrice.toLocaleString()}
                      </p>
                    </div>
                    <span className="font-bold text-on-surface text-sm">
                      ₦{line.lineTotal.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant/30">
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    {result.fulfillment === "pickup"
                      ? "Hand over printed copies"
                      : "PDF order — direct the buyer to their download links"}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Total paid ₦{result.total.toLocaleString()}
                  </p>
                </div>
              </div>

              {!result.catalogMatch && (
                <div className="mt-4 p-3 bg-error-container rounded-xl text-on-error-container text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    This order includes a title no longer in the catalogue —
                    reconcile manually.
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
