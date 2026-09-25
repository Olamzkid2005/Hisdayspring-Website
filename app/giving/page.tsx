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
import { Button, buttonClasses } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  bankAccounts,
  donationPurposes,
  scriptureReferences,
  pastoralGivingAccount,
  formatBankDetails,
  MIN_DONATION_AMOUNT,
} from "@/data/donations";
import { useCopyToClipboard } from "@/hooks";
import { initializeDonation, verifyDonation } from "@/lib/api/bachs";
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
  const [successReference, setSuccessReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { copiedKey, copy } = useCopyToClipboard();
  const [currentBg, setCurrentBg] = useState(0);
  const purposeSyncReady = useRef(false);

  // Auto-advance background image every 6s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // A shared link can preselect a purpose — `/giving?purpose=pastoral-giving`
  // is how the pastor's account gets sent out to members. Read after mount,
  // because `window` does not exist during the server render and seeding state
  // from it would make the hydration render disagree with the server's markup.
  //
  // Only purposes that are actually offered are accepted, so a hand-edited URL
  // cannot leave the form in a state the rest of the page does not expect. The
  // deferred tick is how this codebase avoids a synchronous setState inside an
  // effect (as in `useCounterAnimation`); the panel appears during the card's
  // own entrance animation, so nothing visibly jumps.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("purpose");
    if (!requested) return;

    const match = donationPurposes.find((item) => item.id === requested);
    if (!match) return;

    const timer = setTimeout(() => setPurpose(match.id), 0);
    return () => clearTimeout(timer);
  }, []);

  // Mirror the selection back into the address bar, so a URL copied from the
  // browser always describes what is on screen instead of going stale.
  // `replaceState` rather than `pushState`: picking a purpose should not fill
  // the back button with entries. The first run is skipped — at that point
  // nothing has been chosen, and the read above may still be settling.
  useEffect(() => {
    if (!purposeSyncReady.current) {
      purposeSyncReady.current = true;
      return;
    }

    const url = new URL(window.location.href);
    if (purpose) {
      url.searchParams.set("purpose", purpose);
    } else {
      url.searchParams.delete("purpose");
    }
    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
  }, [purpose]);

  // Bachs sends the donor back from the hosted checkout with `?checkout_id=`.
  // The redirect is not proof of payment (the tab can close, and the query
  // string is editable), so confirm it server-side before thanking anyone.
  useEffect(() => {
    const checkoutId = new URLSearchParams(window.location.search).get(
      "checkout_id"
    );
    if (!checkoutId) return;

    let cancelled = false;
    void (async () => {
      // Retries internally through the redirect race (Bachs bounces the donor
      // back a beat before the checkout session settles).
      const verified = await verifyDonation(checkoutId);
      if (cancelled) return;

      // Strip the parameter only once settled, so a pending checkout (bank
      // transfer not yet reflected) survives a refresh and can be re-verified
      // — while a confirmed one cannot be replayed.
      window.history.replaceState({}, "", window.location.pathname);

      if (verified.success) {
        setSuccessReference(checkoutId);
        setShowSuccess(true);
      } else {
        setError(
          verified.pending
            ? "Your payment has not reflected yet — bank transfers can take a few minutes. If you have completed the transfer, check back shortly or contact us with your receipt reference."
            : "We could not confirm this payment. If you were charged, please contact us and quote the reference from your receipt."
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const ref = useRef<HTMLElement>(null);

  /** Copy, and tell the donor when the browser refused to do it. */
  const copyToClipboard = async (text: string, key: string) => {
    const copied = await copy(text, key);
    if (!copied) {
      setError(
        "We could not copy that automatically. Please select the details and copy them manually."
      );
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (amount <= 0) {
      newErrors.amount = "Please select or enter an amount";
    } else if (amount < MIN_DONATION_AMOUNT) {
      // Catch the gateway's NGN floor here so the donor gets a specific
      // message instead of a generic server-side rejection.
      newErrors.amount = `The minimum donation is ₦${MIN_DONATION_AMOUNT.toLocaleString()}`;
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

    // Every method completes on Bachs' hosted checkout, including bank
    // transfer. The gateway is chosen server-side from the payment method.
    const result = await initializeDonation({
      email: donorEmail,
      amount,
      name: donorName,
      phone: donorPhone,
      purpose,
      paymentMethod,
    });

    setIsSubmitting(false);

    if (result.success && result.authorizationUrl) {
      window.location.assign(result.authorizationUrl);
    } else {
      setError(result.message || "Payment initialization failed. Please try again.");
    }
  };

  const selectedPurpose = donationPurposes.find((p) => p.id === purpose);
  // Ministerial gifts are transfer-only, so the online form is replaced rather
  // than shown with details that would send the money somewhere else.
  const isPastoralGiving = purpose === "pastoral-giving";

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
              Thank you for your gift
            </h2>
            <p className="text-on-surface-variant mb-6">
              Your {selectedPurpose?.label.toLowerCase() || "donation"} has been
              received. We are grateful for your generosity.
            </p>

            <div className="bg-surface-container-low rounded-xl p-6 text-left space-y-4 mb-6">
              {amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Amount</span>
                  <span className="font-bold text-secondary text-xl">
                    ₦{amount.toLocaleString()}
                  </span>
                </div>
              )}
              {selectedPurpose && (
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Purpose</span>
                  <span className="font-bold text-on-surface">
                    {selectedPurpose.label}
                  </span>
                </div>
              )}
              {successReference && (
                <div className="flex justify-between gap-4">
                  <span className="text-on-surface-variant">Reference</span>
                  <span className="font-mono text-xs text-on-surface break-all text-right">
                    {successReference}
                  </span>
                </div>
              )}
            </div>

            <p className="text-sm text-on-surface-variant mb-6">
              Please keep your reference for your records.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowSuccess(false);
                  setSuccessReference(null);
                  setAmount(0);
                  setPurpose("");
                  setDonorName("");
                  setDonorEmail("");
                  setDonorPhone("");
                }}
              >
                Make Another Donation
              </Button>
              {/* A Link that looks like the outline button, rather than a
                  Button inside a Link — nesting the two is invalid and adds a
                  second stop for keyboard and screen reader users. */}
              <Link href="/" className={buttonClasses("outline")}>
                Back to Home
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

              {/* Amount Selection — hidden for ministerial giving, which never
                  reaches a gateway. */}
              {!isPastoralGiving && (
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
              )}

              {/* Ministerial gifts never reach a gateway, so the form is
                  replaced rather than shown with details that would send the
                  money somewhere other than the pastor. */}
              {isPastoralGiving ? (
                <div className="rounded-2xl border-2 border-secondary/30 bg-secondary-container/10 p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-headline text-lg font-bold text-on-surface">
                        Give directly to the pastor
                      </h2>
                      <p className="text-sm text-on-surface-variant mt-1">
                        Ministerial gifts are received by direct bank transfer,
                        so the full amount reaches the pastor. Send your gift to
                        the account below.
                      </p>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest rounded-xl p-5 mt-6 space-y-3">
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-on-surface-variant text-sm">Bank</span>
                      <span className="font-semibold text-on-surface text-right">
                        {pastoralGivingAccount.bankName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-on-surface-variant text-sm">Account Name</span>
                      <span className="font-semibold text-on-surface text-right">
                        {pastoralGivingAccount.accountName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-on-surface-variant text-sm">Account Number</span>
                      <span className="font-bold text-xl text-primary tracking-wide">
                        {pastoralGivingAccount.accountNumber}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        copyToClipboard(
                          pastoralGivingAccount.accountNumber,
                          "pastoral-number"
                        )
                      }
                      className="w-full"
                    >
                      {copiedKey === "pastoral-number" ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      {copiedKey === "pastoral-number"
                        ? "Account number copied"
                        : "Copy account number"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(
                          formatBankDetails(pastoralGivingAccount),
                          "pastoral-bank"
                        )
                      }
                      className="w-full"
                    >
                      {copiedKey === "pastoral-bank" ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      {copiedKey === "pastoral-bank"
                        ? "Bank details copied"
                        : "Copy bank details"}
                    </Button>
                  </div>

                  <p className="text-xs text-on-surface-variant mt-4">
                    Giving to tithes, offerings or seeds? Choose another purpose
                    above to give online by card or transfer.
                  </p>
                </div>
              ) : (
                <>
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
                      <div className="text-xs text-on-surface-variant">Transfer securely via Bachs</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                onClick={handlePayment}
                isLoading={isSubmitting}
                disabled={isSubmitting}
                className="w-full bg-primary text-on-primary py-4 rounded-full font-bold text-base shadow-lg shadow-primary/20"
                size="lg"
              >
                {isSubmitting
                  ? "Processing..."
                  : `Donate ₦${amount > 0 ? amount.toLocaleString() : "0"}`}
              </Button>

              <p className="text-center text-sm text-on-surface-variant mt-4">
                {paymentMethod === "card-payment"
                  ? "Secure payment powered by Bachs"
                  : "You'll complete your transfer on Bachs' secure checkout"}
              </p>
                </>
              )}

              {/* Shown for every purpose, including ministerial giving — where
                  it is how a failed clipboard copy is reported. */}
              {error && (
                <div className="mt-6 p-4 bg-error-container rounded-xl flex items-center gap-3 text-on-error-container">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* ---- Right: Bank Details + Info ---- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Church bank details. Hidden for ministerial giving, where the
                pastor's own account is the one shown (see the panel in the
                form column) — two different sets of details on one screen is
                the fastest way to send a gift to the wrong account. */}
            {!isPastoralGiving && (
            <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/20">
              <h2 className="font-headline text-xl font-bold text-on-surface mb-6">
                Bank Transfer Details
              </h2>

              {bankAccounts.map((bank, index) => (
                <div key={index} className={`${index > 0 ? 'mt-6 pt-6 border-t border-outline-variant/50' : ''}`}>
                  <h3 className="font-bold text-on-surface mb-4">{bank.bankName}</h3>
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
                          onClick={() => copyToClipboard(bank.accountNumber, `number-${index}`)}
                          className="p-2 rounded-lg hover:bg-surface-container transition-colors"
                          aria-label={`Copy ${bank.bankName} account number`}
                        >
                          {copiedKey === `number-${index}` ? (
                            <Check className="w-4 h-4 text-primary" />
                          ) : (
                            <Copy className="w-4 h-4 text-on-surface-variant" />
                          )}
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(formatBankDetails(bank), `details-${index}`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-outline-variant hover:border-secondary transition-colors text-sm font-semibold text-on-surface"
                      aria-label={`Copy ${bank.bankName} bank details`}
                    >
                      {copiedKey === `details-${index}` ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4 text-on-surface-variant" />
                      )}
                      {copiedKey === `details-${index}`
                        ? "Bank details copied"
                        : "Copy bank details"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            )}

            {/* Scripture References */}
            <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/20">
              <h2 className="font-headline text-lg font-bold text-on-surface mb-4">
                Scripture on Giving
              </h2>
              <div className="space-y-3">
                {scriptureReferences.map((ref, i) => (
                  <p key={i} className="text-sm text-on-surface-variant italic leading-relaxed">
                    &ldquo;{ref}&rdquo;
                  </p>
                ))}
              </div>
            </div>

            {/* Quick tip */}
            {!isPastoralGiving && (
              <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/20">
                <h2 className="font-headline text-lg font-bold text-on-surface mb-4">
                  Prefer to transfer directly?
                </h2>
                <p className="text-sm text-on-surface-variant mb-6">
                  Send a transfer to the church accounts above yourself, or choose{" "}
                  <span className="font-semibold text-on-surface">Bank Transfer</span> in the
                  form to complete it on our secure checkout.
                </p>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank-transfer")}
                  className="text-secondary font-semibold text-sm underline underline-offset-4 hover:text-secondary/80 transition-colors"
                >
                  Use bank transfer instead
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
