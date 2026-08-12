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
    id: "welfare",
    label: "Welfare",
    description: "Support food, clothing, and medical care outreaches",
  },
  {
    id: "crusade",
    label: "Crusade",
    description: "Support Healing From Heaven Crusade outreaches",
  },
  {
    id: "prophetic-seed",
    label: "Prophetic Seed",
    description: "Plant a seed for prophetic declarations and impartation",
  },
  {
    id: "special-projects",
    label: "Special Projects & Building Fund",
    description: "Support church building and expansion projects",
  },
  {
    id: "missions",
    label: "Missions",
    description: "Support evangelism and mission work",
  },
];

export const bankAccount: BankAccount = {
  bankName: "Access Bank",
  accountNumber: "0054510585",
  accountName: "Hisdayspring Evangelical International",
};

export const scriptureReferences = [
  "Malachi 3:10 - Bring the whole tithe into the storehouse...",
  "Proverbs 3:9 - Honor the LORD with your wealth...",
  "2 Corinthians 9:7 - Each of you should give what you have decided in your heart to give...",
  "Luke 6:38 - Give, and it will be given to you...",
];
