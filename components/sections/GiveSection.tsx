"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { HeartHandshake, ArrowRight, Building2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function GiveSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="give" ref={ref} className="py-10 md:py-14 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 md:px-16 md:py-16 text-center"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,white,transparent_45%),radial-gradient(circle_at_80%_80%,white,transparent_45%)]" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <HeartHandshake className="w-10 h-10 md:w-12 md:h-12 text-secondary mx-auto mb-4" />
            <h2 className="font-headline text-3xl md:text-5xl text-on-primary font-bold mb-3">
              Support the Mission
            </h2>
            <p className="text-on-primary/80 text-base md:text-lg mb-8 max-w-xl mx-auto">
              Your generosity fuels the work of God and transforms lives across
              our communities. Give securely in under two minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Link
                href="/giving"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-4 md:px-14 md:py-5 rounded-full bg-secondary text-on-secondary font-headline font-bold text-lg md:text-xl hover:brightness-110 transition-all shadow-xl shadow-black/20"
              >
                Give Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/giving"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full border-2 border-on-primary/40 text-on-primary font-headline font-bold text-base md:text-lg hover:bg-white/10 transition-all"
              >
                <Building2 className="w-5 h-5" />
                Bank Transfer Details
              </Link>
            </div>

            <p className="inline-flex items-center gap-2 text-on-primary/70 text-sm">
              <ShieldCheck className="w-4 h-4" />
              Secure payments via Paystack &amp; Flutterwave
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
