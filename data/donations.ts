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
    id: "seeds-and-donations",
    label: "Seeds and Donations",
    description: "Plant a seed and support church projects",
  },
];

export const bankAccounts: BankAccount[] = [
  {
    bankName: "GTBank",
    accountNumber: "0499179248",
    accountName: "Hisdayspring Evangelical Ministry International",
  },
  {
    bankName: "Access (Diamond Bank)",
    accountNumber: "0054510585",
    accountName: "Hisdayspring Evangelical Ministry International",
  },
];

// Keep backward compatibility
export const bankAccount = bankAccounts[0];

export const scriptureReferences = [
  "Malachi 3:10 - Bring the whole tithe into the storehouse...",
  "Proverbs 3:9 - Honor the LORD with your wealth...",
  "2 Corinthians 9:7 - Each of you should give what you have decided in your heart to give...",
  "Luke 6:38 - Give, and it will be given to you...",
];
