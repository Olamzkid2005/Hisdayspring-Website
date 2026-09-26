/**
 * Books and resources data
 * Matched to actual book cover images in /images/books/ (Cloudinary)
 */

import type { Book } from "@/types";

/**
 * Where paid PDF copies are delivered from.
 *
 * These are not yet uploaded — until a PDF exists on the CDN the download
 * route refuses politely instead of serving a 404. Upload each PDF to
 * Cloudinary as `books/pdf/<book id>` and it goes live with no code change.
 */
export function bookPdfUrl(book: Book): string {
  return book.pdfPath ?? `images/books/pdf/${book.id}`;
}

/**
 * Hard cap per title per order — a receipt-shown-at-the-bookstand flow has no
 * stock system behind it, so the pickup model realistically holds to the
 * physical copies the stand has on hand.
 */
export const MAX_QUANTITY_PER_TITLE = 20;

export const books: Book[] = [
  {
    id: "100-days-devotional",
    title: "100 Days Effective Devotional Prayer Manual",
    author: "Pastor Blessing Olamijulo",
    description:
      "A powerful 100-day devotional to strengthen your prayer life and deepen your relationship with God.",
    price: 500,
    imageUrl: "/images/books/100 Days Effective Devotional Prayer Manual.jpg",
    format: "both",
    availability: "in-stock",
    purchaseUrl: "https://pastorblessing.com/product/100-days-devotional-prayer-book/",
  },
  {
    id: "hundred-lights",
    title: "A Hundred Lights",
    author: "Pastor Blessing Olamijulo",
    description:
      "Illuminating truths and spiritual insights to guide your walk with God and brighten your path.",
    price: 500,
    imageUrl: "/images/books/A Hundred Lights.jpg",
    format: "both",
    availability: "in-stock",
    purchaseUrl: "https://pastorblessing.com/shop/",
  },
  {
    id: "be-youtiful",
    title: "Be-Youtiful",
    author: "Pastor (Mrs) Adebamigbe Olamijulo",
    description:
      "Discover your true beauty and identity in Christ — a message for every young woman walking in purpose.",
    price: 1000,
    imageUrl: "/images/books/Be-Youtiful.jpg",
    format: "both",
    availability: "in-stock",
    purchaseUrl: "https://pastorblessing.com/shop/",
  },
  {
    id: "made-to-be-whole",
    title: "Made To Be Whole",
    author: "Pastor Blessing Olamijulo",
    description:
      "Discover biblical principles for health, wealth, and prosperity in every area of your life.",
    price: 2000,
    imageUrl: "/images/books/Made To Be Whole.jpg",
    format: "both",
    availability: "in-stock",
    purchaseUrl: "https://pastorblessing.com/product/made-to-be-whole/",
  },
  {
    id: "ministry-leadership",
    title: "Ministry Leadership",
    author: "Pastor Blessing Olamijulo",
    description:
      "A comprehensive guide for church leaders and ministers on building ministry according to God's divine pattern.",
    price: 2000,
    imageUrl: "/images/books/Ministry Leadership.jpg",
    format: "both",
    availability: "in-stock",
    purchaseUrl: "https://pastorblessing.com/product/ministry-leadership-building-according-to-gods-pattern/",
  },
  {
    id: "relationship-marriage",
    title: "Relationship and Marriage",
    author: "Pastor Blessing Olamijulo",
    description:
      "Building strong, lasting relationships and marriages founded on the Rock of God's Word.",
    price: 1000,
    imageUrl: "/images/books/Relationship and Marriage.jpg",
    format: "both",
    availability: "in-stock",
    purchaseUrl: "https://pastorblessing.com/product/relationship-and-marriage/",
  },
  {
    id: "study-of-spirits",
    title: "Study Of The Spirits",
    author: "Pastor Blessing Olamijulo",
    description:
      "Understanding spiritual forces and learning to operate in the supernatural power of God.",
    price: 2000,
    imageUrl: "/images/books/Study Of The Spirits.jpg",
    format: "both",
    availability: "in-stock",
    purchaseUrl: "https://pastorblessing.com/product/study-of-the-spirits/",
  },
  {
    id: "success-pillars",
    title: "Success Pillars",
    author: "Pastor Blessing Olamijulo",
    description:
      "The foundational principles of success according to God's Word for every area of life.",
    price: 1000,
    imageUrl: "/images/books/Sucess Pillars.jpg",
    format: "both",
    availability: "in-stock",
    purchaseUrl: "https://pastorblessing.com/product/success-pillars/",
  },
  {
    id: "eagle-youth",
    title: "The Eagle Youth",
    author: "Pastor Blessing Olamijulo",
    description:
      "A youth-focused book on rising above challenges and soaring to great heights in God.",
    price: 1000,
    imageUrl: "/images/books/The Eagle Youth.jpg",
    format: "both",
    availability: "in-stock",
    purchaseUrl: "https://pastorblessing.com/product/the-eagle-youth/",
  },
  {
    id: "entrepreneurs-handbook",
    title: "The Entrepreneurs Handbook",
    author: "Pastor Blessing Olamijulo",
    description:
      "Essential guide for business owners and aspiring entrepreneurs seeking to build successful businesses God's way.",
    price: 1000,
    imageUrl: "/images/books/The Entrepreneurs Handbook.jpg",
    format: "both",
    availability: "in-stock",
    purchaseUrl: "https://pastorblessing.com/product/entrepreneurs-handbook/",
  },
  {
    id: "nurtured-star",
    title: "The Nurtured Star",
    author: "Pastor (Mrs) Adebamigbe Olamijulo",
    description:
      "For young people destined to shine, learn how to nurture your God-given potential.",
    price: 1000,
    imageUrl: "/images/books/The Nurtured Star.jpg",
    format: "both",
    availability: "in-stock",
    purchaseUrl: "https://pastorblessing.com/product/the-nurtured-star/",
  },
  {
    id: "righteous-walk",
    title: "The Righteous Walk",
    author: "Pastor Blessing Olamijulo",
    description:
      "Walking in righteousness and divine favor through practical biblical principles.",
    price: 3000,
    imageUrl: "/images/books/The Righteous Walk.jpg",
    format: "physical",
    availability: "in-stock",
    purchaseUrl: "https://pastorblessing.com/product/the-righteous-walk/",
  },
  {
    id: "stewards-call",
    title: "The Steward's Call",
    author: "Pastor Blessing Olamijulo",
    description:
      "Understanding your role as a steward of God's resources and blessings.",
    price: 3000,
    imageUrl: "/images/books/The Stewards Call.jpg",
    format: "physical",
    availability: "in-stock",
    purchaseUrl: "https://pastorblessing.com/product/the-stewards-call/",
  },
];

export const featuredBooks = books.filter((book) => book.price < 1000);

/**
 * Ceiling on the number of *distinct titles* in one order, derived from the
 * catalog so it can never drift below it: ordering the whole shelf at once is a
 * legitimate purchase and must stay possible.
 *
 * This was once a hardcoded 10 while the catalog holds 13 titles, so "select
 * every book" was rejected server-side with the misleading message "Invalid or
 * empty book order". Copies per title are bounded by `MAX_QUANTITY_PER_TITLE`,
 * and the checkout-metadata size guard in `lib/server/book-orders.ts` is what
 * actually protects the Bachs payload.
 */
export const MAX_DISTINCT_TITLES = books.length;

export const getBookById = (id: string) => {
  return books.find((book) => book.id === id);
};
