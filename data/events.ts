/**
 * Events data.
 *
 * Do not publish an event here until its date, time, and location have been
 * confirmed by the church. Historical entries remain available for archives.
 */

import type { Event } from "@/types";

const scheduledEvents: Event[] = [];

export const pastEvents: Event[] = [
  {
    id: "hour-of-revelation-2026-08-11",
    title: "Hour of Revelation",
    date: "2026-08-11",
    time: "Every Tuesday · 9:00 AM",
    location: "Hisdayspring Church, Ipaja",
    description:
      "Start your day with the Word — a Tuesday morning revelation hour with the Lord.",
    imageUrl: "/images/events/hour-of-revelation.jpg",
    category: "general",
  },
  {
    id: "blessing-conference-2026-06-20",
    title: "The Blessing Conference",
    date: "2026-06-20",
    time: "9:00 AM – 5:00 PM",
    location: "Hisdayspring Church, Ipaja",
    description:
      "Our annual conference for young people focused on building strong relationships founded on God's Word.",
    imageUrl: "/images/events/blessing-conference.jpg",
    category: "youth",
    isFeatured: true,
  },
  {
    id: "membership-class-2026-08-08",
    title: "Membership Class (Modules 1–3)",
    date: "2026-08-08",
    time: "9:00 AM",
    location: "Hisdayspring Church, Ipaja",
    description:
      "The foundation class for every member of Hisdayspring Church — three comprehensive modules covering the vision, mission, beliefs, and culture of the church.",
    imageUrl: "/images/events/membership-class.jpg",
    category: "special",
  },
  {
    id: "jewels-breakfast-2026-08-15",
    title: "The Jewels Monthly Breakfast Meeting",
    date: "2026-08-15",
    time: "9:00 AM",
    location: "Hisdayspring Church, Ipaja",
    description:
      "A special two-day gathering for women focused on fulfilling destinies and maximizing potentials.",
    imageUrl: "/images/events/jewels-breakfast.jpg",
    category: "women",
    dates: [
      { date: "2026-08-15", time: "9:00 AM" },
      {
        date: "2026-08-16",
        time: "8:00 AM, 10:00 AM & 12:00 PM (Sunday service times)",
      },
    ],
  },
  {
    id: "healing-crusade-2026-07-15",
    title: "Healing From Heaven Crusade",
    date: "2026-07-15",
    time: "6:00 PM – 9:00 PM",
    location: "Hisdayspring Church, Ikeja",
    description:
      "A powerful crusade focused on divine healing and deliverance for all who attend.",
    category: "special",
    isFeatured: true,
  },
  {
    id: "yofic-revival-2026-05-29",
    title: "YOFIC Youth Revival",
    date: "2026-05-29",
    time: "5:00 PM – 8:00 PM",
    location: "Hisdayspring Church, Ipaja",
    description:
      "A special youth service with powerful worship, prayers, and word for young people.",
    imageUrl: "/images/events/yofic-revival.jpg",
    category: "youth",
  },
  {
    id: "easter-2026",
    title: "Easter Celebration 2026",
    date: "2026-04-20",
    time: "8:00 AM – 12:00 PM",
    location: "Both Branches",
    description: "Celebrating the resurrection of our Lord and Savior Jesus Christ.",
    category: "general",
  },
  {
    id: "women-march-2026",
    title: "International Women's Day Service",
    date: "2026-03-08",
    time: "9:00 AM – 12:00 PM",
    location: "Hisdayspring Church, Ipaja",
    description: "Honoring women and celebrating their God-given purpose.",
    category: "women",
  },
];

function getEventEndDate(event: Event): Date {
  const dates = event.dates;
  const finalDate = dates && dates.length > 0 ? dates[dates.length - 1].date : event.date;
  return new Date(`${finalDate}T23:59:59`);
}

/** Return only events that have not ended as of the supplied date. */
export function filterUpcomingEvents(events: Event[], referenceDate: Date = new Date()): Event[] {
  return events
    .filter((event) => getEventEndDate(event) >= referenceDate)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getUpcomingEvents(referenceDate: Date = new Date()): Event[] {
  return filterUpcomingEvents(scheduledEvents, referenceDate);
}

// Compatibility export for consumers that read the collection directly.
export const upcomingEvents = getUpcomingEvents();

export const getEventsByCategory = (category: Event["category"]) => {
  return getUpcomingEvents().filter((event) => event.category === category);
};

export const getFeaturedEvents = () => {
  return getUpcomingEvents().filter((event) => event.isFeatured);
};
