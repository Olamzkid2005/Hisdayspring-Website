"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, Banknote, CreditCard, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { bankAccount, donationPurposes } from "@/data/donations";
import { initializePayment } from "@/lib/api/paystack";
import type { DonationPurpose, PaymentMethod } from "@/types";

const PRESET_AMOUNTS = [1000, 2500, 5000, 10000];

export function DonationSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Form state
  const [amount, setAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [purpose, setPurpose] = useState<DonationPurpose | "">("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card-payment");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      // Show bank transfer instructions
      setIsSubmitting(false);
      setShowSuccess(true);
      return;
    }

    // Card payment via Paystack
    const result = await initializePayment(donorEmail, amount * 100, {
      name: donorName,
      phone: donorPhone,
      purpose,
      type: "donation",
    });

    setIsSubmitting(false);

    if (result.success && result.authorizationUrl) {
      // Redirect to Paystack
      window.location.href = result.authorizationUrl;
    } else {
      setError(result.message || "Payment initialization failed. Please try again.");
    }
  };

  const selectedPurpose = donationPurposes.find((p) => p.id === purpose);

  if (showSuccess) {
    return (
      <section id="donate" ref={ref} className="py-28 md:py-36 bg-cream">
        <div className="max-w-2xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-lg text-center"
          >
            <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-accent-600" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-primary-900 mb-4">
              {paymentMethod === "bank-transfer"
                ? "Bank Transfer Instructions"
                : "Payment Initialized"}
            </h2>
            <p className="text-muted mb-6">
              {paymentMethod === "bank-transfer"
                ? `Thank you for your ${selectedPurpose?.label.toLowerCase() || "donation"} of ₦${amount.toLocaleString()}!`
                : "Please complete your payment on the Paystack page."}
            </p>

            {paymentMethod === "bank-transfer" && (
              <div className="bg-primary-50 rounded-xl p-6 text-left space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted">Bank Name</span>
                  <span className="font-bold text-primary-900">{bankAccount.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Account Number</span>
                  <span className="font-bold text-primary-900 text-xl tracking-wider">
                    {bankAccount.accountNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Account Name</span>
                  <span className="font-bold text-primary-900">{bankAccount.accountName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Purpose</span>
                  <span className="font-bold text-primary-900">
                    {selectedPurpose?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Amount</span>
                  <span className="font-bold text-accent-600 text-xl">
                    ₦{amount.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <p className="text-sm text-muted mb-6">
              Please use your name as payment reference when making transfers.
            </p>

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
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="donate" ref={ref} className="py-28 md:py-36 bg-cream">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-100 text-accent-700 text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            Give
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-900 mb-6">
            Support Our Ministry
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            &ldquo;Give, and it will be given to you. A good measure, pressed down, shaken
            together and running over, will be poured into your lap.&rdquo; — Luke 6:38
          </p>
        </motion.div>

        {/* Donation Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl p-8 md:p-10 shadow-lg"
        >
          {/* Amount Selection */}
          <div className="mb-8">
            <p className="block text-sm font-medium text-primary-900 mb-3">
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
                      ? "border-accent-500 bg-accent-50 text-accent-700"
                      : "border-gray-200 hover:border-accent-300 text-primary-700"
                  }`}
                >
                  ₦{value.toLocaleString()}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">₦</span>
              <input
                type="text"
                id="customAmount"
                value={customAmount}
                onChange={(e) => handleCustomAmount(e.target.value)}
                placeholder="Enter custom amount"
                className={`w-full pl-8 pr-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:border-accent-500 ${
                  errors.amount ? "border-red-500" : "border-gray-200"
                }`}
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.amount}
              </p>
            )}
          </div>

          {/* Purpose Selection */}
          <div className="mb-8">
            <p className="block text-sm font-medium text-primary-900 mb-3">
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
                      ? "border-accent-500 bg-accent-50"
                      : "border-gray-200 hover:border-accent-300"
                  }`}
                >
                  <div
                    className={`font-semibold ${
                      purpose === item.id ? "text-accent-700" : "text-primary-900"
                    }`}
                  >
                    {item.label}
                  </div>
                  {item.description && (
                    <div className="text-xs text-muted mt-1">{item.description}</div>
                  )}
                </button>
              ))}
            </div>
            {errors.purpose && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.purpose}
              </p>
            )}
          </div>

          {/* Donor Information */}
          <div className="mb-8">
            <p className="block text-sm font-medium text-primary-900 mb-3">
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
            <p className="block text-sm font-medium text-primary-900 mb-3">
              Payment Method
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("card-payment")}
                className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                  paymentMethod === "card-payment"
                    ? "border-accent-500 bg-accent-50"
                    : "border-gray-200 hover:border-accent-300"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    paymentMethod === "card-payment" ? "bg-accent-500 text-white" : "bg-gray-100"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div
                    className={`font-semibold ${
                      paymentMethod === "card-payment" ? "text-accent-700" : "text-primary-900"
                    }`}
                  >
                    Card Payment
                  </div>
                  <div className="text-xs text-muted">Pay with Visa, Mastercard, etc.</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("bank-transfer")}
                className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                  paymentMethod === "bank-transfer"
                    ? "border-accent-500 bg-accent-50"
                    : "border-gray-200 hover:border-accent-300"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    paymentMethod === "bank-transfer" ? "bg-accent-500 text-white" : "bg-gray-100"
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div
                    className={`font-semibold ${
                      paymentMethod === "bank-transfer" ? "text-accent-700" : "text-primary-900"
                    }`}
                  >
                    Bank Transfer
                  </div>
                  <div className="text-xs text-muted">Get account details after submission</div>
                </div>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handlePayment}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              "Processing..."
            ) : paymentMethod === "card-payment" ? (
              `Donate ₦${amount > 0 ? amount.toLocaleString() : "0"} with Card`
            ) : (
              `Continue to Bank Transfer`
            )}
          </Button>

          <p className="text-center text-sm text-muted mt-4">
            Secure payment powered by Paystack
          </p>
        </motion.div>
      </div>
    </section>
  );
}
