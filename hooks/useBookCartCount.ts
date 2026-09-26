"use client";

/**
 * React bindings for the book cart, which is an external store living in
 * localStorage (`lib/book-cart.ts`). Kept in this file so `useBookCartCount`
 * and the storage constants keep their existing import path.
 */

import { useSyncExternalStore } from "react";
import {
  CART_CHANGED_EVENT,
  CART_STORAGE_KEY,
  cartItemCount,
  getCartSnapshot,
  getServerCartSnapshot,
  notifyCartChanged,
  subscribeToCart,
  type Cart,
} from "@/lib/book-cart";

export { CART_CHANGED_EVENT, CART_STORAGE_KEY, notifyCartChanged };

/**
 * The whole cart, re-derived on every render and refreshed when another tab
 * changes it (or this one announces a change). SSR renders the empty cart.
 */
export function useBookCart(): Cart {
  return useSyncExternalStore(subscribeToCart, getCartSnapshot, getServerCartSnapshot);
}

/** Live count of items in the persisted cart, for the nav badge. */
export function useBookCartCount(): number {
  return cartItemCount(useBookCart());
}
