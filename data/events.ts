/**
 * Events data.
 *
 * Do not publish an event here until its date, time, and location have been
 * confirmed by the church. Historical entries remain available for archives.
 */

import type { Event } from "@/types";

/**
 * Confirmed upcoming events, transcribed from the printed handbills
 * (September 2026 batch). Ordered by closeness — the list helper re-sorts
 * anyway, and `filterUpcomingEvents` drops each one automatically the day
 * after it ends.
 */
const scheduledEvents: Event[] = [
  {
    id: "young-yielded-concert-2026-09-25",
    title: "Young & Yielded Outdoor Concert",
    date: "2026-09-25",
    time: "3:00 PM",
    location: "Church Car Park, Hisdayspring Evangelical Ministries Intl.",
    description:
      "Intense worship and soul-lifting praise under the open sky — for we are not ashamed of the gospel of Christ (Romans 1:16).",
    imageUrl: "/images/events/young-yielded-concert.webp",
    category: "youth",
    isFeatured: true,
  },
  {
    id: "abuja-prophetic-gathering-2026-10-10",
    title: "Abuja Prophetic Gathering — Increase",
    date: "2026-10-10",
    time: "10:00 AM",
    location: "Aubit Hotel, Area A Nyanya, Abuja",
    description:
      "A special welfare gathering with bags of food stuffs — prophetic word and practical love, Abuja edition. Ministering: Pastor Blessing Olamijulo.",
    imageUrl: "/images/events/abuja-prophetic-gathering.webp",
    category: "special",
    isFeatured: true,
  },
  {
    id: "seven-nights-of-increase-2026-10-11",
    title: "7 Nights of Increase — Special Anointing Nights",
    date: "2026-10-11",
    time: "7:00 PM nightly",
    location: "Plot 200, 21 Road, Beside Faith Academy, Gate Bus Stop, Gowon Estate, Lagos",
    description:
      "Seven nights of special anointing for increase. Host: Pastor Blessing Olamijulo, with Rev. Andrew Bolaji Oyinlola.",
    imageUrl: "/images/events/seven-nights-of-increase.webp",
    category: "general",
    isFeatured: true,
    dates: [
      { date: "2026-10-11", time: "7:00 PM nightly" },
      { date: "2026-10-17", time: "7:00 PM nightly" },
    ],
  },
  {
    id: "greater-works-conference-2026-10-26",
    title: "Greater Works Ministers & Leaders Conference",
    date: "2026-10-26",
    time: "9:00 AM prompt",
    location: "Plot 200, 21 Road, Beside Faith Academy, Gate Bus Stop, Gowon Estate, Lagos",
    description:
      "Making Ministry Impact — Hisdayspring in collaboration with the Pentecostal Fellowship of Nigeria, for 400 pastors and leaders. Free books, free medical checks, free eye glasses. Ministering: Rev. Tunji Dada, Apostle Dr. Iyke Ejiaku, Rev. Uthman, Pst. Yemi David's, Pst. Godman Akinlabi. Convener: Pastor Blessing Olamijulo.",
    imageUrl: "/images/events/greater-works-conference.webp",
    category: "special",
    isFeatured: true,
    dates: [
      { date: "2026-10-26", time: "9:00 AM" },
      { date: "2026-10-27", time: "9:00 AM" },
    ],
  },
  {
    id: "light-convention-uk-2026-11-07",
    title: "Light Convention UK — Exceeding Multiplication",
    date: "2026-11-07",
    time: "11:00 AM",
    location: "429–431 Rainham Road South, Dagenham Essex RM10 8XE",
    description:
      "Light Convention UK with Pastor Blessing Olamijulo — worship, the Word and ministry under the theme “Exceeding Multiplication”.",
    imageUrl: "/images/events/light-convention-uk.webp",
    category: "special",
    isFeatured: true,
  },
];

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
