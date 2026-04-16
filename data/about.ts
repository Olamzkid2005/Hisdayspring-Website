/**
 * About section data
 * Real content from hisdayspring.org where available
 */

import type { AboutContent, Statistic } from "@/types";

export const statistics: Statistic[] = [
  { value: 15, label: "Years of Ministry", suffix: "+" },
  { value: 2, label: "Church Branches", suffix: "" },
  { value: 500, label: "Church Members", suffix: "+" },
  { value: 10, label: "Ministries", suffix: "" },
];

export const aboutContent: AboutContent = {
  mission:
    "At HISDAYSPRING, we are committed to raising holy, healthy and wealthy people with a sense of dominion and world evangelism by the power of the Holy Spirit.",
  vision:
    "To be a Spirit-filled, word-grounded church that transforms lives, families and communities across Nigeria and beyond for the glory of God.",
  statistics,
  branchInfo:
    "With branches spread across all parts of Nigeria and beyond, Hisdayspring Evangelical Ministries International continues to grow and impact lives for God's kingdom.",
};
