/**
 * Books and resources data
 * Real content from pastorblessing.com/shop
 */

import type { Book } from "@/types";

export const books: Book[] = [
  {
    id: "100-days-devotional",
    title: "100 Days Devotional Prayer Book",
    author: "Pastor Blessing Olamijulo",
    description:
      "A powerful 100-day devotional to strengthen your prayer life and deepen your relationship with God.",
    price: 500,
    imageUrl: "/images/books/100-days-devotional.jpg",
    format: "both",
    availability: "in-stock",
    purchaseUrl: "https://pastorblessing.com/product/100-days-devotional-prayer-book/",
  },
  {
    id: "entrepreneurs-handbook",
    title: "Entrepreneurs Handbook",
    author: "Pastor Blessing Olamijulo",
    description:
      "Essential guide for business owners and aspiring entrepreneurs seeking to build successful businesses God's way.",
    price: 1200,
    imageUrl: "/images/books/entrepreneurs-handbook.jpg",
    format: "both",
    availability: "in-stock",
    purchaseUrl: "https://pastorblessing.com/product/entrepreneurs-handbook/",
  },
  {
    id: "made-to-be-whole",
    title: "Made to Be Whole: How to Live A Healthy & Prosperous Life",
    author: "Pastor Blessing Olamijulo",
    description:
      "Discover biblical principles for health, wealth, and prosperity in every area of your life.",
    price: 2000,
    imageUrl: "/images/books/made-to-be-whole.jpg",
    format: "both",
    availability: "in-stock",
    purchaseUrl: "https://pastorblessing.com/product/made-to-be-whole/",
  },
  {
    id: "ministry-leadership",
    title: "Ministry Leadership Building According To God's Pattern",
    author: "Pastor Blessing Olamijulo",
    description:
      "A comprehensive guide for church leaders and ministers on building ministry according to God's divine pattern.",
    price: 2000,
    imageUrl: "/images/books/ministry-leadership.jpg",
    format: "both",
    availability: "in-stock",
    purchaseUrl: "https://pastorblessing.com/product/ministry-leadership-building-according-to-gods-pattern/",
  },
  {
    id: "relationship-marriage",
    title: "Relationship And Marriage",
    author: "Pastor Blessing Olamijulo",
    description:
      "Building strong, lasting relationships and marriages founded on the Rock of God's Word.",
    price: 1000,
    imageUrl: "/images/books/relationship-marriage.jpg",
    format: "both",
    availability: "in-stock",
    purchaseUrl: "https://pastorblessing.com/product/relationship-and-marriage/",
  },
  {
    id: "study-of-spirits",
    title: "STUDY OF THE SPIRITS – Operating in the Supernatural",
    author: "Pastor Blessing Olamijulo",
    description:
      "Understanding spiritual forces and learning to operate in the supernatural power of God.",
    price: 2000,
    imageUrl: "/images/books/study-of-spirits.jpg",
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
    imageUrl: "/images/books/success-pillars.jpg",
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
    price: 500,
    imageUrl: "/images/books/eagle-youth.jpg",
    format: "both",
    availability: "in-stock",
    purchaseUrl: "https://pastorblessing.com/product/the-eagle-youth/",
  },
  {
    id: "nurtured-star",
    title: "The Nurtured Star",
    author: "Pastor Blessing Olamijulo",
    description:
      "For young people destined to shine, learn how to nurture your God-given potential.",
    price: 500,
    imageUrl: "/images/books/nurtured-star.jpg",
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
    imageUrl: "/images/books/righteous-walk.jpg",
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
    imageUrl: "/images/books/stewards-call.jpg",
    format: "physical",
    availability: "in-stock",
    purchaseUrl: "https://pastorblessing.com/product/the-stewards-call/",
  },
  {
    id: "unlocking-kingdom-wealth",
    title: "Unlocking Kingdom Wealth",
    author: "Pastor Blessing Olamijulo",
    description:
      "Discover the keys to divine prosperity and financial breakthrough in God's kingdom.",
    price: 2000,
    imageUrl: "/images/books/unlocking-kingdom-wealth.jpg",
    format: "both",
    availability: "in-stock",
    purchaseUrl: "https://pastorblessing.com/product/unlocking-kingdom-wealth/",
  },
];

export const featuredBooks = books.filter((book) => book.price < 1000);

export const getBookById = (id: string) => {
  return books.find((book) => book.id === id);
};
