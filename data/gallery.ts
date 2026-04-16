/**
 * Gallery photos data
 * PLACEHOLDER - Replace with actual church photos
 */

import type { GalleryPhoto, GalleryCategory } from "@/types";

export const galleryPhotos: GalleryPhoto[] = [
  // Sunday Services
  {
    id: "gallery-1",
    imageUrl: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80",
    caption: "Sunday worship service in full bloom",
    category: "sunday-services",
    eventName: "Sunday Service",
    date: "2026-04-13",
  },
  {
    id: "gallery-2",
    imageUrl: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800&q=80",
    caption: "Choir rendering melodious hymns",
    category: "sunday-services",
    eventName: "Sunday Service",
    date: "2026-04-06",
  },
  {
    id: "gallery-3",
    imageUrl: "https://images.unsplash.com/photo-1478144592103-25e218a04891?w=800&q=80",
    caption: "Congregation in prayer",
    category: "sunday-services",
    eventName: "Midweek Service",
    date: "2026-04-09",
  },
  // Youth Events
  {
    id: "gallery-4",
    imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
    caption: "YOFIC youth in worship",
    category: "youth-events",
    eventName: "YOFIC Friday Service",
    date: "2026-04-11",
  },
  {
    id: "gallery-5",
    imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80",
    caption: "Youth conference delegates",
    category: "youth-events",
    eventName: "Discovery Conference",
    date: "2025-12-20",
  },
  // Women's Program
  {
    id: "gallery-6",
    imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&q=80",
    caption: "The Jewels breakfast meeting",
    category: "women-program",
    eventName: "The Jewels Monthly Meeting",
    date: "2026-03-15",
  },
  // BOMS
  {
    id: "gallery-7",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    caption: "BOMS graduation ceremony",
    category: "special-events",
    eventName: "BOMS Graduation 2025",
    date: "2025-08-15",
  },
  {
    id: "gallery-8",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    caption: "BOMS classroom session",
    category: "special-events",
    eventName: "BOMS Training",
    date: "2025-07-10",
  },
  // Special Events
  {
    id: "gallery-9",
    imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    caption: "Easter celebration",
    category: "special-events",
    eventName: "Easter 2026",
    date: "2026-04-20",
  },
  {
    id: "gallery-10",
    imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
    caption: "Crusade outreach",
    category: "special-events",
    eventName: "Healing From Heaven Crusade",
    date: "2025-07-20",
  },
  // More photos to reach 12-16
  {
    id: "gallery-11",
    imageUrl: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80",
    caption: "Morning devotion",
    category: "sunday-services",
    eventName: "Sunday Service",
    date: "2026-04-13",
  },
  {
    id: "gallery-12",
    imageUrl: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&q=80",
    caption: "Youth fellowship",
    category: "youth-events",
    eventName: "YOFIC Retreat",
    date: "2025-11-15",
  },
  {
    id: "gallery-13",
    imageUrl: "https://images.unsplash.com/photo-1559548331-f9cb98001426?w=800&q=80",
    caption: "Giving and tithes",
    category: "sunday-services",
    eventName: "Thanksgiving Service",
    date: "2026-01-01",
  },
  {
    id: "gallery-14",
    imageUrl: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800&q=80",
    caption: "Women in worship",
    category: "women-program",
    eventName: "The Jewels Conference",
    date: "2025-03-08",
  },
  {
    id: "gallery-15",
    imageUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80",
    caption: "Bible study session",
    category: "sunday-services",
    eventName: "Midweek Bible Study",
    date: "2026-04-02",
  },
  {
    id: "gallery-16",
    imageUrl: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80",
    caption: "Special announcement",
    category: "special-events",
    eventName: "Church Anniversary",
    date: "2025-10-01",
  },
];

export const getPhotosByCategory = (category: GalleryCategory) => {
  return galleryPhotos.filter((photo) => photo.category === category);
};

export const galleryCategories: { value: GalleryCategory; label: string }[] = [
  { value: "sunday-services", label: "Sunday Services" },
  { value: "youth-events", label: "Youth Events" },
  { value: "women-program", label: "Women's Program" },
  { value: "special-events", label: "Special Events" },
];
