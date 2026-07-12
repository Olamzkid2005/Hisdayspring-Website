"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
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
import { bankAccount, donationPurposes, scriptureReferences } from "@/data/donations";
import { initializePayment } from "@/lib/api/paystack";
import { initializeFlutterwavePayment } from "@/lib/api/flutterwave";
import type { DonationPurpose, PaymentMethod } from "@/types";

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
  const [paystackLoading, setPaystackLoading] = useState(false);
  const [flutterwaveLoading, setFlutterwaveLoading] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);

  // Auto-advance background image every 6s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(bankAccount.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaystack = async () => {
    if (!validateForm()) return;
    setPaystackLoading(true);
    setError(null);

    const result = await initializePayment(donorEmail, amount * 100, {
      name: donorName,
      phone: donorPhone,
      purpose,
      type: "donation",
    });

    setPaystackLoading(false);

    if (result.success && result.authorizationUrl) {
      window.location.href = result.authorizationUrl;
    } else {
      setError(result.message || "Payment initialization failed. Please try again.");
    }
  };

  const handleFlutterwave = async () => {
    if (!validateForm()) return;
    setFlutterwaveLoading(true);
    setError(null);

    const result = await initializeFlutterwavePayment(
      donorEmail,
      amount,
      donorName,
      donorPhone,
      { purpose, type: "donation" }
    );

    setFlutterwaveLoading(false);

    if (result.success && result.authorizationUrl) {
      window.location.href = result.authorizationUrl;
    } else {
      setError(result.message || "Payment initialization failed. Please try again.");
    }
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

    const result = await initializePayment(donorEmail, amount * 100, {
      name: donorName,
      phone: donorPhone,
      purpose,
      type: "donation",
    });

    setIsSubmitting(false);

    if (result.success && result.authorizationUrl) {
      window.location.href = result.authorizationUrl;
    } else {
      setError(result.message || "Payment initialization failed. Please try again.");
    }
  };

  const selectedPurpose = donationPurposes.find((p) => p.id === purpose);

  // ---- Success State ----
  if (showSuccess) {
    return (
      <section className="relative min-h-screen py-28 md:py-36 overflow-hidden">
        {/* Background slideshow */}
        <div className="absolute inset-0 bg-zinc-900">
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
        <div className="max-w-2xl mx-auto px-4 md:px-8">
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
                ? `Thank you for your ${selectedPurpose?.label.toLowerCase() || "donation"} of ₦${amount.toLocaleString()}!`
                : "Please complete your payment on the Paystack page."}
            </p>

            {paymentMethod === "bank-transfer" && (
              <div className="bg-surface-container-low rounded-xl p-6 text-left space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Bank Name</span>
                  <span className="font-bold text-on-surface">{bankAccount.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Account Number</span>
                  <span className="font-bold text-on-surface text-xl tracking-wider">
                    {bankAccount.accountNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Account Name</span>
                  <span className="font-bold text-on-surface">{bankAccount.accountName}</span>
                </div>
                <div className="flex justify-between">
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
      <div className="absolute inset-0 bg-zinc-900">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  `Donate ₦${amount > 0 ? amount.toLocaleString() : "0"} with Card`
                ) : (
                  "Continue to Bank Transfer"
                )}
              </Button>

              <p className="text-center text-sm text-on-surface-variant mt-4">
                Secure payment powered by Paystack
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
                Bank Transfer Details
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-outline-variant/50">
                  <span className="text-on-surface-variant text-sm">Bank</span>
                  <span className="font-bold text-on-surface">{bankAccount.bankName}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-outline-variant/50">
                  <span className="text-on-surface-variant text-sm">Account Name</span>
                  <span className="font-bold text-on-surface text-right">{bankAccount.accountName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant text-sm">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xl text-primary">{bankAccount.accountNumber}</span>
                    <button
                      type="button"
                      onClick={copyAccountNumber}
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

            {/* Paystack / Flutterwave Buttons */}
            <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/20">
              <h3 className="font-headline text-lg font-bold text-on-surface mb-4">
                Pay Online Now
              </h3>
              <p className="text-sm text-on-surface-variant mb-6">
                Fill in the form on the left, then choose your payment gateway below.
              </p>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handlePaystack}
                  disabled={paystackLoading || flutterwaveLoading}
                  className="w-full py-4 rounded-full font-bold text-white bg-[#09a5db] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {paystackLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Give with Paystack"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleFlutterwave}
                  disabled={paystackLoading || flutterwaveLoading}
                  className="w-full py-4 rounded-full font-bold text-white bg-[#f5a623] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {flutterwaveLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Give with Flutterwave"
                  )}
                </button>
              </div>
              <p className="text-xs text-on-surface-variant text-center mt-4">
                Secure payments processed by Paystack and Flutterwave
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
