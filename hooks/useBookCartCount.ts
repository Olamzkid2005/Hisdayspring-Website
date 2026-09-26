"use client";

/**
 * Live count of items in the persisted book cart, for the nav badge.
 *
 * The cart lives in localStorage (written by `BooksClient`), which React state
 * alone cannot observe. This is an external store, so it is read through
 * `useSyncExternalStore`: the count is derived on every render and re-derived
 * when:
 * - another tab changes it (`storage` event),
 * - `BooksClient` announces a change on this tab (`hds-cart-changed`), or
 * - the tab becomes visible again after being backgrounded.
 *
 * Every read is validated the same way the cart page restores: only known
 * book IDs in sane quantity bounds are counted.
 */

import { useSyncExternalStore } from "react";
import { books, MAX_QUANTITY_PER_TITLE } from "@/data/books";

export const CART_STORAGE_KEY = "hisdayspring-book-cart";
export const CART_CHANGED_EVENT = "hds-cart-changed";

function countCartItems(): number {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return Object.entries(parsed).reduce((total, [bookId, quantity]) => {
      const known = books.some((book) => book.id === bookId);
      const valid =
        typeof quantity === "number" &&
        Number.isInteger(quantity) &&
        quantity >= 1 &&
        quantity <= MAX_QUANTITY_PER_TITLE;
      return total + (known && valid ? quantity : 0);
    }, 0);
  } catch {
    return 0;
  }
}

/** Everything that can mean "the stored cart has changed". */
function subscribeToCart(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CART_CHANGED_EVENT, onStoreChange);
  document.addEventListener("visibilitychange", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CART_CHANGED_EVENT, onStoreChange);
    document.removeEventListener("visibilitychange", onStoreChange);
  };
}

export function useBookCartCount(): number {
  // Read the store during render rather than mirroring it into state from an
  // effect: the effect version rendered twice on arrival and painted an empty
  // badge first. There is no localStorage on the server, so SSR renders 0 and
  // the client corrects that during hydration.
  return useSyncExternalStore(subscribeToCart, countCartItems, () => 0);
}

/** Called by the cart owner after every mutation, for same-tab sync. */
export function notifyCartChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CART_CHANGED_EVENT));
  }
}
