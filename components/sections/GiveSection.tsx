"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { HandCoins, Heart, Globe, Building, Landmark, Users, Copy, Check } from "lucide-react";
import { bankAccount, donationPurposes } from "@/data/donations";
import type { DonationPurpose } from "@/types";

const purposeIcons: Record<DonationPurpose, React.ElementType> = {
  tithes: HandCoins,
  offerings: Heart,
  missions: Globe,
  "special-projects": Building,
  "building-fund": Landmark,
  "youth-ministry": Users,
};

export function GiveSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selected, setSelected] = useState<DonationPurpose>("tithes");
  const [copied, setCopied] = useState(false);

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(bankAccount.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="give" ref={ref} className="bg-surface-container-low py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-8 md:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="font-headline text-2xl md:text-4xl font-bold text-primary mb-4">Support the Mission</h2>
          <p className="text-on-surface-variant text-base md:text-lg mb-6 md:mb-10">
            Your generosity fuels the work of God and transforms lives across our communities.
          </p>

          <div className="space-y-3">
            {donationPurposes.map((purpose) => {
              const Icon = purposeIcons[purpose.id];
              return (
                <label
                  key={purpose.id}
                  className={`group cursor-pointer flex items-center justify-between p-4 md:p-6 bg-surface-container-lowest rounded-xl border-l-4 transition-colors ${
                    selected === purpose.id ? "border-secondary" : "border-transparent hover:border-secondary"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Icon className="w-6 h-6 text-primary" />
                    <div>
                      <h4 className="font-bold text-lg text-on-surface">{purpose.label}</h4>
                      {purpose.description && (
                        <p className="text-sm text-zinc-500">{purpose.description}</p>
                      )}
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="donation-purpose"
                    value={purpose.id}
                    checked={selected === purpose.id}
                    onChange={() => setSelected(purpose.id)}
                    className="accent-primary w-5 h-5"
                  />
                </label>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-surface-container-lowest p-6 md:p-10"
        >
          <h3 className="font-headline text-2xl font-bold text-on-surface mb-8">Secure Ways to Give</h3>

          <div className="p-6 rounded-xl bg-surface-container-low mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">Bank Details</p>
            <div className="flex justify-between border-b border-outline-variant pb-3 mb-3">
              <span className="text-on-surface-variant text-sm">Bank</span>
              <span className="font-bold text-on-surface">{bankAccount.bankName}</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant pb-3 mb-3">
              <span className="text-on-surface-variant text-sm">Account Name</span>
              <span className="font-bold text-on-surface">{bankAccount.accountName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-sm">Account Number</span>
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg md:text-xl text-primary">{bankAccount.accountNumber}</span>
                <button
                  type="button"
                  onClick={copyAccountNumber}
                  className="p-2.5 rounded hover:bg-surface-container transition-colors min-w-[44px] min-h-[44px]"
                  aria-label="Copy account number"
                >
                  {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-on-surface-variant" />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              className="w-full py-4 rounded-full font-bold text-white bg-[#09a5db] hover:opacity-90 transition-opacity"
            >
              Give with Paystack
            </button>
            <button
              type="button"
              className="w-full py-4 rounded-full font-bold text-white bg-[#f5a623] hover:opacity-90 transition-opacity"
            >
              Give with Flutterwave
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}