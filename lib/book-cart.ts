"use client";

/**
 * The book cart is an external store: it lives in localStorage, which React
 * state cannot observe. It is therefore read with `useSyncExternalStore`
 * instead of being mirrored into state from an effect.
 *
 * That distinction is not cosmetic:
 * - The floating summary in the browse view renders cart contents, so restoring
 *   with a lazy `useState` initializer would make the client's hydration render
 *   disagree with the server HTML. The server snapshot here is the empty cart,
 *   so hydration matches and React re-renders with the stored cart afterwards.
 * - Restoring into state from an effect rendered twice and painted "no items"
 *   first.
 *
 * One validated snapshot is shared by the cart page and the nav badge, so both
 * always agree on what is in the cart.
 *
 * `getCartSnapshot` re-reads storage and caches the *parsed* result against the
 * raw string it came from. React requires a stable identity when nothing has
 * changed (or it re-renders forever) and a fresh one when something has, and
 * keying off the raw string gives both without ever serving a stale cart.
 */

import { books, MAX_QUANTITY_PER_TITLE } from "@/data/books";

export const CART_STORAGE_KEY = "hisdayspring-book-cart";
export const CART_CHANGED_EVENT = "hds-cart-changed";

export type Cart = Record<string, number>;

/** Frozen: the server render and the first client render must share this. */
export const EMPTY_CART: Cart = Object.freeze({}) as Cart;

/** undefined = nothing read yet, so the first call always reads storage. */
let cachedRaw: string | null | undefined = undefined;
let cachedCart: Cart = EMPTY_CART;

/** Keep only known titles, at integer quantities within bounds. */
function sanitize(input: unknown): Cart {
  if (!input || typeof input !== "object") return EMPTY_CART;
  const clean: Cart = {};
  for (const [bookId, quantity] of Object.entries(input as Record<string, unknown>)) {
    if (
      books.some((book) => book.id === bookId) &&
      typeof quantity === "number" &&
      Number.isInteger(quantity) &&
      quantity >= 1 &&
      quantity <= MAX_QUANTITY_PER_TITLE
    ) {
      clean[bookId] = quantity;
    }
  }
  return Object.keys(clean).length === 0 ? EMPTY_CART : clean;
}

/** Parse a raw storage value into a validated cart. */
function fromRaw(raw: string | null): Cart {
  if (!raw) return EMPTY_CART;
  try {
    return sanitize(JSON.parse(raw));
  } catch {
    // Corrupt value — an empty cart is the safe state.
    return EMPTY_CART;
  }
}

export function getCartSnapshot(): Cart {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(CART_STORAGE_KEY);
  } catch {
    // Storage unavailable — serve whatever we already have in memory.
    return cachedCart;
  }
  if (raw === cachedRaw) return cachedCart;
  cachedRaw = raw;
  cachedCart = fromRaw(raw);
  return cachedCart;
}

export function getServerCartSnapshot(): Cart {
  return EMPTY_CART;
}

function emit(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CART_CHANGED_EVENT));
  }
}

export function subscribeToCart(onStoreChange: () => void): () => void {
  // "storage" covers other tabs, the custom event covers this one, and the
  // visibility check covers a backgrounded tab that missed a change. All three
  // only have to announce; the next snapshot read picks up the new value.
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CART_CHANGED_EVENT, onStoreChange);
  document.addEventListener("visibilitychange", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CART_CHANGED_EVENT, onStoreChange);
    document.removeEventListener("visibilitychange", onStoreChange);
  };
}

/**
 * Replace the cart and persist it. The in-memory snapshot is updated even when
 * storage throws, so a blocked/private-mode browser still gets a working cart
 * for the visit — it just will not survive a refresh.
 */
export function writeCart(next: Cart): void {
  const clean = sanitize(next);
  cachedCart = clean;

  try {
    // An emptied cart is stored as "{}" rather than removed: that is what the
    // previous persist-on-change effect wrote, and the badge counts it as zero.
    const raw = JSON.stringify(clean);
    window.localStorage.setItem(CART_STORAGE_KEY, raw);
    cachedRaw = raw;
  } catch {
    // Storage full/blocked: leave `cachedRaw` alone so a failed write cannot
    // make the next read believe it succeeded.
  }

  emit();
}

/** Announce a change made directly against storage. */
export function notifyCartChanged(): void {
  emit();
}

export function cartItemCount(cart: Cart): number {
  return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
}
