/**
 * Testimonials data
 * PLACEHOLDER - Church to provide real testimonials
 */

import type { Testimonial } from "@/types";

export const testimonials: Testimonial[] = [
  {
    id: "testimony-1",
    name: "Emeka N.",
    testimony:
      "God healed me of a chronic illness that doctors said had no cure. After 5 years of medication without improvement, I prayed according to Pastor Blessing's teaching on divine healing, and God restored my health completely. To God be the glory!",
    date: "2025-12-15",
  },
  {
    id: "testimony-2",
    name: "Comfort A.",
    testimony:
      "My marriage was falling apart, but through the Discovery for Youth & Singles program and counseling from the pastors, my husband and I found our way back to each other. God restored our home and now we serve together in church.",
    date: "2025-11-20",
  },
  {
    id: "testimony-3",
    name: "David O.",
    testimony:
      "I was struggling in business for 7 years. After applying the principles in the Entrepreneurs Handbook and following the church's wisdom on financial management, my business turned around. Now I employ 5 people and give faithfully.",
    date: "2026-01-10",
  },
  {
    id: "testimony-4",
    name: "Grace T.",
    testimony:
      "I was hopeless as a young person, but YOFIC changed my life. The youth program taught me who I am in Christ, and today I'm a leader in my community and in the church. Thank you, Pastor Blessing!",
    date: "2025-10-05",
  },
  {
    id: "testimony-5",
    name: "Pastor Michael A.",
    testimony:
      "BOMS transformed my ministry. I learned how to build my church, lead effectively, and disciple members. The training was practical and life-changing. I recommend it to every leader.",
    date: "2025-09-18",
  },
  {
    id: "testimony-6",
    name: "Blessing O.",
    testimony:
      "I received financial deliverance after years of debt. Through the church's teaching on kingdom wealth and the prayer support, God cleared my debts and blessed me with new opportunities.",
    date: "2026-02-01",
  },
  {
    id: "testimony-7",
    name: "Ngozi B.",
    testimony:
      "After years of waiting on God for a spouse, I joined The Jewels program. Through the teachings and the community of women, I found peace and purpose. God brought my husband the following year.",
    date: "2025-08-22",
  },
  {
    id: "testimony-8",
    name: "Samuel K.",
    testimony:
      "My family was torn apart by addiction. Through the church's welfare program and pastoral counseling, my son was delivered, and our family was restored. God is indeed the healer and restorer.",
    date: "2026-03-12",
  },
];

export const getTestimonialById = (id: string) => {
  return testimonials.find((t) => t.id === id);
};
