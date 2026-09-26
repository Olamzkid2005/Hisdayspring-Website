/**
 * Dates and times on this site belong to the church, not to the visitor.
 *
 * Services and events happen on Lagos wall-clock time (UTC+1 all year — Nigeria
 * has no DST), so anything derived from "now" has to be resolved in that zone.
 * Otherwise a visitor in the US overnight sees "next Sunday" dated a day late,
 * and Lagos-anchored event end dates are evaluated against the wrong instant.
 *
 * Display strings are produced with an explicit `timeZone` so the machine
 * running the build (or the browser showing it) cannot shift them.
 */

export const LAGOS_TIME_ZONE = "Africa/Lagos";

/** Nigeria is UTC+1 all year; there is no daylight saving to account for. */
export const LAGOS_OFFSET_MS = 60 * 60 * 1000;

/**
 * The Lagos wall clock, expressed as a Date whose UTC fields hold the Lagos
 * time. Only the UTC getters on the result are meaningful.
 */
function asLagosWallClock(instant: Date): Date {
  return new Date(instant.getTime() + LAGOS_OFFSET_MS);
}

/**
 * A payment instant as church time, e.g. "Sat, 26 Sep 2026, 04:02 (Lagos)".
 *
 * Receipts are handed to bookstand staff and shared over WhatsApp, so they are
 * stamped in the timezone the church keeps its records in — a US buyer's own
 * clock would have staff reconciling the wrong hour.
 */
export function formatLagosDateTime(iso: string): string {
  const formatted = new Date(iso).toLocaleString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: LAGOS_TIME_ZONE,
  });

  return `${formatted} (Lagos)`;
}

/** Today's date where the church is, as YYYY-MM-DD. */
export function lagosToday(instant: Date = new Date()): string {
  return asLagosWallClock(instant).toISOString().slice(0, 10);
}

/**
 * The next Sunday service date, e.g. "Sunday, October 11".
 *
 * Computed in Lagos: at 03:00 UTC on a Sunday it is already Sunday morning in
 * Lagos, so the answer is *that* Sunday — even though it is still Saturday
 * evening for a visitor in the US.
 */
export function nextSundayServiceLabel(instant: Date = new Date()): string {
  const lagos = asLagosWallClock(instant);
  const daysUntilSunday = (7 - lagos.getUTCDay()) % 7;
  const next = new Date(lagos.getTime() + daysUntilSunday * 86_400_000);

  return next.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    // `next` holds Lagos fields in its UTC slots, so read them as UTC.
    timeZone: "UTC",
  });
}
