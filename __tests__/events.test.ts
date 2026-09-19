import { filterUpcomingEvents } from "@/data/events";
import type { Event } from "@/types";

describe("event date filtering", () => {
  const events: Event[] = [
    {
      id: "past",
      title: "Past",
      date: "2026-09-01",
      time: "9:00 AM",
      location: "Church",
      category: "general",
    },
    {
      id: "future",
      title: "Future",
      date: "2026-09-20",
      time: "9:00 AM",
      location: "Church",
      category: "general",
    },
    {
      id: "multi-day",
      title: "Multi-day",
      date: "2026-09-10",
      time: "9:00 AM",
      location: "Church",
      category: "special",
      dates: [
        { date: "2026-09-10", time: "9:00 AM" },
        { date: "2026-09-12", time: "9:00 AM" },
      ],
    },
  ];

  it("excludes ended events and keeps future events sorted", () => {
    expect(filterUpcomingEvents(events, new Date("2026-09-11T12:00:00"))).toEqual([
      events[2],
      events[1],
    ]);
  });

  it("keeps a multi-day event until its final day ends", () => {
    expect(filterUpcomingEvents(events, new Date("2026-09-12T12:00:00"))).toContain(events[2]);
    expect(filterUpcomingEvents(events, new Date("2026-09-13T00:00:00"))).not.toContain(events[2]);
  });
});
