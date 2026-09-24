/**
 * Donation and giving data
 */

import type { DonationPurposeOption, BankAccount } from "@/types";

/**
 * Minimum donation, in Naira.
 *
 * Bachs rejects an NGN charge below 100 (`pricing.amount` has a per-currency
 * minimum), so this is the gateway's floor as well as ours. Kept here rather
 * than in the server helpers so the giving form can validate against the same
 * number and give the donor a clear message instead of a generic rejection.
 */
export const MIN_DONATION_AMOUNT = 100;

/**
 * Pastor & ministerial giving.
 *
 * This purpose is deliberately transfer-only. Bachs has no subaccount concept,
 * so a card gift cannot be routed to an individual — it would settle into the
 * church account while the donor believed it reached the pastor. Rather than
 * show an online button that does the wrong thing, the giving page swaps the
 * whole checkout form for this account and a copy-to-clipboard control.
 *
 * The account name is kept exactly as the bank prints it, so a donor checking
 * the destination on their transfer confirmation sees the same string here.
 */
export const pastoralGivingAccount: BankAccount = {
  bankName: "Access (Diamond Bank)",
  accountNumber: "0025053293",
  accountName: "BLESSING PHILIP OLAMIJULO",
};

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
  {
    id: "pastoral-giving",
    label: "Pastor & Ministerial Giving",
    description: "Bless the pastor and support ministerial work",
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

/**
 * The account details as a donor needs to read them out, three lines so a
 * single copy can be pasted into a chat message or a bank app note.
 */
export function formatBankDetails(bank: BankAccount): string {
  return `${bank.bankName}\nAccount Name: ${bank.accountName}\nAccount Number: ${bank.accountNumber}`;
}

export const scriptureReferences = [
  "Malachi 3:10 - Bring the whole tithe into the storehouse...",
  "Proverbs 3:9 - Honor the LORD with your wealth...",
  "2 Corinthians 9:7 - Each of you should give what you have decided in your heart to give...",
  "Luke 6:38 - Give, and it will be given to you...",
];
