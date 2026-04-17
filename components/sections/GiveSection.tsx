"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Heart, Banknote, CreditCard, Smartphone } from "lucide-react";
import { bankAccount, scriptureReferences } from "@/data/donations";

export function GiveSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="give" ref={ref} className="py-28 md:py-36 bg-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-100 text-accent-700 text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            Give
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-900 mb-6">
            Partner With Us in Ministry
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            &ldquo;Give, and it will be given to you. A good measure, pressed down, shaken
            together and running over, will be poured into your lap.&rdquo; — Luke 6:38
          </p>
          <div className="w-24 h-1 bg-accent-500 mx-auto rounded-full mt-8" />
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Bank Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
                <Banknote className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-primary-900">
                Bank Transfer
              </h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-primary-50 rounded-xl">
                <div className="text-sm text-muted mb-1">Bank Name</div>
                <div className="font-bold text-primary-900">{bankAccount.bankName}</div>
              </div>
              <div className="p-4 bg-primary-50 rounded-xl">
                <div className="text-sm text-muted mb-1">Account Number</div>
                <div className="font-bold text-primary-900 text-2xl tracking-wider">
                  {bankAccount.accountNumber}
                </div>
              </div>
              <div className="p-4 bg-primary-50 rounded-xl">
                <div className="text-sm text-muted mb-1">Account Name</div>
                <div className="font-bold text-primary-900">{bankAccount.accountName}</div>
              </div>
            </div>

            <p className="mt-6 text-sm text-muted">
              Please use your name as payment reference when making transfers.
            </p>
          </motion.div>

          {/* Online Payment Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-primary-900 rounded-3xl p-8 md:p-10 text-white"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent-500 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary-900" />
              </div>
              <h3 className="font-serif text-2xl font-bold">Online Giving</h3>
            </div>

            <p className="text-white/70 mb-6">
              Online payment options coming soon. In the meantime, please use bank transfer
              or contact us for mobile money options.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl">
                <CreditCard className="w-5 h-5 text-accent-400" />
                <span>Card Payments (Paystack)</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl">
                <Smartphone className="w-5 h-5 text-accent-400" />
                <span>Mobile Money</span>
              </div>
            </div>

            <p className="text-sm text-white/50">
              For online giving setup, please contact us at{" "}
              <a href="mailto:hello@hisdayspring.org" className="text-accent-400">
                hello@hisdayspring.org
              </a>
            </p>
          </motion.div>
        </div>

        {/* Scripture References */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <h3 className="font-serif text-2xl font-bold text-primary-900 text-center mb-8">
            Scripture on Giving
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {scriptureReferences.map((verse, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-xl border border-primary-100 text-sm text-muted italic"
              >
                &ldquo;{verse}&rdquo;
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
