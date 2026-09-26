/**
 * Calendar dates stored as "YYYY-MM-DD" are not instants.
 *
 * `new Date("2026-02-01")` is parsed as UTC midnight, so reading it back with
 * local getters reports 31 Jan — and therefore "Jan 2026" — for anyone behind
 * UTC. These helpers read the written date directly instead, so what the data
 * says is what the page shows, wherever the visitor is.
 */

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const MONTHS_UPPER = MONTHS_SHORT.map((month) => month.toUpperCase());

/** Day of month from a YYYY-MM-DD string, e.g. 11. */
export const calendarDay = (iso: string) => Number(iso.slice(8, 10));

/** Short month from a YYYY-MM-DD string, e.g. "Oct". */
export const calendarMonth = (iso: string) => MONTHS_SHORT[Number(iso.slice(5, 7)) - 1] ?? "";

/** Short uppercase month from a YYYY-MM-DD string, e.g. "OCT". */
export const calendarMonthUpper = (iso: string) => MONTHS_UPPER[Number(iso.slice(5, 7)) - 1] ?? "";

/** Four-digit year from a YYYY-MM-DD string. */
export const calendarYear = (iso: string) => iso.slice(0, 4);

/** "Feb 2026" — for dated quotes and testimonials. */
export const calendarMonthYear = (iso: string) => `${calendarMonth(iso)} ${calendarYear(iso)}`;

/**
 * Weekday of the written date, e.g. "Sun". The weekday of a calendar date is
 * the same the world over, so this is anchored at UTC midnight and read back
 * as UTC rather than through the viewer's timezone.
 */
export const calendarWeekday = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });
