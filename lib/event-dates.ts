import type { Event } from "@/types";
import {
  calendarDay,
  calendarMonthUpper,
  calendarWeekday,
} from "@/lib/calendar-date";

/**
 * Display parts for an event's date, used by the events cards and the
 * featured-event hero.
 *
 * Everything here is read from the written date rather than through a local
 * `Date`, so a visitor in the US sees the same day as the printed handbill —
 * this used to render "10–16 OCT" and "Sat & Fri" for the 11–17 Oct event.
 */

export interface EventDateSession {
  date: string;
  time: string;
  /** Short weekday, e.g. "Sun". */
  weekday: string;
}

export interface EventDateParts {
  /** Day, or an inclusive range like "11–17". */
  day: string;
  /** Short uppercase month, e.g. "OCT", or "OCT/NOV" for a range that crosses months. */
  month: string;
  /** Per-session detail, or null for a single-day event. */
  sessions: EventDateSession[] | null;
}


export function formatEventDate(event: Event): EventDateParts {
  const dates = event.dates && event.dates.length > 0 ? event.dates : null;

  if (dates && dates.length > 1) {
    const first = dates[0].date;
    const last = dates[dates.length - 1].date;
    const sameMonth = first.slice(0, 7) === last.slice(0, 7);
    return {
      day: `${calendarDay(first)}–${calendarDay(last)}`,
      month: sameMonth
        ? calendarMonthUpper(first)
        : `${calendarMonthUpper(first)}/${calendarMonthUpper(last)}`,
      sessions: dates.map((session) => ({
        ...session,
        weekday: calendarWeekday(session.date),
      })),
    };
  }

  const iso = dates ? dates[0].date : event.date;
  return { day: String(calendarDay(iso)), month: calendarMonthUpper(iso), sessions: null };
}
