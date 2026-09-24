/**
 * Tests for the ICS calendar generator.
 *
 * Calendar clients are unforgiving: a malformed DTSTART silently drops the
 * event, unescaped commas break parsing, and a Lagos wall-clock time treated
 * as UTC shifts every service by an hour. These pin all three.
 */

import { buildEventIcs } from "@/lib/calendar";
import type { Event } from "@/types";

const GENERATED_AT = new Date("2026-09-24T12:00:00Z");

function icsOf(event: Event): string {
  return buildEventIcs(event, GENERATED_AT);
}

function field(ics: string, name: string): string {
  // Unfold first, then pick the line (folded continuations start with a space).
  const unfolded = ics.replace(/\r\n /g, "");
  const line = unfolded
    .split("\r\n")
    .find((candidate) => candidate.startsWith(`${name}:`));
  return line ? line.slice(name.length + 1) : "";
}

const singleEvent: Event = {
  id: "young-yielded-concert-2026-09-25",
  title: "Young & Yielded Outdoor Concert",
  date: "2026-09-25",
  time: "3:00 PM",
  location: "Church Car Park, Hisdayspring Evangelical Ministries Intl.",
  description: "Intense worship, Rom. 1:16",
  category: "youth",
};

describe("buildEventIcs", () => {
  it("anchors Lagos wall-clock time correctly (UTC+1, no DST)", () => {
    const ics = icsOf(singleEvent);
    // 3:00 PM in Lagos is 14:00 UTC.
    expect(field(ics, "DTSTART")).toBe("20260925T140000Z");
    // Default 2-hour duration when the handbill gives no end time.
    expect(field(ics, "DTEND")).toBe("20260925T160000Z");
  });

  it("uses a start/end pair when the time gives a range", () => {
    const ics = icsOf({
      ...singleEvent,
      id: "blessing-conference",
      time: "9:00 AM – 5:00 PM",
    });
    expect(field(ics, "DTSTART")).toBe("20260925T080000Z");
    expect(field(ics, "DTEND")).toBe("20260925T160000Z");
  });

  it("blocks multi-day events until the end of the final day", () => {
    const ics = icsOf({
      ...singleEvent,
      id: "seven-nights",
      time: "7:00 PM nightly",
      dates: [
        { date: "2026-10-11", time: "7:00 PM nightly" },
        { date: "2026-10-17", time: "7:00 PM nightly" },
      ],
    });
    expect(field(ics, "DTSTART")).toBe("20261011T180000Z");
    expect(field(ics, "DTEND")).toBe("20261017T225900Z");
  });

  it("escapes commas, semicolons and newlines in text fields", () => {
    const ics = icsOf({
      ...singleEvent,
      location: "Plot 200, 21 Road; Gate Bus Stop",
      description: "Line one\nLine two",
    });
    expect(field(ics, "LOCATION")).toBe(
      "Plot 200\\, 21 Road\\; Gate Bus Stop"
    );
    expect(field(ics, "DESCRIPTION")).toBe("Line one\\nLine two");
  });

  it("folds long lines at the RFC 5545 octet limit", () => {
    const ics = icsOf({
      ...singleEvent,
      description: "x".repeat(300),
    });
    for (const line of ics.split("\r\n")) {
      expect(line.length).toBeLessThanOrEqual(75);
    }
    // And the folded content survives unfolding.
    expect(field(ics, "DESCRIPTION")).toBe("x".repeat(300));
  });

  it("carries the required identity and structure fields", () => {
    const ics = icsOf(singleEvent);
    expect(field(ics, "UID")).toBe("young-yielded-concert-2026-09-25@hisdayspring.org");
    expect(field(ics, "DTSTAMP")).toBe("20260924T120000Z");
    expect(field(ics, "SUMMARY")).toBe("Young & Yielded Outdoor Concert");
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("END:VEVENT");
    expect(ics).toContain("CALSCALE:GREGORIAN");
  });

  it("falls back to a sane 9am start when the time is unparseable", () => {
    const ics = icsOf({ ...singleEvent, time: "time to be announced" });
    expect(field(ics, "DTSTART")).toBe("20260925T080000Z");
  });
});
