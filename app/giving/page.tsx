"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Banknote,
  CreditCard,
  Check,
  AlertCircle,
  Copy,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  bankAccounts,
  donationPurposes,
  scriptureReferences,
  pastoralGivingAccount,
} from "@/data/donations";
import { initializePayment } from "@/lib/api/paystack";
import { initializeFlutterwavePayment } from "@/lib/api/flutterwave";
import type { BankAccount, DonationPurpose, PaymentMethod } from "@/types";

const PRESET_AMOUNTS = [1000, 2500, 5000, 10000];

const bgImages = [
  "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&q=80",
  "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1920&q=80",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=80",
  "https://images.unsplash.com/photo-1478739273407-adb4b0981f27?w=1920&q=80",
];

export default function GivingPage() {
  const [amount, setAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [purpose, setPurpose] = useState<DonationPurpose | "">("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card-payment");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [gateway, setGateway] = useState<"paystack" | "flutterwave">("paystack");
  const [currentBg, setCurrentBg] = useState(0);

  // Auto-advance background image every 6s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const ref = useRef<HTMLElement>(null);

  const copyAccountNumber = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (amount <= 0) {
      newErrors.amount = "Please select or enter an amount";
    }

    if (!purpose) {
      newErrors.purpose = "Please select a donation purpose";
    }

    if (!donorName.trim()) {
      newErrors.donorName = "Name is required";
    }

    if (!donorEmail.trim()) {
      newErrors.donorEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorEmail)) {
      newErrors.donorEmail = "Please enter a valid email";
    }

    if (!donorPhone.trim()) {
      newErrors.donorPhone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePresetAmount = (value: number) => {
    setAmount(value);
    setCustomAmount("");
    setErrors((prev) => ({ ...prev, amount: "" }));
  };

  const handleCustomAmount = (value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ""), 10);
    setCustomAmount(value);
    setAmount(isNaN(numValue) ? 0 : numValue);
    setErrors((prev) => ({ ...prev, amount: "" }));
  };

  const handlePurposeSelect = (id: DonationPurpose) => {
    setPurpose(id);
    setErrors((prev) => ({ ...prev, purpose: "" }));
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    if (paymentMethod === "bank-transfer") {
      setIsSubmitting(false);
      setShowSuccess(true);
      return;
    }

    const result =
      gateway === "paystack"
        ? await initializePayment(donorEmail, amount * 100, {
            name: donorName,
            phone: donorPhone,
            purpose,
            type: "donation",
          })
        : await initializeFlutterwavePayment(
            donorEmail,
            amount,
            donorName,
            donorPhone,
            { purpose, type: "donation" }
          );

    setIsSubmitting(false);

    if (result.success && result.authorizationUrl) {
      window.location.assign(result.authorizationUrl);
    } else {
      setError(result.message || "Payment initialization failed. Please try again.");
    }
  };

  const selectedPurpose = donationPurposes.find((p) => p.id === purpose);
  const transferAccounts: BankAccount[] =
    purpose === "pastoral-giving" && pastoralGivingAccount
      ? [pastoralGivingAccount]
      : bankAccounts;
  const isPastoralTransfer =
    purpose === "pastoral-giving" && pastoralGivingAccount !== null;

  // ---- Success State ----
  if (showSuccess) {
    return (
      <section className="relative min-h-screen py-28 md:py-36 overflow-hidden">
        {/* Background slideshow */}
        <div className="absolute inset-0 bg-surface-container-low">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${bgImages[currentBg]})` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-lg text-center"
          >
            <div className="w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-secondary" />
            </div>
            <h2 className="font-headline text-3xl font-bold text-on-surface mb-4">
              {paymentMethod === "bank-transfer"
                ? "Bank Transfer Instructions"
                : "Payment Initialized"}
            </h2>
            <p className="text-on-surface-variant mb-6">
              {paymentMethod === "bank-transfer"
                ? `Thank you for your ${selectedPurpose?.label.toLowerCase() || "donation"} of ₦${amount.toLocaleString()}! Use the details below to complete your transfer.`
                : "Please complete your payment on the secure checkout page."}
            </p>

            {paymentMethod === "bank-transfer" && (
              <div className="bg-surface-container-low rounded-xl p-6 text-left space-y-4 mb-6">
                {transferAccounts.map((bank, index) => (
                  <div key={index} className={index > 0 ? 'mt-4 pt-4 border-t border-outline-variant/30' : ''}>
                    <div className="font-bold text-on-surface mb-2">{bank.bankName}</div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Account Number</span>
                      <span className="font-bold text-on-surface text-lg tracking-wider">
                        {bank.accountNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Account Name</span>
                      <span className="font-bold text-on-surface text-sm">{bank.accountName}</span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between mt-4 pt-4 border-t border-outline-variant/30">
                  <span className="text-on-surface-variant">Purpose</span>
                  <span className="font-bold text-on-surface">{selectedPurpose?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Amount</span>
                  <span className="font-bold text-secondary text-xl">
                    ₦{amount.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <p className="text-sm text-on-surface-variant mb-6">
              Please use your name as payment reference when making transfers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowSuccess(false);
                  setAmount(0);
                  setPurpose("");
                  setDonorName("");
                  setDonorEmail("");
                  setDonorPhone("");
                }}
              >
                Make Another Donation
              </Button>
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // ---- Main Page ----
  return (
    <section ref={ref} className="relative py-16 md:py-24 min-h-screen overflow-hidden">
      {/* Background slideshow */}
      <div className="absolute inset-0 bg-surface-container-low">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImages[currentBg]})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            Giving
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-white mb-4">
            Support Our Ministry
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            &ldquo;Give, and it will be given to you. A good measure, pressed down, shaken
            together and running over, will be poured into your lap.&rdquo;
          </p>
          <p className="text-white/60 text-sm mt-1">— Luke 6:38</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 md:gap-12">
          {/* ---- Left: Donation Form ---- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-surface-container-lowest/95 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-sm border border-outline-variant/20">
              {/* Amount Selection */}
              <div className="mb-8">
                <p className="block text-sm font-semibold text-on-surface mb-3">
                  Select Amount
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  {PRESET_AMOUNTS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handlePresetAmount(value)}
                      className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                        amount === value && !customAmount
                          ? "border-secondary bg-secondary-container/20 text-secondary"
                          : "border-outline-variant hover:border-secondary text-on-surface"
                      }`}
                    >
                      ₦{value.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">₦</span>
                  <input
                    type="text"
                    value={customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                    placeholder="Enter custom amount"
                    className={`w-full pl-8 pr-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:border-secondary bg-surface-container-low text-on-surface placeholder:text-on-surface-variant ${
                      errors.amount ? "border-error" : "border-outline-variant"
                    }`}
                  />
                </div>
                {errors.amount && (
                  <p className="text-error text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.amount}
                  </p>
                )}
              </div>

              {/* Purpose Selection */}
              <div className="mb-8">
                <p className="block text-sm font-semibold text-on-surface mb-3">
                  Donation Purpose
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {donationPurposes.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handlePurposeSelect(item.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        purpose === item.id
                          ? "border-secondary bg-secondary-container/20"
                          : "border-outline-variant hover:border-secondary"
                      }`}
                    >
                      <div
                        className={`font-semibold ${
                          purpose === item.id ? "text-secondary" : "text-on-surface"
                        }`}
                      >
                        {item.label}
                      </div>
                      {item.description && (
                        <div className="text-xs text-on-surface-variant mt-1">{item.description}</div>
                      )}
                    </button>
                  ))}
                </div>
                {errors.purpose && (
                  <p className="text-error text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.purpose}
                  </p>
                )}
              </div>

              {/* Donor Information */}
              <div className="mb-8">
                <p className="block text-sm font-semibold text-on-surface mb-3">
                  Your Information
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="donorName"
                    value={donorName}
                    onChange={(e) => {
                      setDonorName(e.target.value);
                      setErrors((prev) => ({ ...prev, donorName: "" }));
                    }}
                    error={errors.donorName}
                    required
                  />
                  <Input
                    label="Email Address"
                    name="donorEmail"
                    type="email"
                    value={donorEmail}
                    onChange={(e) => {
                      setDonorEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, donorEmail: "" }));
                    }}
                    error={errors.donorEmail}
                    required
                  />
                </div>
                <div className="mt-4">
                  <Input
                    label="Phone Number"
                    name="donorPhone"
                    type="tel"
                    value={donorPhone}
                    onChange={(e) => {
                      setDonorPhone(e.target.value);
                      setErrors((prev) => ({ ...prev, donorPhone: "" }));
                    }}
                    error={errors.donorPhone}
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <p className="block text-sm font-semibold text-on-surface mb-3">
                  Payment Method
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card-payment")}
                    className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                      paymentMethod === "card-payment"
                        ? "border-secondary bg-secondary-container/20"
                        : "border-outline-variant hover:border-secondary"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        paymentMethod === "card-payment" ? "bg-secondary text-on-secondary" : "bg-surface-container-high"
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold ${paymentMethod === "card-payment" ? "text-secondary" : "text-on-surface"}`}>
                        Card Payment
                      </div>
                      <div className="text-xs text-on-surface-variant">Pay with Visa, Mastercard, etc.</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bank-transfer")}
                    className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                      paymentMethod === "bank-transfer"
                        ? "border-secondary bg-secondary-container/20"
                        : "border-outline-variant hover:border-secondary"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        paymentMethod === "bank-transfer" ? "bg-secondary text-on-secondary" : "bg-surface-container-high"
                      }`}
                    >
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold ${paymentMethod === "bank-transfer" ? "text-secondary" : "text-on-surface"}`}>
                        Bank Transfer
                      </div>
                      <div className="text-xs text-on-surface-variant">Get account details after submission</div>
                    </div>
                  </button>
                  <div
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === "card-payment"
                        ? "border-secondary bg-secondary-container/10"
                        : "border-outline-variant/50 opacity-60"
                    }`}
                    aria-hidden={paymentMethod !== "card-payment"}
                  >
                    <p className="block text-xs font-semibold text-on-surface mb-2">Card Gateway</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={paymentMethod !== "card-payment"}
                        onClick={() => setGateway("paystack")}
                        className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                          gateway === "paystack"
                            ? "bg-[#09a5db] text-white border-[#09a5db]"
                            : "border-outline-variant text-on-surface-variant hover:border-[#09a5db]"
                        }`}
                      >
                        Paystack
                      </button>
                      <button
                        type="button"
                        disabled={paymentMethod !== "card-payment"}
                        onClick={() => setGateway("flutterwave")}
                        className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                          gateway === "flutterwave"
                            ? "bg-[#f5a623] text-white border-[#f5a623]"
                            : "border-outline-variant text-on-surface-variant hover:border-[#f5a623]"
                        }`}
                      >
                        Flutterwave
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 p-4 bg-error-container rounded-xl flex items-center gap-3 text-on-error-container">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {/* Submit */}
              <Button
                onClick={handlePayment}
                isLoading={isSubmitting}
                disabled={isSubmitting}
                className="w-full bg-primary text-on-primary py-4 rounded-full font-bold text-base shadow-lg shadow-primary/20"
                size="lg"
              >
                {isSubmitting ? (
                  "Processing..."
                ) : paymentMethod === "card-payment" ? (
                  `Donate ₦${amount > 0 ? amount.toLocaleString() : "0"} with ${gateway === "paystack" ? "Paystack" : "Flutterwave"}`
                ) : (
                  "Continue to Bank Transfer"
                )}
              </Button>

              <p className="text-center text-sm text-on-surface-variant mt-4">
                {paymentMethod === "card-payment"
                  ? `Secure payment powered by ${gateway === "paystack" ? "Paystack" : "Flutterwave"}`
                  : "You will receive account details to complete your transfer"}
              </p>
            </div>
          </motion.div>

          {/* ---- Right: Bank Details + Info ---- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Bank Details Card */}
            <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/20">
              <h3 className="font-headline text-xl font-bold text-on-surface mb-6">
                {isPastoralTransfer
                  ? "Pastor's Account Details"
                  : "Bank Transfer Details"}
              </h3>

              {transferAccounts.map((bank, index) => (
                <div key={index} className={`${index > 0 ? 'mt-6 pt-6 border-t border-outline-variant/50' : ''}`}>
                  <h4 className="font-bold text-on-surface mb-4">{bank.bankName}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant text-sm">Account Name</span>
                      <span className="font-bold text-on-surface text-right text-sm">{bank.accountName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant text-sm">Account Number</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-primary">{bank.accountNumber}</span>
                        <button
                          type="button"
                          onClick={() => copyAccountNumber(bank.accountNumber)}
                          className="p-2 rounded-lg hover:bg-surface-container transition-colors"
                          aria-label="Copy account number"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-primary" />
                          ) : (
                            <Copy className="w-4 h-4 text-on-surface-variant" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scripture References */}
            <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/20">
              <h3 className="font-headline text-lg font-bold text-on-surface mb-4">
                Scripture on Giving
              </h3>
              <div className="space-y-3">
                {scriptureReferences.map((ref, i) => (
                  <p key={i} className="text-sm text-on-surface-variant italic leading-relaxed">
                    &ldquo;{ref}&rdquo;
                  </p>
                ))}
              </div>
            </div>

            {/* Quick tip */}
            <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/20">
              <h3 className="font-headline text-lg font-bold text-on-surface mb-4">
                Prefer to transfer directly?
              </h3>
              <p className="text-sm text-on-surface-variant mb-6">
                Choose <span className="font-semibold text-on-surface">Bank Transfer</span> in the form and we&apos;ll show you the account details instantly.
              </p>
              <button
                type="button"
                onClick={() => setPaymentMethod("bank-transfer")}
                className="text-secondary font-semibold text-sm underline underline-offset-4 hover:text-secondary/80 transition-colors"
              >
                Use bank transfer instead
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
