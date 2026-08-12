/**
 * Service times data
 * Real content provided by the church
 */

import type { ServiceTime } from "@/types";

export const serviceTimes: ServiceTime[] = [
  // ── Sunday Services ──
  {
    id: "sunday-services",
    name: "Sunday Services",
    day: "Sunday",
    time: "8am, 10am, 12pm",
    branch: "Both",
    description:
      "1st Sunday: Thanksgiving | 3rd Sunday: Friends & Family | Last Sunday: Super Sunday/Communion",
  },

  // ── Tuesday ──
  {
    id: "tuesday",
    name: "HOR",
    day: "Tuesday",
    time: "8:00 AM",
    branch: "Both",
    description: "Hour of Revelation — morning prayer and revelation hour.",
  },

  // ── Wednesday ──
  {
    id: "wednesday",
    name: "Word Study",
    day: "Wednesday",
    time: "5:30 PM",
    branch: "Both",
    description: "Midweek Bible study and word study session for spiritual growth.",
  },

  // ── 2nd Saturday ──
  {
    id: "mens-breakfast",
    name: "Men's Breakfast Club",
    day: "Saturday",
    time: "8:00 AM",
    branch: "Both",
    description: "Every 2nd Saturday of the month — a breakfast meeting for men.",
  },

  // ── 4th Saturday ──
  {
    id: "jewels",
    name: "Jewels",
    day: "Every 4th Saturday of the Month",
    time: "9:00 AM",
    branch: "Both",
    description:
      "Breakfast meeting for women (ages 18–45, single & married).",
  },
];

export const getServicesByBranch = (branch: "Ipaja" | "Ikeja" | "Both") => {
  return serviceTimes.filter(
    (service) => service.branch === branch || service.branch === "Both"
  );
};
