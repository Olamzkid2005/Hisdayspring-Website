"use client";

/**
 * Live count of items in the persisted book cart, for the nav badge.
 *
 * The cart lives in localStorage (written by `BooksClient`), which React
 * state alone cannot observe. This hook re-reads it when:
 * - the component mounts (arriving on any page),
 * - the tab becomes visible again (returning from another tab),
 * - another tab changes it (`storage` event), or
 * - `BooksClient` announces a change on this tab (`hds-cart-changed`).
 *
 * Every read is validated the same way the cart page restores: only known
 * book IDs in sane quantity bounds are counted.
 */

import { useCallback, useEffect, useState } from "react";
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

export function useBookCartCount(): number {
  const [count, setCount] = useState(0);

  const refresh = useCallback(() => setCount(countCartItems()), []);

  useEffect(() => {
    refresh();

    window.addEventListener("storage", refresh);
    window.addEventListener(CART_CHANGED_EVENT, refresh);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(CART_CHANGED_EVENT, refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [refresh]);

  return count;
}

/** Called by the cart owner after every mutation, for same-tab sync. */
export function notifyCartChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CART_CHANGED_EVENT));
  }
}
