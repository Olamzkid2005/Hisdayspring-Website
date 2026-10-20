/**
 * Book-order pricing and encoding, server-side only.
 *
 * The client sends book IDs and quantities — never prices. The total is
 * computed here from `data/books.ts` and the order rides in the checkout's
 * `metadata`, so a paid order can be decoded later from the checkout ID alone
 * with no database. Bachs is the record of truth.
 */

import { books, MAX_DISTINCT_TITLES, MAX_QUANTITY_PER_TITLE } from "@/data/books";
import type { BookOrderFulfillment, BookOrderItem } from "@/types";

export interface PricedBookOrder {
  items: BookOrderItem[];
  fulfillment: BookOrderFulfillment;
  /** Total in whole Naira (books are priced in whole Naira). */
  total: number;
  /** Compact item ids/quantities stored in checkout metadata. */
  itemsToken: string;
  /** Versioned title/price snapshot stored in checkout metadata for receipts. */
  orderSnapshot: string;
}

export interface BookOrderLine {
  bookId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface DecodedBookOrder {
  fulfillment: BookOrderFulfillment;
  lines: BookOrderLine[];
  total: number;
  /**
   * False when the paid order references a book that has since been removed
   * from the catalog or can no longer be priced. The order still decodes —
   * the payment happened — but staff must reconcile it by hand.
   */
  catalogMatch: boolean;
}

const MAX_TOKEN_LENGTH = 4000; // safely inside Bachs' 10 KB metadata budget
const MAX_ORDER_SNAPSHOT_LENGTH = 8000;

/**
 * Ceiling on raw cart entries, checked before any per-item work. The client
 * sends one entry per distinct title, so a genuine order never comes near this
 * — it exists only to bound the work a hostile payload can ask for. The real
 * limits are the catalog size (distinct titles) and `MAX_QUANTITY_PER_TITLE`.
 */
const MAX_CART_ENTRIES = 100;

function parseItemEntry(entry: unknown): BookOrderItem | null {
  if (!entry || typeof entry !== "object") return null;
  const value = entry as Record<string, unknown>;
  const bookId = typeof value.bookId === "string" ? value.bookId : null;
  const quantity =
    typeof value.quantity === "number" && Number.isInteger(value.quantity)
      ? value.quantity
      : null;
  if (
    !bookId ||
    !quantity ||
    quantity < 1 ||
    quantity > MAX_QUANTITY_PER_TITLE * MAX_CART_ENTRIES
  ) {
    return null;
  }
  return { bookId, quantity };
}

function parseFulfillment(value: unknown): BookOrderFulfillment | null {
  return value === "pickup" || value === "pdf" ? value : null;
}

/**
 * Validate a client-submitted cart and price it entirely server-side.
 *
 * Duplicate titles are merged. Quantities are clamped into the documented
 * bounds rather than trusted. Unknown book IDs, a missing fulfillment choice,
 * or an empty cart return `null` — the caller turns that into a 400.
 */
export function priceBookOrder(
  rawItems: unknown,
  rawFulfillment: unknown
): PricedBookOrder | null {
  const fulfillment = parseFulfillment(rawFulfillment);
  if (!fulfillment) return null;
  if (!Array.isArray(rawItems) || rawItems.length === 0) return null;
  if (rawItems.length > MAX_CART_ENTRIES) return null;

  // Merge duplicates first, then clamp the merged total — clamping per entry
  // would let 20 entries of 1 each slip past the cap, or a 1 + 50 split end up
  // at 21.
  const quantities = new Map<string, number>();
  for (const raw of rawItems) {
    const item = parseItemEntry(raw);
    if (!item) return null;
    const byId = books.find((book) => book.id === item.bookId);
    if (!byId) return null;

    quantities.set(item.bookId, (quantities.get(item.bookId) ?? 0) + item.quantity);
  }

  // Checked after merging so duplicates do not count against the cap: 26
  // entries collapsing to 13 titles is a 13-title order, and the whole catalog
  // must remain orderable in one go.
  if (quantities.size > MAX_DISTINCT_TITLES) return null;

  const items: BookOrderItem[] = [...quantities.entries()].map(
    ([bookId, quantity]) => ({
      bookId,
      quantity: Math.min(Math.max(1, quantity), MAX_QUANTITY_PER_TITLE),
    })
  );

  let total = 0;
  const orderLines: BookOrderLine[] = [];
  for (const item of items) {
    const book = books.find((candidate) => candidate.id === item.bookId)!;
    if (book.availability !== "in-stock") {
      return null;
    }
    const lineTotal = book.price * item.quantity;
    total += lineTotal;
    orderLines.push({
      bookId: book.id,
      title: book.title,
      quantity: item.quantity,
      unitPrice: book.price,
      lineTotal,
    });
  }

  const itemsToken = items
    .map((item) => `${item.bookId}:${item.quantity}`)
    .join("|");
  const orderSnapshot = JSON.stringify({ version: 1, lines: orderLines });
  if (
    itemsToken.length > MAX_TOKEN_LENGTH ||
    orderSnapshot.length > MAX_ORDER_SNAPSHOT_LENGTH
  ) {
    return null;
  }

  return { items, fulfillment, total, itemsToken, orderSnapshot };
}

/**
 * Decode an order previously stored in checkout metadata.
 *
 * Reads only from the server-side checkout session — never from anything the
 * browser could edit. A metadata blob that references a book that no longer
 * exists, or a total that no longer matches the catalog, still decodes (the
 * payment happened at the old price and the record must not lie) but is
 * flagged with `catalogMatch: false` so staff can reconcile by hand.
 */
export function decodeBookOrder(
  rawItemsToken: unknown,
  rawFulfillment: unknown,
  rawOrderSnapshot?: unknown
): DecodedBookOrder | null {
  const fulfillment = parseFulfillment(rawFulfillment);
  if (
    !fulfillment ||
    typeof rawItemsToken !== "string" ||
    rawItemsToken.length > MAX_TOKEN_LENGTH
  ) {
    return null;
  }

  if (rawOrderSnapshot !== undefined) {
    if (
      typeof rawOrderSnapshot !== "string" ||
      rawOrderSnapshot.length > MAX_ORDER_SNAPSHOT_LENGTH
    ) {
      return null;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawOrderSnapshot);
    } catch {
      return null;
    }
    if (!parsed || typeof parsed !== "object") return null;
    const snapshot = parsed as { version?: unknown; lines?: unknown };
    if (snapshot.version !== 1 || !Array.isArray(snapshot.lines)) return null;

    const tokenItems = rawItemsToken.split("|").map((entry) => {
      const separator = entry.lastIndexOf(":");
      if (separator <= 0) return null;
      const quantityText = entry.slice(separator + 1);
      if (!/^[1-9][0-9]*$/.test(quantityText)) return null;
      const quantity = Number(quantityText);
      return Number.isSafeInteger(quantity) && quantity <= MAX_QUANTITY_PER_TITLE
        ? { bookId: entry.slice(0, separator), quantity }
        : null;
    });
    if (tokenItems.length === 0 || tokenItems.some((item) => item === null)) {
      return null;
    }

    const lines: BookOrderLine[] = [];
    for (const rawLine of snapshot.lines) {
      if (!rawLine || typeof rawLine !== "object") return null;
      const line = rawLine as Record<string, unknown>;
      const { bookId, title, quantity, unitPrice, lineTotal } = line;
      if (
        typeof bookId !== "string" ||
        typeof title !== "string" ||
        !Number.isSafeInteger(quantity) ||
        (quantity as number) < 1 ||
        (quantity as number) > MAX_QUANTITY_PER_TITLE ||
        !Number.isSafeInteger(unitPrice) ||
        (unitPrice as number) < 0 ||
        !Number.isSafeInteger(lineTotal) ||
        lineTotal !== (unitPrice as number) * (quantity as number)
      ) {
        return null;
      }
      lines.push({
        bookId,
        title,
        quantity: quantity as number,
        unitPrice: unitPrice as number,
        lineTotal: lineTotal as number,
      });
    }

    const aligned = tokenItems.length === lines.length && tokenItems.every(
      (item, index) =>
        item !== null &&
        item.bookId === lines[index].bookId &&
        item.quantity === lines[index].quantity
    );
    if (!aligned) return null;

    const catalogMatch = lines.every((line) => {
      const book = books.find((candidate) => candidate.id === line.bookId);
      return (
        book !== undefined &&
        book.title === line.title &&
        book.price === line.unitPrice
      );
    });
    return {
      fulfillment,
      lines,
      total: lines.reduce((sum, line) => sum + line.lineTotal, 0),
      catalogMatch,
    };
  }

  // Compatibility for checkouts created before the immutable order snapshot.
  const lines: BookOrderLine[] = [];
  let total = 0;
  let catalogMatch = true;

  for (const entry of rawItemsToken.split("|")) {
    const separator = entry.lastIndexOf(":");
    if (separator <= 0) return null;
    const quantityText = entry.slice(separator + 1);
    if (!/^[1-9][0-9]*$/.test(quantityText)) return null;
    const quantity = Number(quantityText);
    if (!Number.isSafeInteger(quantity) || quantity > MAX_QUANTITY_PER_TITLE) {
      return null;
    }
    const bookId = entry.slice(0, separator);
    const book = books.find((candidate) => candidate.id === bookId);
    if (!book) {
      catalogMatch = false;
      lines.push({ bookId, title: bookId, quantity, unitPrice: 0, lineTotal: 0 });
      continue;
    }
    const lineTotal = book.price * quantity;
    lines.push({
      bookId: book.id,
      title: book.title,
      quantity,
      unitPrice: book.price,
      lineTotal,
    });
    total += lineTotal;
  }
  if (lines.length === 0) return null;
  return { fulfillment, lines, total, catalogMatch };
}
