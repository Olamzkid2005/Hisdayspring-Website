/**
 * Contact information data
 * PLACEHOLDER - Church to provide actual addresses
 */

import type { ContactInfo, BranchAddress } from "@/types";

export const branchAddresses: BranchAddress[] = [
  {
    branch: "Ipaja",
    address: "Gowon Estate, Ipaja",
    city: "Lagos",
    state: "Lagos State",
    country: "Nigeria",
  },
  {
    branch: "Ikeja",
    address: "Ikeja, Lagos",
    city: "Lagos",
    state: "Lagos State",
    country: "Nigeria",
  },
];

export const contactInfo: ContactInfo = {
  email: "hello@hisdayspring.org",
  phone: "+234 906 619 2155",
  phoneAlt: "+234 807 782 9444",
  whatsapp: "+2348077829444",
  addresses: branchAddresses,
  officeHours: "Monday - Friday: 9:00 AM - 5:00 PM",
};
