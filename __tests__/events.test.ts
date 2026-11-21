import {
  EVENT_ANNOUNCEMENTS,
  filterUpcomingEvents,
  getActiveAnnouncements,
  getUpcomingEvents,
} from "@/data/events";
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

describe("convention listings", () => {
  const conventionWeek = new Date("2026-11-21T12:00:00");

  it("lists the convention, the youth summit and the crossover crusade", () => {
    const ids = getUpcomingEvents(conventionWeek).map((event) => event.id);
    expect(ids).toContain("light-convention-2026-12-17");
    expect(ids).toContain("youth-singles-summit-2026-12-19");
    expect(ids).toContain("crossover-crusade-2026-12-31");
  });

  it("keeps the convention alive for its last night", () => {
    const ids = getUpcomingEvents(new Date("2026-12-20T20:00:00")).map((event) => event.id);
    expect(ids).toContain("light-convention-2026-12-17");
    expect(ids).not.toContain("youth-singles-summit-2026-12-19");
  });
});

describe("event announcements", () => {
  it("shows the exhibitor notice until the exhibition closes", () => {
    expect(getActiveAnnouncements("2026-11-21")).toHaveLength(1);
    expect(getActiveAnnouncements("2026-12-19")).toHaveLength(1);
    expect(getActiveAnnouncements("2026-12-20")).toHaveLength(0);
  });

  it("gives every contact button a dialable number", () => {
    for (const announcement of EVENT_ANNOUNCEMENTS) {
      expect(announcement.contacts.length).toBeGreaterThan(0);
      for (const contact of announcement.contacts) {
        expect(contact.phone).toMatch(/^\+234\d{10}$/);
      }
    }
  });
});
