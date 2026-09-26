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
// Workforce Section Types
// =============================================================================

export interface WorkforceMember {
  id: string;
  name: string;
  title: string;
  role: "lead-pastor" | "branch-pastor" | "minister" | "head-of-department";
  biography: string;
  imageUrl: string;
  branch?: string;
  department?: string;
  education?: string[];
  spouse?: string;
  children?: string;
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
  longDescription?: string;
  highlights?: string[];
  schedule?: string;
  founded?: string;
  verse?: {
    text: string;
    reference: string;
  };
  stats?: {
    value: string;
    label: string;
  }[];
  gallery?: string[];
  programs?: {
    name: string;
    description: string;
    topics?: string[];
  }[];
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
  dates?: {
    date: string;
    time: string;
  }[];
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
  /** Legacy external shop link (no longer rendered; ordering is in-site). */
  purchaseUrl?: string;
  /**
   * PDF delivery path. When omitted, the convention in `data/books.ts`
   * (`books/pdf/<id>.pdf` on Cloudinary) is used, so per-book entries are
   * only needed for a PDF hosted outside the convention.
   */
  pdfPath?: string;
}

// -----------------------------------------------------------------------------
// Book Ordering Types (paid via Bachs, picked up in church or PDF download)
// -----------------------------------------------------------------------------

export type BookOrderFulfillment = "pickup" | "pdf";

export interface BookOrderItem {
  bookId: string;
  quantity: number;
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

export type GalleryCategory = "sunday-services" | "youth-events" | "women-program" | "special-events" | "prayer-wall";

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
  /** Free-form branch label — not tied to the service-time Branch union. */
  branch: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  phoneAlt?: string;
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
  | "seeds-and-donations"
  | "pastoral-giving";

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
  /** Bachs checkout session id (`chk_...`), used to confirm the payment. */
  checkoutId?: string;
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
