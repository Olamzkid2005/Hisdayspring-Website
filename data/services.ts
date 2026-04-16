/**
 * Service times data
 * PLACEHOLDER - Church to confirm actual times
 */

import type { ServiceTime } from "@/types";

export const serviceTimes: ServiceTime[] = [
  {
    id: "sunday-first",
    name: "Sunday First Service",
    day: "Sunday",
    time: "7:00 AM – 9:00 AM",
    branch: "Both",
    description: "Our first Sunday worship service where we gather to praise and worship God.",
  },
  {
    id: "sunday-second",
    name: "Sunday Second Service",
    day: "Sunday",
    time: "9:30 AM – 11:30 AM",
    branch: "Both",
    description: "Our second Sunday worship service with powerful worship and impactful preaching.",
  },
  {
    id: "midweek",
    name: "Midweek Service",
    day: "Wednesday",
    time: "6:00 PM – 8:00 PM",
    branch: "Both",
    description: "Midweek Bible study and prayer meeting for spiritual growth and empowerment.",
  },
  {
    id: "yofic",
    name: "YOFIC Youth Service",
    day: "Friday",
    time: "5:00 PM – 7:00 PM",
    branch: "Ipaja",
    description: "Youth of Faith in Christ - Our vibrant youth service for young people.",
  },
  {
    id: "women",
    name: "The Jewels Women's Program",
    day: "Monthly",
    time: "Varies",
    branch: "Both",
    description: "Monthly breakfast meeting for women focused on fulfilling destinies and maximizing potentials.",
  },
];

export const getServicesByBranch = (branch: "Ipaja" | "Ikeja" | "Both") => {
  return serviceTimes.filter(
    (service) => service.branch === branch || service.branch === "Both"
  );
};
