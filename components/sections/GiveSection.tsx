"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  HeartHandshake,
  ArrowRight,
  Building2,
  ShieldCheck,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { bankAccounts, formatBankDetails } from "@/data/donations";
import { useCopyToClipboard } from "@/hooks";

export function GiveSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { copiedKey, copy } = useCopyToClipboard();
  const [copyError, setCopyError] = useState<string | null>(null);
  // On phones the transfer details already live in this section, so the
  // "Bank Transfer Details" button expands them in place instead of sending
  // people to the giving page. Collapsed by default to keep the section short.
  const [showBank, setShowBank] = useState(false);

  const copyText = async (text: string, key: string) => {
    const copied = await copy(text, key);
    setCopyError(
      copied
        ? null
        : "Could not copy automatically. Please select the details and copy them manually."
    );
  };

  return (
    <section id="give" ref={ref} className="py-10 md:py-14 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-primary px-5 py-8 md:px-16 md:py-16 text-center"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,white,transparent_45%),radial-gradient(circle_at_80%_80%,white,transparent_45%)]" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <HeartHandshake className="w-9 h-9 md:w-12 md:h-12 text-secondary mx-auto mb-3 md:mb-4" />
            <h2 className="font-headline text-3xl md:text-5xl text-on-primary font-bold mb-3">
              Support the Mission
            </h2>
            <p className="text-on-primary/80 text-base md:text-lg mb-6 md:mb-8 max-w-xl mx-auto">
              Your generosity fuels the work of God and transforms lives across
              our communities. Give securely in under two minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-5 md:mb-6">
              <Link
                href="/giving"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-4 md:px-14 md:py-5 rounded-full bg-secondary text-on-secondary font-headline font-bold text-lg md:text-xl hover:brightness-110 transition-all shadow-xl shadow-black/20"
              >
                Give Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                type="button"
                onClick={() => setShowBank((value) => !value)}
                aria-expanded={showBank}
                aria-controls="give-bank-details"
                className="md:hidden inline-flex items-center justify-center gap-2 w-full px-8 py-4 rounded-full border-2 border-on-primary/40 text-on-primary font-headline font-bold text-base hover:bg-white/10 transition-all"
              >
                <Building2 className="w-5 h-5" />
                {showBank ? "Hide bank details" : "Bank Transfer Details"}
              </button>
              <Link
                href="/giving"
                className="hidden md:inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-on-primary/40 text-on-primary font-headline font-bold text-base md:text-lg hover:bg-white/10 transition-all"
              >
                <Building2 className="w-5 h-5" />
                Bank Transfer Details
              </Link>
            </div>

            <p className="inline-flex items-center gap-2 text-on-primary/70 text-sm">
              <ShieldCheck className="w-4 h-4" />
              Secure payments via Bachs
            </p>

            {/* Direct transfers, so nobody has to open the giving page just to
                read an account number off the screen. */}
            <div
              id="give-bank-details"
              className={`${showBank ? "" : "hidden"} md:block mt-8 pt-6 md:mt-10 md:pt-8 border-t border-on-primary/20 text-left`}
            >
              <p className="text-on-primary font-headline font-bold text-lg">
                Or give directly to the church
              </p>
              <p className="text-on-primary/70 text-sm mt-1 mb-6">
                Copy the details straight into your bank app. For pastor &amp;
                ministerial giving, the pastor&apos;s own account is on the{" "}
                <Link
                  href="/giving?purpose=pastoral-giving"
                  className="underline underline-offset-4 hover:text-on-primary"
                >
                  giving page
                </Link>
                .
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {bankAccounts.map((bank, index) => (
                  <div
                    key={bank.accountNumber}
                    className="rounded-2xl bg-white/10 border border-on-primary/25 p-4 md:p-5"
                  >
                    <p className="text-on-primary/70 text-xs font-semibold uppercase tracking-wide">
                      {bank.bankName}
                    </p>
                    <p className="font-headline font-bold text-on-primary text-xl mt-1 break-words">
                      {bank.accountNumber}
                    </p>
                    <p className="text-on-primary/70 text-xs mt-1">
                      {bank.accountName}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => copyText(bank.accountNumber, `number-${index}`)}
                        className="inline-flex min-h-[44px] items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 border border-on-primary/30 text-on-primary text-xs font-semibold transition-colors"
                        aria-label={`Copy ${bank.bankName} account number`}
                      >
                        {copiedKey === `number-${index}` ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        {copiedKey === `number-${index}` ? "Copied" : "Copy number"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          copyText(formatBankDetails(bank), `details-${index}`)
                        }
                        className="inline-flex min-h-[44px] items-center gap-2 px-4 py-2 rounded-full border border-on-primary/30 hover:bg-white/10 text-on-primary text-xs font-semibold transition-colors"
                        aria-label={`Copy ${bank.bankName} bank details`}
                      >
                        {copiedKey === `details-${index}` ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        {copiedKey === `details-${index}` ? "Copied" : "Copy details"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {copyError && (
                <p className="mt-4 flex items-center gap-2 text-sm text-on-primary/90">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {copyError}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
