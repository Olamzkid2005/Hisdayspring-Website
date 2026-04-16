/**
 * Events data
 * PLACEHOLDER - Church to provide actual event details
 */

import type { Event } from "@/types";

export const upcomingEvents: Event[] = [
  {
    id: "discovery-conference",
    title: "Annual Discovery for Youth & Singles Conference",
    date: "2026-06-20",
    time: "9:00 AM – 5:00 PM",
    location: "Hisdayspring Church, Ipaja",
    description:
      "Our annual conference for young people focused on building strong relationships founded on God's Word.",
    category: "youth",
    isFeatured: true,
  },
  {
    id: "jewels-breakfast",
    title: "The Jewels Monthly Breakfast Meeting",
    date: "2026-05-15",
    time: "8:00 AM – 11:00 AM",
    location: "Hisdayspring Church, Ipaja",
    description:
      "Monthly gathering for women focused on fulfilling destinies and maximizing potentials.",
    category: "women",
  },
  {
    id: "boms-intake",
    title: "BOMS New Intake Registration",
    date: "2026-05-01",
    time: "All Day",
    location: "Online / Hisdayspring Church",
    description:
      "Registration opens for the new session of the Blessing Ola Mentoring School. Train to become a leader in God's kingdom.",
    category: "special",
  },
  {
    id: "healing-crusade",
    title: "Healing From Heaven Crusade",
    date: "2026-07-15",
    time: "6:00 PM – 9:00 PM",
    location: "Hisdayspring Church, Ikeja",
    description:
      "A powerful crusade focused on divine healing and deliverence for all who attend.",
    category: "special",
    isFeatured: true,
  },
  {
    id: "midyear-thanksgiving",
    title: "Midyear Thanksgiving Service",
    date: "2026-06-30",
    time: "9:00 AM – 1:00 PM",
    location: "Both Branches",
    description:
      "A time to celebrate God's faithfulness and give thanks for all He has done.",
    category: "general",
  },
  {
    id: "yofic-revival",
    title: "YOFIC Youth Revival",
    date: "2026-05-29",
    time: "5:00 PM – 8:00 PM",
    location: "Hisdayspring Church, Ipaja",
    description:
      "A special youth service with powerful worship, prayers, and word for young people.",
    category: "youth",
  },
];

export const pastEvents: Event[] = [
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

export const getEventsByCategory = (category: Event["category"]) => {
  return upcomingEvents.filter((event) => event.category === category);
};

export const getFeaturedEvents = () => {
  return upcomingEvents.filter((event) => event.isFeatured);
};
