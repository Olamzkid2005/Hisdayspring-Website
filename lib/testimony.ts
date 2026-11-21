/**
 * Testimony submission formatting and WhatsApp delivery planning.
 *
 * Pure functions, so the character-limit behaviour can be tested without a
 * browser. The component in `components/sections/TestimonySection.tsx` only
 * renders and calls these.
 *
 * ## Why there is a length strategy at all
 *
 * WhatsApp messages can hold ~65,000 characters, but the only way to *prefill*
 * one from a website without the Cloud API is a `wa.me?text=` URL, and mobile
 * browsers truncate long URLs (reports cluster from ~1,500 to ~2,000 encoded
 * characters, and the failure is silent: the visitor sees half a testimony in
 * the box). So the page picks a strategy per submission:
 *
 * - `direct`    — the encoded URL fits, so the whole testimony is prefilled.
 * - `clipboard` — the testimony is put on the clipboard and WhatsApp opens
 *                 with a short header; the sender pastes it in. No length cap,
 *                 at the cost of one extra tap.
 */

import {
  TESTIMONY_EMAIL,
  TESTIMONY_WHATSAPP_NUMBER,
  type TestimonyBranch,
} from "@/data/testimony";

/**
 * The longest `wa.me` URL worth opening.
 *
 * Chosen deliberately below the ~2,000 limit that older Android WebViews and
 * iOS Safari enforce on `window.open` URLs, because the failure mode is a
 * silently cut-off testimony rather than an error we could react to.
 */
export const WHATSAPP_URL_SAFE_LIMIT = 1800;

/** Shown on the page after a clipboard-mode submission. */
export const TESTIMONY_CLIPBOARD_INSTRUCTIONS =
  "Your testimony is too long for a WhatsApp link, so we copied the whole text. In WhatsApp, long-press the message box, tap Paste, then Send.";

export interface TestimonySubmission {
  name: string;
  phone?: string;
  branch?: TestimonyBranch | "";
  /** Whether the church may publish this testimony publicly. */
  publish: boolean;
  testimony: string;
}

export interface TestimonyDeliveryDirect {
  mode: "direct";
  /** WhatsApp URL carrying the whole testimony. */
  url: string;
  /** The complete formatted message, as it will appear in WhatsApp. */
  message: string;
}

export interface TestimonyDeliveryClipboard {
  mode: "clipboard";
  /** WhatsApp URL carrying only the header and the paste instruction. */
  url: string;
  /** The complete formatted message — this is what goes to the clipboard. */
  message: string;
  hint: string;
}

export type TestimonyDelivery = TestimonyDeliveryDirect | TestimonyDeliveryClipboard;

/** `+234 708 516 7576` -> `2347085167576`, the form wa.me requires. */
export function whatsappDigits(number: string): string {
  return number.replace(/[^\d]/g, "");
}

export function buildWhatsAppUrl(number: string, text: string): string {
  return `https://wa.me/${whatsappDigits(number)}?text=${encodeURIComponent(text)}`;
}

/**
 * The message the church receives. Ordered so the header, the sender and the
 * publish permission are readable in WhatsApp's chat list preview, before the
 * testimony itself.
 */
export function buildTestimonyMessage(submission: TestimonySubmission): string {
  const name = submission.name.trim();
  const phone = submission.phone?.trim() ?? "";
  const branch = submission.branch?.trim() ?? "";
  const testimony = submission.testimony.trim();

  const lines = ["*TESTIMONY*: Hisdayspring", "", `Name: ${name}`];
  if (phone) lines.push(`Phone: ${phone}`);
  if (branch) lines.push(`Branch: ${branch}`);
  lines.push(`Share publicly: ${submission.publish ? "Yes" : "No"}`);
  lines.push("", testimony);

  return lines.join("\n");
}

/** The short header used when the testimony itself travels via the clipboard. */
export function buildClipboardHintMessage(submission: TestimonySubmission): string {
  const name = submission.name.trim();
  const branch = submission.branch?.trim() ?? "";

  const details = [`Name: ${name}`];
  if (branch) details.push(`Branch: ${branch}`);
  details.push(`Share publicly: ${submission.publish ? "Yes" : "No"}`);

  return [
    "*TESTIMONY*: Hisdayspring",
    details.join("\n"),
    "",
    "(Long testimony. Full text follows below.)",
  ].join("\n");
}

/**
 * Decides which delivery mode a submission needs and builds both URLs.
 *
 * @param number Override for tests; production always uses the data constant.
 */
export function planTestimonyDelivery(
  submission: TestimonySubmission,
  number: string = TESTIMONY_WHATSAPP_NUMBER
): TestimonyDelivery {
  const message = buildTestimonyMessage(submission);
  const directUrl = buildWhatsAppUrl(number, message);

  if (directUrl.length <= WHATSAPP_URL_SAFE_LIMIT) {
    return { mode: "direct", url: directUrl, message };
  }

  return {
    mode: "clipboard",
    url: buildWhatsAppUrl(number, buildClipboardHintMessage(submission)),
    message,
    hint: TESTIMONY_CLIPBOARD_INSTRUCTIONS,
  };
}

/**
 * Email fallback for a visitor with no WhatsApp. Same body as the WhatsApp
 * message, minus the WhatsApp markdown, plus a subject that says what it is.
 */
export function buildTestimonyEmailUrl(
  submission: TestimonySubmission,
  email: string = TESTIMONY_EMAIL
): string {
  const name = submission.name.trim();
  const subject = `Testimony${name ? ` from ${name}` : ""}`;
  const body = buildTestimonyMessage(submission).replace(/\*/g, "");

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
