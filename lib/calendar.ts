/**
 * ICS (RFC 5545) calendar files for events.
 *
 * `buildEventIcs` is pure and unit-tested; `downloadEventIcs` is the browser
 * side (Blob + programmatic link click) — no server round trip needed, the
 * file is generated from data the page already has.
 *
 * Time handling: event times on the handbills are Lagos time, which is UTC+1
 * all year (Nigeria has no DST), so times are anchored at +01:00 and emitted
 * as UTC — the only representation every calendar client agrees on.
 *
 * Time strings in the data are human ("3:00 PM", "9:00 AM – 5:00 PM",
 * "7:00 PM nightly"), so parsing is tolerant: all clock times are extracted;
 * two or more become start/end, one becomes start with a 2-hour default
 * duration; suffixes like "nightly" / "prompt" are ignored.
 */

import type { Event } from "@/types";

const LAGOS_OFFSET = "+01:00";
const DEFAULT_DURATION_HOURS = 2;

interface ClockTime {
  hours: number;
  minutes: number;
}

function parseClockTimes(time: string): ClockTime[] {
  const matches = [...time.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/gi)];
  return matches.map((match) => {
    let hours = parseInt(match[1], 10) % 12;
    if (match[3].toUpperCase() === "PM") hours += 12;
    return {
      hours,
      minutes: match[2] ? parseInt(match[2], 10) : 0,
    };
  });
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** A Lagos wall-clock time as a real Date (correct UTC instant). */
function lagosTime(date: string, clock: ClockTime): Date {
  return new Date(
    `${date}T${pad(clock.hours)}:${pad(clock.minutes)}:00${LAGOS_OFFSET}`
  );
}

/** UTC basic format per RFC 5545: 20260925T140000Z */
function toIcsUtc(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Fold content lines at 75 octets (74 + the continuation space). */
function foldLine(line: string): string {
  if (line.length <= 74) return line;
  const parts: string[] = [line.slice(0, 74)];
  let rest = line.slice(74);
  while (rest.length > 0) {
    parts.push(` ${rest.slice(0, 73)}`);
    rest = rest.slice(73);
  }
  return parts.join("\r\n");
}

export function buildEventIcs(event: Event, generatedAt: Date = new Date()): string {
  const sessions =
    event.dates && event.dates.length > 0
      ? event.dates
      : [{ date: event.date, time: event.time }];

  const firstTimes = parseClockTimes(sessions[0].time);
  const startClock = firstTimes[0] ?? { hours: 9, minutes: 0 };
  const start = lagosTime(sessions[0].date, startClock);

  let end: Date;
  if (sessions.length > 1) {
    // Multi-day: block from the first start to the end of the final day.
    end = lagosTime(sessions[sessions.length - 1].date, {
      hours: 23,
      minutes: 59,
    });
  } else if (firstTimes.length >= 2) {
    end = lagosTime(sessions[0].date, firstTimes[firstTimes.length - 1]);
  } else {
    end = new Date(start.getTime() + DEFAULT_DURATION_HOURS * 60 * 60 * 1000);
  }

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hisdayspring Evangelical Ministry International//Website//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@hisdayspring.org`,
    `DTSTAMP:${toIcsUtc(generatedAt)}`,
    `DTSTART:${toIcsUtc(start)}`,
    `DTEND:${toIcsUtc(end)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description ?? event.title)}`,
    `LOCATION:${escapeText(event.location)}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.map(foldLine).join("\r\n");
}

/** Trigger a browser download of the event's calendar file. */
export function downloadEventIcs(event: Event): void {
  const blob = new Blob([buildEventIcs(event)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `hisdayspring-${event.id}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
