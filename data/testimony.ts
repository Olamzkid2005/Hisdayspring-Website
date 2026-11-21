/**
 * Testimony intake — the single source for the form on /testimonials.
 *
 * The QR code printed for the church points at the website, not at WhatsApp:
 * a visitor lands on /testimonials, fills the form, and the page hands the
 * finished
 * message to WhatsApp. That way the church gets a formatted message (name,
 * branch, whether it may be published) instead of a bare URL with a phone
 * number in it.
 *
 * Change the number here, never in the component. This is the testimony line,
 * which is a different phone from the general church WhatsApp in
 * `data/contact.ts`.
 */

export const TESTIMONY_WHATSAPP_NUMBER = "+2347085167576";

/**
 * Where a testimony may also be emailed, for the visitor who has no WhatsApp
 * installed (mostly desktop users, and older phones).
 */
export const TESTIMONY_EMAIL = "hello@hisdayspring.org";

/**
 * A testimony needs enough words to be useful to whoever reads it, and a
 * ceiling so a pasted wall of text does not become an unusable WhatsApp
 * message. WhatsApp itself allows far more; this is an editorial limit.
 */
export const TESTIMONY_MIN_LENGTH = 20;
export const TESTIMONY_MAX_LENGTH = 4000;

/**
 * The branches offered in the form. Labels match `data/workforce.ts` so a
 * testimony and a pastor are described the same way.
 */
export const TESTIMONY_BRANCHES = [
  "Ipaja (Headquarters)",
  "Island Church",
  "Ikorodu",
] as const;

export type TestimonyBranch = (typeof TESTIMONY_BRANCHES)[number];
