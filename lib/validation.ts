/**
 * Validation primitives shared by the client forms and server routes.
 *
 * The email pattern used to be copy-pasted into `useFormValidation`, the book
 * and giving checkouts, and the payment validators; keeping it in one module
 * means no caller can drift on what a valid address is.
 */

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

/** "firstName" / "first_name" -> "First name" for validation copy. */
export function humanizeFieldName(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^\w/, (character) => character.toUpperCase());
}
