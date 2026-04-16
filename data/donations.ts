/**
 * Donation and giving data
 * PLACEHOLDER - Church to provide actual bank details
 */

import type { DonationPurposeOption, BankAccount } from "@/types";

export const donationPurposes: DonationPurposeOption[] = [
  {
    id: "tithes",
    label: "Tithes",
    description: "Honor God with your first fruits",
  },
  {
    id: "offerings",
    label: "Offerings",
    description: "Seed offerings for God's work",
  },
  {
    id: "special-projects",
    label: "Special Projects",
    description: "Support church building and projects",
  },
  {
    id: "building-fund",
    label: "Building Fund",
    description: "Contribute to our church expansion",
  },
  {
    id: "missions",
    label: "Missions",
    description: "Support evangelism and mission work",
  },
  {
    id: "youth-ministry",
    label: "Youth Ministry",
    description: "Support YOFIC and youth programs",
  },
];

export const bankAccount: BankAccount = {
  bankName: "First Bank of Nigeria",
  accountNumber: "1234567890",
  accountName: "Hisdayspring Evangelical Ministries Intl",
};

export const scriptureReferences = [
  "Malachi 3:10 - Bring the whole tithe into the storehouse...",
  "Proverbs 3:9 - Honor the LORD with your wealth...",
  "2 Corinthians 9:7 - Each of you should give what you have decided in your heart to give...",
  "Luke 6:38 - Give, and it will be given to you...",
];
