/**
 * Contact information data
 */

import type { ContactInfo, BranchAddress } from "@/types";

export const branchAddresses: BranchAddress[] = [
  {
    branch: "Headquarters — Ipaja",
    address: "Plot 200, 21 Road, Beside Faith Academy, Gate Bus Stop, Gowon Estate",
    city: "Ipaja, Lagos",
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
