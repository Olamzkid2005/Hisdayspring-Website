/**
 * Donation and giving data
 */

import type { DonationPurposeOption, BankAccount } from "@/types";

/**
 * Subaccount for pastor/ministerial giving.
 *
 * 1. Create a subaccount for the pastor in your Paystack dashboard
 *    (Settings → Subaccounts) and/or Flutterwave dashboard, then paste the
 *    codes below. With Paystack set "percentage_charge" to 0 so 100% of the
 *    gift settles into the pastor's account.
 * 2. While PASTORAL_PAYSTACK_SUBACCOUNT / PASTORAL_FLUTTERWAVE_SUBACCOUNT_ID
 *    are empty, card gifts for pastoral giving settle into the church account.
 *
 * For bank transfers, fill in the pastor's own account details — those are
 * shown directly to donors. Leave it empty to show the church account.
 */
export const pastoralGivingAccount: BankAccount | null = null;
// e.g. { bankName: "GTBank", accountNumber: "0123456789", accountName: "Pastor Blessing Olamijulo" };

export const PASTORAL_PAYSTACK_SUBACCOUNT = ""; // e.g. "ACCT_xxxxxxxxxxxx"
export const PASTORAL_FLUTTERWAVE_SUBACCOUNT_ID = ""; // e.g. "RS_1234567890"

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

export const scriptureReferences = [
  "Malachi 3:10 - Bring the whole tithe into the storehouse...",
  "Proverbs 3:9 - Honor the LORD with your wealth...",
  "2 Corinthians 9:7 - Each of you should give what you have decided in your heart to give...",
  "Luke 6:38 - Give, and it will be given to you...",
];
