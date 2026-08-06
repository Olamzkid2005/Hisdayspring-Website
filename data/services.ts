/**
 * Service times data
 * Real content provided by the church
 */

import type { ServiceTime } from "@/types";

export const serviceTimes: ServiceTime[] = [
  // ── Sunday Services ──
  // 1st Sunday: Thanksgiving | 3rd Sunday: Friends & Family | Last Sunday: SuperSunday/Communion
  {
    id: "sunday-8am",
    name: "Sunday Service",
    day: "Sunday",
    time: "8:00 AM",
    branch: "Both",
    description:
      "1st Sunday: Thanksgiving Service | 3rd Sunday: Friends & Family Sunday | Last Sunday: SuperSunday / Communion Service",
  },
  {
    id: "sunday-10am",
    name: "Sunday Service",
    day: "Sunday",
    time: "10:00 AM",
    branch: "Both",
    description:
      "1st Sunday: Thanksgiving Service | 3rd Sunday: Friends & Family Sunday | Last Sunday: SuperSunday / Communion Service",
  },
  {
    id: "sunday-12noon",
    name: "Sunday Service",
    day: "Sunday",
    time: "12:00 PM",
    branch: "Both",
    description:
      "1st Sunday: Thanksgiving Service | 3rd Sunday: Friends & Family Sunday | Last Sunday: SuperSunday / Communion Service",
  },

  // ── Tuesday ──
  {
    id: "tuesday",
    name: "Hour of Revelation",
    day: "Tuesday",
    time: "8:00 AM",
    branch: "Both",
    description: "Morning prayer and revelation hour to start your day with the Word.",
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
    name: "The Jewels & Winning Women Breakfast Meeting",
    day: "Every 4th Saturday of the Month",
    time: "8:00 AM",
    branch: "Both",
    description:
      "Every 4th Saturday of the month — a breakfast meeting for women (ages 18–45, single & married).",
  },
];

export const getServicesByBranch = (branch: "Ipaja" | "Ikeja" | "Both") => {
  return serviceTimes.filter(
    (service) => service.branch === branch || service.branch === "Both"
  );
};
