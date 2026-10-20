import { NextResponse } from "next/server";
import { getBachsCheckoutSession, isBachsConfigured } from "@/lib/server/bachs";
import { decodeBookOrder } from "@/lib/server/book-orders";
import { books, bookPdfUrl } from "@/data/books";
import { getCloudinaryCloudName } from "@/lib/cdn/cloudinary-cloud-name";
import { checkPaymentRateLimit } from "@/lib/server/request-guards";

/**
 * Paid PDF delivery, stateless.
 *
 * There is no database and no session store, so every download request
 * re-verifies the checkout against Bachs' API: the URL's checkout_id must be a
 * *completed* checkout whose metadata encodes a paid order containing this
 * book as a PDF (or both-format) purchase. Anyone with the link can download,
 * exactly like a normal download link — but the link only exists after real
 * payment, and it is a per-checkout code the buyer was shown on their receipt.
 */
export async function GET(request: Request) {
  const rateLimit = checkPaymentRateLimit(request, "book-download", 30, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, message: "Too many download attempts. Try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      }
    );
  }

  if (!isBachsConfigured()) {
    return NextResponse.json(
      { success: false, message: "Payment system is not configured" },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const checkoutId = searchParams.get("checkout_id");
  const bookId = searchParams.get("book");

  // IDs are opaque prefixed strings; validate the shapes before use.
  if (
    !checkoutId ||
    !/^[A-Za-z0-9._:-]{1,200}$/.test(checkoutId) ||
    !bookId ||
    !/^[a-z0-9-]{1,100}$/.test(bookId)
  ) {
    return NextResponse.json(
      { success: false, message: "Invalid download link" },
      { status: 400 }
    );
  }

  const result = await getBachsCheckoutSession(checkoutId);
  if (!result.ok || result.data.status !== "completed") {
    return NextResponse.json(
      {
        success: false,
        message: "We could not confirm a completed payment for this link.",
      },
      { status: 403 }
    );
  }

  const metadata = result.data.metadata;
  const order = metadata
    ? decodeBookOrder(
        metadata.items,
        metadata.fulfillment,
        metadata.order_snapshot
      )
    : null;

  if (!order) {
    return NextResponse.json(
      {
        success: false,
        message: "This checkout is not a book order.",
      },
      { status: 403 }
    );
  }

  const amountPaid =
    typeof result.data.amountPaid === "number"
      ? result.data.amountPaid
      : typeof result.data.amountPaid === "string" &&
          /^\d+(?:\.\d{1,2})?$/.test(result.data.amountPaid)
        ? Number(result.data.amountPaid)
        : undefined;
  const amountRemaining =
    typeof result.data.amountRemaining === "number"
      ? result.data.amountRemaining
      : typeof result.data.amountRemaining === "string" &&
          /^\d+(?:\.\d{1,2})?$/.test(result.data.amountRemaining)
        ? Number(result.data.amountRemaining)
        : undefined;
  if (
    metadata?.type !== "book-order" ||
    result.data.currency !== "NGN" ||
    amountPaid === undefined ||
    amountRemaining === undefined ||
    amountRemaining > 0.01 ||
    Math.abs(amountPaid - order.total) > 0.01
  ) {
    return NextResponse.json(
      { success: false, message: "Payment amount does not match this order." },
      { status: 403 }
    );
  }

  const line = order.lines.find((item) => item.bookId === bookId);
  if (!line) {
    return NextResponse.json(
      {
        success: false,
        message: "This book was not part of the paid order.",
      },
      { status: 403 }
    );
  }

  const book = books.find((candidate) => candidate.id === bookId);
  if (!book) {
    return NextResponse.json(
      {
        success: false,
        message: "This book is no longer available for PDF delivery.",
      },
      { status: 403 }
    );
  }
  if (
    order.fulfillment !== "pdf" ||
    (book.format !== "ebook" && book.format !== "both")
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "This order was for printed copies, not a PDF.",
      },
      { status: 403 }
    );
  }

  // Fetch the PDF from Cloudinary and stream it through with a download
  // filename, so the buyer never sees a bare CDN URL they could share as a
  // permanent link. Delivery is still link-based (per checkout), which is the
  // accepted trade-off of the stateless design.
  const cloudName = getCloudinaryCloudName();
  const publicId = bookPdfUrl(book); // e.g. "images/books/pdf/<id>"
  const pdfResponse = await fetch(
    `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`,
    { cache: "no-store" }
  );

  if (!pdfResponse.ok || !pdfResponse.body) {
    return NextResponse.json(
      {
        success: false,
        message:
          "The PDF for this title is not available yet — please contact the bookstand staff.",
      },
      { status: 404 }
    );
  }

  return new NextResponse(pdfResponse.body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${bookId}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
