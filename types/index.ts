/**
 * Hisdayspring Ministries International - TypeScript Type Definitions
 * All data models and interfaces for the church website
 */

// =============================================================================
// Navigation & Layout Types
// =============================================================================

export interface NavigationLink {
  id: string;
  label: string;
  href: string;
  isExternal?: boolean;
}

// =============================================================================
// About Section Types
// =============================================================================

export interface Statistic {
  value: number;
  label: string;
  suffix?: string;
}

export interface AboutContent {
  mission: string;
  vision: string;
  statistics: Statistic[];
  branchInfo: string;
}

// =============================================================================
// Pastor Section Types
// =============================================================================

export interface PastorInfo {
  name: string;
  title: string;
  biography: string;
  imageUrl: string;
  education: string[];
  ministries: string[];
  spouse?: string;
  children?: string[];
  mentoringSchool?: string;
}

// =============================================================================
// Service Times Types
// =============================================================================

export type Branch = "Ipaja" | "Ikeja" | "Both";

export interface ServiceTime {
  id: string;
  name: string;
  day: string;
  time: string;
  branch: Branch;
  description?: string;
}

// =============================================================================
// Ministry Types
// =============================================================================

export interface Ministry {
  id: string;
  name: string;
  description: string;
  icon?: string;
  imageUrl?: string;
  branch?: Branch;
}

// =============================================================================
// Events Types
// =============================================================================

export interface Event {
  id: string;
  title: string;
  date: string; // ISO date string
  time: string;
  location: string;
  description?: string;
  imageUrl?: string;
  category: "youth" | "women" | "general" | "special";
  isFeatured?: boolean;
}

// =============================================================================
// Books & Resources Types
// =============================================================================

export type BookFormat = "physical" | "ebook" | "both";
export type BookAvailability = "in-stock" | "out-of-stock" | "pre-order" | "digital-only";

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number; // Price in Naira
  imageUrl: string;
  format: BookFormat;
  availability: BookAvailability;
  purchaseUrl?: string;
}

// =============================================================================
// Testimonials Types
// =============================================================================

export interface Testimonial {
  id: string;
  name: string;
  testimony: string;
  photoUrl?: string;
  date?: string;
}

// =============================================================================
// Gallery Types
// =============================================================================

export type GalleryCategory = "sunday-services" | "youth-events" | "women-program" | "special-events";

export interface GalleryPhoto {
  id: string;
  imageUrl: string;
  caption?: string;
  category: GalleryCategory;
  eventName?: string;
  date?: string;
}

// =============================================================================
// Contact & Social Types
// =============================================================================

export interface BranchAddress {
  branch: Branch;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  addresses: BranchAddress[];
  officeHours?: string;
}

export interface SocialLink {
  platform: "facebook" | "youtube" | "instagram" | "twitter" | "zenofm";
  url: string;
  label: string;
}

// =============================================================================
// Donation & Payment Types
// =============================================================================

export type DonationPurpose =
  | "tithes"
  | "offerings"
  | "special-projects"
  | "building-fund"
  | "missions"
  | "youth-ministry";

export type PaymentMethod = "bank-transfer" | "card-payment" | "mobile-money";

export interface DonationPurposeOption {
  id: DonationPurpose;
  label: string;
  description?: string;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface DonationFormData {
  name: string;
  email: string;
  phone: string;
  amount: number;
  purpose: DonationPurpose;
  paymentMethod: PaymentMethod;
}

// =============================================================================
// YouTube & Live Stream Types
// =============================================================================

export interface YouTubeVideo {
  id: string;
  videoId: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  publishedAt: string;
  duration?: string;
  viewCount?: string;
}

export interface LiveStreamStatus {
  isLive: boolean;
  videoId?: string;
  title?: string;
  viewerCount?: number;
  startedAt?: string;
}

// =============================================================================
// Form Data Types
// =============================================================================

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface PrayerRequestFormData {
  name: string;
  email: string;
  prayerRequest: string;
}

export interface NewsletterFormData {
  name: string;
  email: string;
}

// =============================================================================
// API Response Types
// =============================================================================

export interface PaymentResponse {
  success: boolean;
  reference?: string;
  authorizationUrl?: string;
  message?: string;
}

export interface FormSubmissionResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

// =============================================================================
// Cookie Consent Types
// =============================================================================

export interface CookieConsent {
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

// =============================================================================
// Component Props Types
// =============================================================================

export interface SectionProps {
  className?: string;
}

export interface AnimatedSectionProps extends SectionProps {
  variants?: import("framer-motion").Variants;
  transition?: import("framer-motion").Transition;
}
