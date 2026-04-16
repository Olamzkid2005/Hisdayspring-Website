/**
 * Navigation menu data
 */

import type { NavigationLink } from "@/types";

export const navigationLinks: NavigationLink[] = [
  { id: "home", label: "Home", href: "/#" },
  { id: "about", label: "About", href: "/#about" },
  { id: "pastor", label: "Our Pastor", href: "/#pastor" },
  { id: "services", label: "Service Times", href: "/#services" },
  { id: "sermons", label: "Sermons", href: "/#sermons" },
  { id: "radio", label: "Radio", href: "/#radio" },
  { id: "ministries", label: "Ministries", href: "/#ministries" },
  { id: "events", label: "Events", href: "/#events" },
  { id: "books", label: "Books", href: "/#books" },
  { id: "give", label: "Give", href: "/#give" },
  { id: "contact", label: "Contact", href: "/#contact" },
];

export const quickLinks: NavigationLink[] = [
  { id: "home", label: "Home", href: "/#" },
  { id: "about", label: "About Us", href: "/#about" },
  { id: "sermons", label: "Sermons", href: "/#sermons" },
  { id: "ministries", label: "Ministries", href: "/#ministries" },
  { id: "events", label: "Events", href: "/#events" },
  { id: "give", label: "Give Online", href: "/#give" },
];

export const serviceLinks: NavigationLink[] = [
  { id: "yofic", label: "YOFIC Youth", href: "/#ministries" },
  { id: "discovery", label: "Discovery for Youth & Singles", href: "/#ministries" },
  { id: "jewels", label: "The Jewels Women's Program", href: "/#ministries" },
  { id: "boms", label: "Blessing Ola Mentoring School", href: "/#ministries" },
  { id: "radio", label: "Hisdayspring Radio", href: "/#radio" },
];
