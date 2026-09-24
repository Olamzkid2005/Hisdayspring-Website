"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Copy text to the clipboard and remember which trigger did it, so a page with
 * several copy buttons can show independent "Copied" feedback instead of
 * ticking every button at once.
 *
 * `copy` resolves to `false` when the browser refuses — an insecure origin, a
 * denied permission, or no Clipboard API at all. Callers should say so: a copy
 * button that silently does nothing is worse than one that admits it failed.
 */
export function useCopyToClipboard(resetAfterMs = 2000) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = useCallback(
    async (text: string, key: string): Promise<boolean> => {
      try {
        // Not every environment has the Clipboard API (it is unavailable on
        // plain http, for instance), so this can throw as well as reject.
        await navigator.clipboard.writeText(text);
      } catch {
        return false;
      }

      setCopiedKey(key);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setCopiedKey((current) => (current === key ? null : current));
      }, resetAfterMs);

      return true;
    },
    [resetAfterMs]
  );

  return { copiedKey, copy };
}
