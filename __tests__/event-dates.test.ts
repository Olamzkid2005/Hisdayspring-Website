import { formatEventDate } from "@/lib/event-dates";
import type { Event } from "@/types";

const baseEvent: Event = {
  id: "e",
  title: "Event",
  date: "2026-09-25",
  time: "4:00 PM",
  location: "Church",
  category: "general",
};

describe("formatEventDate", () => {
  it("formats a single-day event", () => {
    expect(formatEventDate(baseEvent)).toEqual({
      day: "25",
      month: "SEP",
      sessions: null,
    });
  });

  // Regression: these were read through `new Date("2026-10-11")`, which is UTC
  // midnight, so any timezone behind UTC showed the previous day — the card
  // said "10-16 OCT" for a handbill printed "Sun 11th–Sat 17th Oct 2026".
  it("keeps the written day and month regardless of timezone", () => {
    const event: Event = {
      ...baseEvent,
      date: "2026-10-11",
      dates: [
        { date: "2026-10-11", time: "7:00 PM nightly" },
        { date: "2026-10-17", time: "7:00 PM nightly" },
      ],
    };

    const parts = formatEventDate(event);

    expect(parts.day).toBe("11–17");
    expect(parts.month).toBe("OCT");
    // 11 Oct 2026 is a Sunday and 17 Oct a Saturday, matching the handbill.
    expect(parts.sessions?.map((s) => s.weekday)).toEqual(["Sun", "Sat"]);
    expect(parts.sessions?.map((s) => s.date)).toEqual(["2026-10-11", "2026-10-17"]);
  });

  it("names both months when a range crosses a month boundary", () => {
    const event: Event = {
      ...baseEvent,
      date: "2026-10-30",
      dates: [
        { date: "2026-10-30", time: "9:00 AM" },
        { date: "2026-11-02", time: "9:00 AM" },
      ],
    };

    expect(formatEventDate(event)).toMatchObject({ day: "30–2", month: "OCT/NOV" });
  });

  it("treats a single-entry dates array as a one-day event", () => {
    const event: Event = {
      ...baseEvent,
      date: "2026-11-07",
      dates: [{ date: "2026-11-07", time: "11:00 AM" }],
    };

    expect(formatEventDate(event)).toEqual({ day: "7", month: "NOV", sessions: null });
  });
});
