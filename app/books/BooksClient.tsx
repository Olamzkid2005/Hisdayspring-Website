"use client";

/**
 * Book ordering — browse, cart, checkout, and post-payment handling.
 *
 * Paid via the same Bachs pipeline as giving: the cart is priced server-side,
 * the payment completes on Bachs' hosted checkout, and the return trip is
 * confirmed against the API before any success screen or download is shown.
 *
 * Fulfilment is deliberately offline-friendly:
 * - "Pick up in church" → the buyer shows the reference at the bookstand.
 * - "PDF" → per-book download links, served only for completed checkouts.
 */

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Plus,
  Minus,
  Check,
  Download,
  MapPin,
  AlertCircle,
  ArrowLeft,
  Trash2,
  FileText,
} from "lucide-react";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { books, MAX_QUANTITY_PER_TITLE } from "@/data/books";
import {
  verifyBookOrder,
  type VerifiedBookOrder,
} from "@/lib/api/bachs";
import {
  notifyCartChanged,
  CART_STORAGE_KEY,
} from "@/hooks/useBookCartCount";
import type { BookOrderFulfillment } from "@/types";

type Stage = "browse" | "checkout" | "paid";

const DOWNLOAD_URL = "/api/payments/bachs/book-order/download";


export default function BooksClient() {
  const [cart, setCart] = useState<Record<string, number>>({});
  /**
   * The cart survives refreshes and navigation via localStorage. Rendering
   * starts empty (matching the server markup), then the stored cart is read
   * after mount — writes are suppressed until that read is done so the
   * initial empty state never overwrites what was saved.
   */
  const [cartHydrated, setCartHydrated] = useState(false);
  const [stage, setStage] = useState<Stage>("browse");
  const [fulfillment, setFulfillment] = useState<BookOrderFulfillment>("pickup");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paidOrder, setPaidOrder] = useState<VerifiedBookOrder | null>(null);
  /** Business reference shown to the buyer for pickup/records. */
  const [paidReference, setPaidReference] = useState<string | null>(null);
  /** Checkout id — what the download route verifies against. */
  const [paidCheckoutId, setPaidCheckoutId] = useState<string | null>(null);

  const cartLines = useMemo(
    () =>
      Object.entries(cart)
        .map(([bookId, quantity]) => {
          const book = books.find((candidate) => candidate.id === bookId);
          if (!book) return null;
          return { book, quantity, lineTotal: book.price * quantity };
        })
        .filter((line): line is NonNullable<typeof line> => line !== null),
    [cart]
  );

  const cartTotal = cartLines.reduce((sum, line) => sum + line.lineTotal, 0);
  const cartCount = cartLines.reduce((sum, line) => sum + line.quantity, 0);

  // Restore the saved cart once after mount. Only known titles in valid
  // quantity bounds are accepted, so stale entries (a book since removed
  // from the catalogue, hand-edited storage) are dropped silently.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        const restored: Record<string, number> = {};
        for (const [bookId, quantity] of Object.entries(parsed)) {
          if (
            books.some((book) => book.id === bookId) &&
            typeof quantity === "number" &&
            Number.isInteger(quantity) &&
            quantity >= 1 &&
            quantity <= MAX_QUANTITY_PER_TITLE
          ) {
            restored[bookId] = quantity;
          }
        }
        setCart(restored);
      }
    } catch {
      // Corrupted or unavailable storage — an empty cart is the safe state.
    }
    setCartHydrated(true);
  }, []);

  // Persist on every change after the initial read, and tell the nav badge
  // (same tab; other tabs hear it via the storage event).
  useEffect(() => {
    if (!cartHydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Storage full or blocked (private mode) — the cart still works in
      // memory for this visit, it just will not survive a refresh.
    }
    notifyCartChanged();
  }, [cart, cartHydrated]);

  // Bachs returns the buyer to /books?checkout_id=... — confirm server-side
  // before showing anything paid. The parameter is stripped once handled so a
  // refresh cannot replay the confirmation (and so a double-invoked effect in
  // strict mode reads the same id rather than racing itself).
  useEffect(() => {
    const checkoutId = new URLSearchParams(window.location.search).get(
      "checkout_id"
    );
    if (!checkoutId) return;

    let cancelled = false;
    void (async () => {
      // Retries internally through the redirect race (Bachs bounces the buyer
      // back a beat before the checkout session settles).
      const result = await verifyBookOrder(checkoutId);
      if (cancelled) return;

      // Strip the parameter only once settled, so an unpaid/pending checkout
      // survives a refresh and can be re-verified after the fact.
      window.history.replaceState({}, "", window.location.pathname);

      if (result.success) {
        // The order is paid — the cart's job is done. Empty it now (the
        // persistence effect saves the empty cart too) so the buyer does not
        // walk around with a stale cart of books they already bought.
        setCart({});
        setPaidOrder(result.order);
        setPaidReference(result.reference ?? result.checkoutId);
        setPaidCheckoutId(result.checkoutId);
        setStage("paid");
      } else {
        setError(result.message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const addToCart = (bookId: string) => {
    setError(null);
    setCart((prev) => ({
      ...prev,
      [bookId]: Math.min((prev[bookId] ?? 0) + 1, MAX_QUANTITY_PER_TITLE),
    }));
  };

  const setQuantity = (bookId: string, quantity: number) => {
    setCart((prev) => {
      const next = { ...prev };
      if (quantity <= 0) {
        delete next[bookId];
      } else {
        next[bookId] = Math.min(quantity, MAX_QUANTITY_PER_TITLE);
      }
      return next;
    });
  };

  const clearCart = () => {
    setCart({});
    setError(null);
  };

  const startCheckout = () => setStage("checkout");

  const submitOrder = async () => {
    setError(null);

    if (buyerName.trim().length === 0) {
      setError("Please enter your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (buyerPhone.trim().length === 0) {
      setError("Please enter your phone number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        "/api/payments/bachs/book-order/initialize",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: buyerName.trim(),
            email: buyerEmail.trim(),
            phone: buyerPhone.trim(),
            paymentMethod: "card-payment",
            fulfillment,
            items: cartLines.map((line) => ({
              bookId: line.book.id,
              quantity: line.quantity,
            })),
          }),
        }
      );
      const data = (await response.json()) as {
        success: boolean;
        message?: string;
        authorizationUrl?: string;
      };

      if (data.success && data.authorizationUrl) {
        window.location.assign(data.authorizationUrl);
        return;
      }
      setError(data.message || "Could not start the checkout. Please try again.");
    } catch {
      setError("Unable to reach the payment service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- Paid (post-checkout) ----------
  if (stage === "paid" && paidOrder) {
    return (
      <section className="py-16 md:py-24 bg-surface-container-low min-h-screen">
        <div className="max-w-2xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-lg text-center"
          >
            <div className="w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-secondary" />
            </div>
            <h1 className="font-headline text-3xl font-bold text-on-surface mb-3">
              Order paid — thank you!
            </h1>
            <p className="text-on-surface-variant mb-8">
              {paidOrder.fulfillment === "pickup"
                ? "Show this reference at the bookstand in church to collect your books."
                : "Your PDF copies are ready below — download them now or save this page."}
            </p>

            <div className="bg-surface-container-low rounded-2xl p-6 text-left space-y-4 mb-6">
              {paidOrder.lines.map((line) => (
                <div
                  key={line.bookId}
                  className="flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-on-surface text-sm">
                      {line.title}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {line.quantity} × ₦{line.unitPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-on-surface text-sm whitespace-nowrap">
                      ₦{line.lineTotal.toLocaleString()}
                    </span>
                    {paidOrder.fulfillment === "pdf" && (
                      <a
                        href={`${DOWNLOAD_URL}?checkout_id=${encodeURIComponent(
                          paidCheckoutId ?? ""
                        )}&book=${encodeURIComponent(line.bookId)}`}
                        className={buttonClasses("outline", "sm")}
                        aria-label={`Download ${line.title} PDF`}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex justify-between pt-4 border-t border-outline-variant/30">
                <span className="text-on-surface-variant">Total paid</span>
                <span className="font-bold text-secondary text-xl">
                  ₦{paidOrder.total.toLocaleString()}
                </span>
              </div>
            </div>

            {paidReference && (
              <div className="bg-surface-container-low rounded-2xl p-6 mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
                  {paidOrder.fulfillment === "pickup"
                    ? "Your pickup reference"
                    : "Your payment reference"}
                </p>
                <p className="font-mono text-sm text-on-surface break-all">
                  {paidReference}
                </p>
              </div>
            )}

            {!paidOrder.catalogMatch && (
              <div className="bg-error-container rounded-2xl p-4 text-on-error-container text-sm mb-6 flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  One of the titles in this order is no longer in the online
                  catalogue. The bookstand staff will help you collect it.
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              onClick={() => {
                setStage("browse");
                setCart({});
                setPaidOrder(null);
                setPaidReference(null);
                setPaidCheckoutId(null);
              }}
            >
              Back to books
            </Button>
            {/* The receipt lives at its own URL, so it stays openable later —
                shareable on WhatsApp, printable, and safe to bookmark. */}
            {paidCheckoutId && (
              <a
                href={`/books/receipt?checkout_id=${encodeURIComponent(paidCheckoutId)}`}
                className={buttonClasses("outline")}
              >
                <FileText className="w-4 h-4 mr-2" />
                View / share receipt
              </a>
            )}
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // ---------- Checkout ----------
  if (stage === "checkout") {
    return (
      <section className="py-16 md:py-24 bg-surface-container-low min-h-screen">
        <div className="max-w-2xl mx-auto px-4 md:px-8">
          <button
            type="button"
            onClick={() => setStage("browse")}
            className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors text-sm font-medium mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to books
          </button>

          <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-sm border border-outline-variant/20">
            <h1 className="font-headline text-2xl font-bold text-on-surface mb-2">
              Book order
            </h1>
            <p className="text-sm text-on-surface-variant mb-8">
              Paid securely through Bachs — collect in church or download PDFs.
            </p>

            {/* Order summary */}
            <div className="bg-surface-container-low rounded-2xl p-6 mb-8 space-y-3">
              {cartLines.map((line) => (
                <div
                  key={line.book.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-on-surface text-sm">
                      {line.book.title}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {line.quantity} × ₦{line.book.price.toLocaleString()}
                    </p>
                  </div>
                  <span className="font-bold text-on-surface text-sm whitespace-nowrap">
                    ₦{line.lineTotal.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex justify-between pt-4 border-t border-outline-variant/30">
                <span className="text-on-surface-variant">Total</span>
                <span className="font-bold text-secondary text-xl">
                  ₦{cartTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Fulfillment */}
            <p className="block text-sm font-semibold text-on-surface mb-3">
              How would you like to receive your books?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button
                type="button"
                onClick={() => setFulfillment("pickup")}
                aria-pressed={fulfillment === "pickup"}
                className={`p-4 rounded-xl border-2 flex items-start gap-3 text-left transition-all ${
                  fulfillment === "pickup"
                    ? "border-secondary bg-secondary-container/20"
                    : "border-outline-variant hover:border-secondary"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    fulfillment === "pickup"
                      ? "bg-secondary text-on-secondary"
                      : "bg-surface-container-high"
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <span>
                  <span
                    className={`block font-semibold ${
                      fulfillment === "pickup"
                        ? "text-secondary"
                        : "text-on-surface"
                    }`}
                  >
                    Pick up in church
                  </span>
                  <span className="block text-xs text-on-surface-variant mt-1">
                    Show your receipt reference at the bookstand on Sunday.
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFulfillment("pdf")}
                aria-pressed={fulfillment === "pdf"}
                className={`p-4 rounded-xl border-2 flex items-start gap-3 text-left transition-all ${
                  fulfillment === "pdf"
                    ? "border-secondary bg-secondary-container/20"
                    : "border-outline-variant hover:border-secondary"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    fulfillment === "pdf"
                      ? "bg-secondary text-on-secondary"
                      : "bg-surface-container-high"
                  }`}
                >
                  <Download className="w-5 h-5" />
                </div>
                <span>
                  <span
                    className={`block font-semibold ${
                      fulfillment === "pdf"
                        ? "text-secondary"
                        : "text-on-surface"
                    }`}
                  >
                    PDF copies
                  </span>
                  <span className="block text-xs text-on-surface-variant mt-1">
                    Download links appear immediately after payment.
                  </span>
                </span>
              </button>
            </div>

            {/* Buyer details */}
            <div className="mb-8">
              <p className="block text-sm font-semibold text-on-surface mb-3">
                Your information
              </p>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  name="buyerName"
                  value={buyerName}
                  onChange={(event) => setBuyerName(event.target.value)}
                  required
                />
                <Input
                  label="Email Address"
                  name="buyerEmail"
                  type="email"
                  value={buyerEmail}
                  onChange={(event) => setBuyerEmail(event.target.value)}
                  required
                />
                <Input
                  label="Phone Number"
                  name="buyerPhone"
                  type="tel"
                  value={buyerPhone}
                  onChange={(event) => setBuyerPhone(event.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-6 p-4 bg-error-container rounded-xl flex items-center gap-3 text-on-error-container"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <Button
              onClick={submitOrder}
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="w-full bg-primary text-on-primary py-4 rounded-full font-bold text-base shadow-lg shadow-primary/20"
              size="lg"
            >
              {isSubmitting
                ? "Processing..."
                : `Pay ₦${cartTotal.toLocaleString()}`}
            </Button>
            <p className="text-center text-sm text-on-surface-variant mt-4">
              Secure payment powered by Bachs
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ---------- Browse ----------
  return (
    <section className="py-16 md:py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* A failed return-from-checkout lands back here, so the message must
            be visible on this stage too. */}
        {error && (
          <div
            role="alert"
            className="mb-8 p-4 bg-error-container rounded-xl flex items-center gap-3 text-on-error-container"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {books.map((book) => {
            const inCart = cart[book.id] ?? 0;
            const digitalUnavailable =
              book.availability === "out-of-stock";
            return (
              <div
                key={book.id}
                className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-surface-container-low">
                  <Image
                    src={book.imageUrl}
                    alt={book.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      book.availability === "in-stock"
                        ? "bg-secondary-container text-on-secondary-container"
                        : book.availability === "digital-only"
                          ? "bg-primary-container text-on-primary-container"
                          : "bg-surface-variant text-on-surface-variant"
                    }`}
                  >
                    {book.availability.replace("-", " ")}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="font-headline text-lg text-on-surface leading-snug">
                    {book.title}
                  </h2>
                  <p className="text-secondary font-semibold text-sm mt-1">
                    {book.author}
                  </p>
                  <p className="text-sm text-on-surface-variant mt-3 leading-relaxed flex-1">
                    {book.description}
                  </p>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-outline-variant/30">
                    <span className="font-headline font-bold text-primary">
                      ₦{book.price.toLocaleString()}
                    </span>

                    {inCart === 0 ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={digitalUnavailable}
                        onClick={() => addToCart(book.id)}
                        aria-label={`Add ${book.title} to order`}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQuantity(book.id, inCart - 1)}
                          aria-label={`Remove one copy of ${book.title}`}
                          className="p-2 rounded-lg border border-outline-variant hover:border-secondary transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span
                          className="font-bold text-on-surface w-6 text-center"
                          aria-label={`${book.title}: ${inCart} ${inCart === 1 ? "copy" : "copies"}`}
                        >
                          {inCart}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(book.id, inCart + 1)}
                          aria-label={`Add one more copy of ${book.title}`}
                          className="p-2 rounded-lg border border-outline-variant hover:border-secondary transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating cart bar */}
      {cartCount > 0 && stage === "browse" && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[min(94vw,32rem)]"
        >
          <div className="bg-surface-container-high/95 backdrop-blur-md rounded-2xl shadow-lg border border-outline-variant/30 px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="relative shrink-0">
                <ShoppingCart className="w-5 h-5 text-on-surface" />
                <span className="absolute -top-2 -right-2 bg-secondary text-on-secondary text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              </span>
              <div className="min-w-0">
                <p className="text-xs text-on-surface-variant truncate">
                  {cartLines.map((line) => line.book.title).join(", ")}
                </p>
                <p className="font-bold text-on-surface">
                  ₦{cartTotal.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={clearCart}
                aria-label="Clear all items from your order"
                className="p-2 rounded-lg border border-outline-variant hover:border-error hover:text-error transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <Button size="sm" onClick={startCheckout}>
                Checkout
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
