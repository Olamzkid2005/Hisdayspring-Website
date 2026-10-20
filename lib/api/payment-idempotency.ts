const STORAGE_PREFIX = "hds-payment-idempotency:";
let fallbackSequence = 0;

function randomKey(): string {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `fallback-${Date.now().toString(36)}-${(++fallbackSequence).toString(36)}`;
}

async function fingerprint(payload: unknown): Promise<string> {
  const serialized = JSON.stringify(payload);
  if (globalThis.crypto?.subtle && typeof TextEncoder !== "undefined") {
    const bytes = new TextEncoder().encode(serialized);
    const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");
  }

  // The digest only groups retry attempts; it is not used for authentication.
  // A deterministic fallback keeps checkout usable in older browsers/test DOMs.
  let hash = 2166136261;
  for (let index = 0; index < serialized.length; index++) {
    hash = Math.imul(hash ^ serialized.charCodeAt(index), 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

/**
 * Reuse a random token only for retries of the same payload in this tab.
 * sessionStorage stores a digest and opaque token, never buyer PII or amounts.
 */
export async function getCheckoutIdempotencyKey(
  scope: string,
  payload: unknown
): Promise<string> {
  const digest = await fingerprint(payload);
  const storageKey = `${STORAGE_PREFIX}${scope}`;
  try {
    const existing = window.sessionStorage.getItem(storageKey);
    if (existing) {
      const parsed = JSON.parse(existing) as { digest?: unknown; key?: unknown };
      if (
        parsed.digest === digest &&
        typeof parsed.key === "string" &&
        /^[A-Za-z0-9-]{8,64}$/.test(parsed.key)
      ) {
        return parsed.key;
      }
    }
    const key = randomKey();
    window.sessionStorage.setItem(storageKey, JSON.stringify({ digest, key }));
    return key;
  } catch {
    return randomKey();
  }
}

export function clearCheckoutIdempotencyKey(scope: string): void {
  try {
    window.sessionStorage.removeItem(`${STORAGE_PREFIX}${scope}`);
  } catch {
    // Storage may be unavailable in privacy-restricted browser contexts.
  }
}
