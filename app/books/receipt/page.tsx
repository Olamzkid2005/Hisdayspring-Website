"use client";

/**
 * Printable book-order receipt.
 *
 * Reached from the paid confirmation (and re-openable later — the URL itself
 * is the receipt). Everything shown is re-verified server-side against Bachs
 * before render; the page never trusts the URL for money facts. Print /
 * Save-as-PDF shows only the receipt sheet: navigation, buttons and the site
 * chrome are removed by print styles in globals.css.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import {
  Check,
  Printer,
  Share2,
  Copy,
  CheckCheck,
  MapPin,
  Download,
  AlertCircle,
  Loader2,
  ImageDown,
  MessageCircle,
} from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import {
  clearLastCheckoutId,
  resolveReturnedCheckoutId,
  verifyBookOrder,
  type VerifiedBookOrder,
} from "@/lib/api/bachs";
import {
  CART_STORAGE_KEY,
  notifyCartChanged,
} from "@/hooks/useBookCartCount";
import { config } from "@/lib/config/env";

const CHURCH_NAME = "Hisdayspring Evangelical Ministry International";
const CHURCH_PHONE = "+234 807 782 9444";
const CHURCH_EMAIL = "hello@hisdayspring.org";

/** Church WhatsApp number in international digits-only form for wa.me links. */
const CHURCH_WHATSAPP = config.whatsappNumber.replace(/[^0-9]/g, "");

/** Corridor (e.g. NGN_CARD) → human label for the receipt. */
const PAYMENT_METHOD_LABELS: Record<string, string> = {
  NGN_CARD: "Card payment",
  NGN_BANK_TRANSFER: "Bank transfer",
};

type ReceiptState =
  | { kind: "loading" }
  | { kind: "verified"; order: VerifiedBookOrder; checkoutId: string; reference?: string; paymentMethod?: string }
  | { kind: "unpaid"; message: string }
  | { kind: "invalid" };

/**
 * A paid order means the cart's job is done — empty it so the buyer does not
 * walk around with stale items (and so the nav badge resets). Safe to run
 * repeatedly: the receipt page is the one place a checkout_id legitimately
 * lands twice (redirect + share link).
 */
function clearPaidCart(): void {
  try {
    if (window.localStorage.getItem(CART_STORAGE_KEY)) {
      window.localStorage.removeItem(CART_STORAGE_KEY);
      notifyCartChanged();
    }
  } catch {
    // Storage unavailable — the cart simply persists; not worth blocking.
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function BookReceiptPage() {
  const [state, setState] = useState<ReceiptState>({ kind: "loading" });
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [canShareFiles, setCanShareFiles] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Feature-detect both text sharing and file sharing (the receipt image)
    // so the right buttons appear on each device.
    const nav = navigator as Navigator & {
      canShare?: (data: ShareData) => boolean;
    };
    setCanShare(typeof nav.share === "function");
    try {
      const probe = new File(
        [new Blob([""], { type: "image/png" })],
        "probe.png",
        { type: "image/png" }
      );
      setCanShareFiles(
        Boolean(typeof nav.share === "function" && nav.canShare?.({ files: [probe] }))
      );
    } catch {
      setCanShareFiles(false);
    }
  }, []);

  useEffect(() => {
    // From the URL when shared/linked directly, else the id stashed before we
    // navigated to the hosted checkout (the sandbox redirects to the bare
    // success_url without any parameter).
    const checkoutId = resolveReturnedCheckoutId();
    if (!checkoutId) {
      setState({ kind: "invalid" });
      return;
    }

    let cancelled = false;
    void (async () => {
      // The helper retries internally through the redirect race (Bachs bounces
      // the buyer back a beat before the session settles).
      const result = await verifyBookOrder(checkoutId);
      if (cancelled) return;
      if (result.success) {
        clearPaidCart();
        // Consumed — a refresh of a verified receipt re-verifies from the URL
        // the buyer can copy from the address bar instead.
        clearLastCheckoutId();
        setState({
          kind: "verified",
          order: result.order,
          checkoutId,
          reference: result.reference,
          paymentMethod: result.paymentMethod,
        });
      } else {
        // Keep the stash: a pending bank transfer can be re-checked (button
        // below, or a refresh) until it settles.
        setState({ kind: "unpaid", message: result.message });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Manual re-check for bank transfers, which can settle well after the
   * buyer reached this page. Reuses the same verify path; the loading state
   * is shown inline so the buyer sees something is happening.
   */
  const recheckPayment = () => {
    const checkoutId = resolveReturnedCheckoutId();
    if (!checkoutId) return;
    setState({ kind: "loading" });
    void (async () => {
      const result = await verifyBookOrder(checkoutId, { retries: 2 });
      if (result.success) {
        clearPaidCart();
        clearLastCheckoutId();
        setState({
          kind: "verified",
          order: result.order,
          checkoutId,
          reference: result.reference,
          paymentMethod: result.paymentMethod,
        });
      } else {
        setState({ kind: "unpaid", message: result.message });
      }
    })();
  };

  const receiptText = useMemo(() => {
    if (state.kind !== "verified") return "";
    const origin = window.location.origin;
    const lines = [
      `🧾 RECEIPT — ${CHURCH_NAME}`,
      "",
      `Reference: ${state.reference ?? state.checkoutId}`,
      ...state.order.lines.map(
        (line) =>
          `• ${line.title} × ${line.quantity} — ₦${line.lineTotal.toLocaleString()}`
      ),
      `Total paid: ₦${state.order.total.toLocaleString()}`,
      state.order.fulfillment === "pickup"
        ? "Collection: pick up in church — show this reference at the bookstand."
        : "Collection: PDF copies (download from the receipt page).",
      "",
      `Receipt link: ${origin}/books/receipt?checkout_id=${encodeURIComponent(state.checkoutId)}`,
    ];
    return lines.join("\n");
  }, [state]);

  const shareReceipt = async () => {
    if (state.kind !== "verified") return;
    const url = `${window.location.origin}/books/receipt?checkout_id=${encodeURIComponent(state.checkoutId)}`;
    try {
      await navigator.share({
        title: `Receipt — ${CHURCH_NAME}`,
        text: receiptText,
        url,
      });
    } catch {
      // User cancelled or share failed — the copy/print buttons remain.
    }
  };

  /**
   * Order confirmation to the church's WhatsApp number.
   *
   * wa.me links can only pre-fill text — never attachments — so this opens
   * the church chat with the order message; the buyer then attaches the
   * receipt image ("Save receipt image" produces a logo-stamped PNG for
   * exactly this). The receipt link lets the bookstand verify independently.
   */
  const sendOrderOnWhatsApp = () => {
    if (state.kind !== "verified") return;
    const receiptUrl = `${window.location.origin}/books/receipt?checkout_id=${encodeURIComponent(state.checkoutId)}`;
    const firstLine = state.order.lines[0];
    const moreCount = state.order.lines.length - 1;
    const message = [
      `Hi, I just ordered from the ${CHURCH_NAME} bookstand.`,
      "",
      firstLine
        ? `Order: ${firstLine.quantity} × ${firstLine.title}${
            moreCount > 0
              ? ` (+${moreCount} more title${moreCount === 1 ? "" : "s"})`
              : ""
          }`
        : "Order: books",
      `Total paid: ₦${state.order.total.toLocaleString()}`,
      `Reference: ${state.reference ?? state.checkoutId}`,
      `Receipt: ${receiptUrl}`,
      "",
      "I have attached my receipt image.",
    ].join("\n");

    window.open(
      `https://wa.me/${CHURCH_WHATSAPP}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /**
   * Capture the receipt sheet as a PNG. The sheet is the whole receipt —
   * logo, lines, totals — while the action buttons live outside it, so the
   * image is clean by construction.
   */
  const captureReceiptImage = async (): Promise<Blob | null> => {
    if (!receiptRef.current) return null;
    const dataUrl = await toPng(receiptRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });
    const response = await fetch(dataUrl);
    return await response.blob();
  };

  /** Download the PNG (attach this in the WhatsApp chat you just opened). */
  const saveReceiptImage = async () => {
    if (state.kind !== "verified") return;
    setSavingImage(true);
    setActionError(null);
    try {
      const blob = await captureReceiptImage();
      if (!blob) throw new Error("capture failed");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `hisdayspring-receipt-${(state.reference ?? state.checkoutId).slice(-12)}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setActionError(
        "Could not save the image. Try again, or use Save as PDF — it also carries the logo."
      );
    } finally {
      setSavingImage(false);
    }
  };

  /** Native share sheet with the PNG attached (mobile). */
  const shareReceiptImage = async () => {
    if (state.kind !== "verified") return;
    setSavingImage(true);
    setActionError(null);
    try {
      const blob = await captureReceiptImage();
      if (!blob) throw new Error("capture failed");
      const file = new File([blob], "hisdayspring-receipt.png", {
        type: "image/png",
      });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `Receipt — ${CHURCH_NAME}` });
      } else {
        setActionError(
          "This browser can't share images directly — use Save image instead."
        );
      }
    } catch {
      setActionError(
        "Could not share the image. Save it instead and attach it in WhatsApp."
      );
    } finally {
      setSavingImage(false);
    }
  };

  const copyLink = async () => {
    if (state.kind !== "verified") return;
    const url = `${window.location.origin}/books/receipt?checkout_id=${encodeURIComponent(state.checkoutId)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard refused (permissions/insecure context); do nothing.
    }
  };

  // ---------- Loading ----------
  if (state.kind === "loading") {
    return (
      <section className="py-24 bg-surface-container-low min-h-screen flex items-center justify-center no-print">
        <div className="flex items-center gap-3 text-on-surface-variant">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Confirming your payment…</span>
        </div>
      </section>
    );
  }

  // ---------- Invalid / unpaid ----------
  if (state.kind === "invalid" || state.kind === "unpaid") {
    return (
      <section className="py-24 bg-surface-container-low min-h-screen no-print">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-on-error-container" />
          </div>
          <h1 className="font-headline text-2xl font-bold text-on-surface mb-3">
            {state.kind === "invalid"
              ? "This receipt link is not valid"
              : "Payment not confirmed"}
          </h1>
          <p className="text-on-surface-variant mb-8">
            {state.kind === "invalid"
              ? "Check the link you were sent — it should look like /books/receipt?checkout_id=chk_..."
              : state.message}
          </p>
          {state.kind === "unpaid" && (
            <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
              <button
                type="button"
                onClick={recheckPayment}
                className={buttonClasses("primary")}
              >
                Check again
              </button>
              <span className="text-sm text-on-surface-variant">
                Bank transfers can take a few minutes to reflect.
              </span>
            </div>
          )}
          <a href="/books" className={buttonClasses(state.kind === "unpaid" ? "outline" : "primary")}>
            Back to books
          </a>
        </div>
      </section>
    );
  }

  // ---------- Verified receipt ----------
  const { order, checkoutId, reference, paymentMethod } = state;
  const isPickup = order.fulfillment === "pickup";

  return (
    <section className="py-12 md:py-20 bg-surface-container-low min-h-screen">
      <div className="max-w-2xl mx-auto px-4 md:px-8">
        {/* Actions — hidden when printing */}
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <a
            href="/books"
            className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors text-sm font-medium"
          >
            ← Back to books
          </a>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className={buttonClasses("outline", "sm")}
            >
              <Printer className="w-4 h-4 mr-1" />
              Save as PDF
            </button>
            <button
              type="button"
              onClick={saveReceiptImage}
              disabled={savingImage}
              className={buttonClasses("outline", "sm")}
            >
              {savingImage ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <ImageDown className="w-4 h-4 mr-1" />
              )}
              Save image
            </button>
            {canShareFiles && (
              <button
                type="button"
                onClick={shareReceiptImage}
                disabled={savingImage}
                className={buttonClasses("outline", "sm")}
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share image
              </button>
            )}
            <button
              type="button"
              onClick={copyLink}
              className={buttonClasses("outline", "sm")}
            >
              {copied ? (
                <CheckCheck className="w-4 h-4 mr-1 text-primary" />
              ) : (
                <Copy className="w-4 h-4 mr-1" />
              )}
              {copied ? "Link copied" : "Copy link"}
            </button>
            {canShare && (
              <button
                type="button"
                onClick={shareReceipt}
                className={buttonClasses("outline", "sm")}
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </button>
            )}
            <button
              type="button"
              onClick={sendOrderOnWhatsApp}
              className={buttonClasses("secondary", "sm")}
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Send to church on WhatsApp
            </button>
          </div>
          {actionError && (
            <p role="alert" className="mt-2 text-sm text-error w-full">
              {actionError}
            </p>
          )}
        </div>

        {/* The receipt sheet — everything inside this ref is what the saved
            image contains, so the logo rides along automatically. */}
        <motion.div
          ref={receiptRef}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="receipt-sheet bg-surface-container-lowest rounded-3xl shadow-lg border border-outline-variant/20 overflow-hidden"
        >
          {/* Letterhead */}
          <div className="px-8 pt-8 pb-6 border-b border-outline-variant/30 text-center">
            <div className="relative w-28 h-28 mx-auto mb-4">
              <Image
                src="/images/logo/Logo-Website.png"
                alt={`${CHURCH_NAME} logo`}
                fill
                sizes="112px"
                className="object-contain"
              />
            </div>
            <h1 className="font-headline text-xl font-bold text-on-surface">
              {CHURCH_NAME}
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Book order receipt
            </p>
          </div>

          {/* Paid banner */}
          <div className="px-8 py-5 bg-secondary-container/30 border-b border-outline-variant/30">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </span>
              <div>
                <p className="font-bold text-on-surface">Payment received</p>
                <p className="text-xs text-on-surface-variant">
                  {paymentMethod
                    ? (PAYMENT_METHOD_LABELS[paymentMethod] ?? paymentMethod)
                    : "Verified against our payment processor"}
                </p>
              </div>
            </div>
          </div>

          {/* Order lines */}
          <div className="px-8 py-6 space-y-4">
            {order.lines.map((line) => (
              <div
                key={line.bookId}
                className="flex items-start justify-between gap-4"
              >
                <div>
                  <p className="font-semibold text-on-surface text-sm">
                    {line.title}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    ₦{line.unitPrice.toLocaleString()} × {line.quantity}
                  </p>
                </div>
                <span className="font-bold text-on-surface text-sm whitespace-nowrap">
                  ₦{line.lineTotal.toLocaleString()}
                </span>
              </div>
            ))}

            {!order.catalogMatch && (
              <div className="p-3 bg-error-container rounded-xl text-on-error-container text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  A title in this order is no longer listed in the catalogue.
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
              <span className="font-bold text-on-surface">Total paid</span>
              <span className="font-headline font-bold text-secondary text-2xl">
                ₦{order.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Details grid */}
          <div className="px-8 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                Reference
              </p>
              <p className="font-mono text-xs text-on-surface break-all">
                {reference ?? checkoutId}
              </p>
            </div>
            {order.buyer?.name && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                  Name
                </p>
                <p className="text-on-surface">{order.buyer.name}</p>
              </div>
            )}
            {order.buyer?.phone && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                  Phone
                </p>
                <p className="text-on-surface">{order.buyer.phone}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                Collection
              </p>
              <p className="text-on-surface flex items-start gap-1.5">
                {isPickup ? (
                  <>
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    Pick up in church
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 shrink-0 mt-0.5" />
                    PDF copies
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Pickup instructions / PDF links */}
          {isPickup ? (
            <div className="mx-8 mb-8 p-4 bg-surface-container-low rounded-2xl text-sm text-on-surface-variant">
              Show this receipt (or quote the reference) at the bookstand in
              church to collect your copies. Bookstand staff verify every
              reference before handing over books.
            </div>
          ) : (
            <div className="mx-8 mb-8 space-y-2">
              {order.lines.map((line) => (
                <a
                  key={line.bookId}
                  href={`/api/payments/bachs/book-order/download?checkout_id=${encodeURIComponent(
                    checkoutId
                  )}&book=${encodeURIComponent(line.bookId)}`}
                  className="flex items-center justify-between gap-3 p-3 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors"
                >
                  <span className="text-sm text-on-surface truncate">
                    {line.title}
                  </span>
                  <span className="text-sm font-semibold text-secondary whitespace-nowrap">
                    Download PDF
                  </span>
                </a>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="px-8 py-5 border-t border-outline-variant/30 text-center">
            <p className="text-xs text-on-surface-variant">
              {CHURCH_NAME} · {CHURCH_PHONE} · {CHURCH_EMAIL}
            </p>
            <p className="text-[11px] text-on-surface-variant/70 mt-1">
              Electronic receipt — verified against our payment processor.
              Thank you for your support.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
