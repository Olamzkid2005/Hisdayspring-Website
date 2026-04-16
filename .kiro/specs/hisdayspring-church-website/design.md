# Design Document: Hisdayspring Church Website

## Pre-Build Research Phase

Before implementation begins, the development team should conduct focused research on modern church website design patterns and technical best practices. This research phase ensures the implementation aligns with current industry standards while maintaining the unique editorial magazine aesthetic specified in the requirements.

**Research Areas**:

1. **Modern Church Website Design Patterns**:
   - Review 5-10 contemporary church websites with strong visual design (e.g., Hillsong, Elevation Church, Life.Church, Winners Chapel, Global Impact)
   - Analyze editorial magazine-style layouts in religious contexts
   - Study luxury ministry design elements (typography, color palettes, spacing)
   - Document effective hero section patterns and call-to-action placements

2. **Technical Implementation Patterns**:
   - Review Next.js 14+ App Router best practices for single-page applications
   - Study Framer Motion animation patterns for scroll-triggered effects
   - Research Tailwind CSS utility patterns for editorial layouts
   - Examine performance optimization techniques for media-heavy sites

3. **Accessibility and UX Patterns**:
   - Study WCAG 2.1 Level AA compliant church websites
   - Review keyboard navigation patterns for single-page applications
   - Analyze form design patterns for donations and prayer requests
   - Document mobile-first responsive design approaches

4. **External Integration Patterns**:
   - Review YouTube API integration best practices for sermon libraries
   - Study payment gateway integration patterns (Paystack/Flutterwave)
   - Examine social media embed strategies
   - Research live streaming implementation patterns

**Research Deliverables**:
- Visual mood board with 10-15 reference screenshots
- Technical architecture notes documenting chosen patterns
- Accessibility checklist based on reviewed examples
- Performance benchmark targets from similar sites

**Time Allocation**: 4-6 hours before beginning implementation

**Note**: This research phase is exploratory and informational. The requirements document already specifies the design direction (editorial magazine aesthetic, luxury ministry elements, specific color palette). Research should inform implementation details, not change core requirements.

## Overview

The Hisdayspring Church Website is a comprehensive, single-page application (SPA) built with Next.js 14+ App Router, TypeScript, Tailwind CSS, and Framer Motion. The website serves as the primary digital presence for Hisdayspring Ministries International, a church with branches in Ipaja and Ikeja, Lagos State, Nigeria.

The application features an editorial magazine aesthetic with luxury ministry design elements, combining deep navy/royal purple primary colors with gold accents and cream/white backgrounds. The site provides 15+ major sections accessible through smooth-scrolling navigation, including hero landing, about, pastor biography, service times, sermons, radio player, ministries, events, books, donations, prayer requests, contact, live streaming, testimonials, and photo gallery.

Key technical characteristics:
- **Architecture**: Single-page application with client-side routing and smooth scroll navigation
- **Content Strategy**: Static content stored in structured data files (JSON/TypeScript) for easy church administrator updates
- **External Integrations**: YouTube API for sermons and live streaming, Zeno.fm for radio player, Paystack/Flutterwave for payments, Google Maps for location display
- **Performance Targets**: Lighthouse 90+ desktop, 80+ mobile with lazy loading and Next.js optimizations
- **Accessibility**: WCAG 2.1 Level AA compliance with semantic HTML, keyboard navigation, and screen reader support
- **Responsive Design**: Mobile-first approach supporting 320px to 1920px viewports with breakpoints at 640px, 768px, and 1024px

The website is designed for two primary user groups: prospective visitors seeking information about the church, and existing members accessing sermons, events, and online giving. The content management structure allows non-technical church administrators to update content through clearly documented data files without requiring developer intervention.

## Architecture

### System Architecture

The application follows a **layered component architecture** with clear separation of concerns:

**Project Structure:**
The application follows a standard Next.js 14+ App Router structure with the following key directories:
- `app/` - Next.js App Router pages and layouts
  - `app/page.tsx` - Homepage (main single-page application)
  - `app/privacy/page.tsx` - Privacy policy page
  - `app/not-found.tsx` - Custom 404 error page
  - `app/api/livestream/route.ts` - Server-side API route for YouTube live status (protects API key)
- `components/` - Reusable React components organized by feature
  - `components/sections/` - Section components (Hero, About, Pastor, etc.)
  - `components/layout/` - Layout components (Navigation, Footer, WhatsAppFloat)
  - `components/ui/` - Reusable UI components (Button, Input, Card, Modal, etc.)
  - `components/utility/` - Utility components (SEO, CookieConsent, ErrorBoundary)
- `lib/` - Utility functions, helpers, and shared logic
  - `lib/api/` - External API clients (YouTube, Paystack, etc.)
  - `lib/utils/` - Helper functions (date formatting, validation, etc.)
  - `lib/animations/` - Framer Motion variants and transitions
  - `lib/config/` - Environment configuration and validation
- `data/` - Content data files (JSON/TypeScript constants) for easy content management
- `types/` - Shared TypeScript interfaces and type definitions
- `hooks/` - Custom React hooks (e.g., useScrollPosition, useCounterAnimation)
- `public/` - Static assets (images, fonts, icons)

**Data Layer** (Content Management)
- Structured data files (`data/`) store all content as TypeScript constants or JSON
- Type definitions (`types/`) ensure type safety across data structures
- Content organized by domain: `data/about.ts`, `data/ministries.ts`, `data/events.ts`, etc.
- Build-time validation ensures content structure integrity

**Integration Layer** (External Services)
- API utilities (`lib/api/`) handle external service communication
- YouTube API client for sermon videos and live streaming
- Zeno.fm embed integration for radio player
- Paystack/Flutterwave SDK integration for payment processing
- Google Maps embed for location display

**Utility Layer** (Shared Logic)
- Custom hooks (`hooks/`) for reusable stateful logic (scroll position, counter animations, form validation)
- Helper functions (`lib/utils/`) for common operations (date formatting, validation, string manipulation)
- Animation utilities (`lib/animations/`) for Framer Motion variants and transitions

### Navigation and Routing Strategy

The application uses a **single-page architecture with anchor-based navigation**:

1. **Routes**: 
   - `/` - Homepage (main single-page application with all sections)
   - `/privacy` - Privacy policy page (separate route)
   - `/not-found` - Custom 404 error page
   - `/api/livestream` - Server-side API route for YouTube live status check (protects API key from client exposure)
2. **Anchor Navigation**: Navigation links use hash fragments (`#about`, `#sermons`, etc.) to scroll to sections
3. **Smooth Scrolling**: Custom scroll behavior with `scrollIntoView` provides smooth transitions between sections
4. **Active Section Tracking**: Intersection Observer API detects which section is currently in viewport and updates navigation highlighting
5. **URL State**: Hash fragments in URL allow direct linking to specific sections and browser back/forward navigation

This approach provides the user experience of a multi-page site while maintaining the performance benefits and simplicity of a single-page application.

**Server-Side API Route for Live Stream**:
The `/api/livestream` route is a Next.js Route Handler that proxies YouTube API calls server-side to protect the API key. This is necessary because:
- YouTube Data API v3 keys should not be exposed in client-side code
- The live stream status check requires authenticated API calls
- Server-side caching can reduce API quota usage

```typescript
// app/api/livestream/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get('channelId');
  
  // Server-side YouTube API call with protected API key
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?` +
    `part=snippet&channelId=${channelId}&eventType=live&type=video` +
    `&key=${process.env.YOUTUBE_API_KEY}`, // Server-side only
    { next: { revalidate: 60 } } // Cache for 60 seconds
  );
  
  const data = await response.json();
  return Response.json(data);
}
```

### State Management Strategy

The application uses **minimal state management** appropriate for a content-focused website:

**Local Component State** (React useState)
- UI state: mobile menu open/closed, modal visibility, form input values
- Interaction state: hover effects, active tabs, carousel position
- Transient state that doesn't need persistence or sharing

**URL State** (Hash Fragments)
- Current section for navigation highlighting
- Allows bookmarking and sharing specific sections
- Managed through browser history API

**Browser Storage** (localStorage)
- Cookie consent preferences
- Form draft data (optional, for prayer requests)
- No sensitive data stored client-side

**No Global State Management**: The application intentionally avoids Redux, Zustand, or Context API for global state. Content is static and passed as props, external data is fetched at component level, and UI state is localized to components. This reduces complexity and improves maintainability for a content-focused site.

### Performance Architecture

**Code Splitting Strategy**:
- Automatic route-based splitting via Next.js App Router
- Dynamic imports for heavy components (lightbox gallery, payment modals)
- Lazy loading for below-the-fold sections using React.lazy and Suspense

**Asset Optimization**:
- Next.js Image component with automatic WebP/AVIF conversion
- Responsive image srcsets for different viewport sizes
- Font optimization with next/font for self-hosted fonts
- SVG icons for scalable, cacheable graphics

**Caching Strategy**:
- Static generation (SSG) for all pages at build time
- Aggressive caching headers for static assets (images, fonts, scripts)
- YouTube/Zeno.fm content cached by external CDNs
- Server-side API route (`/api/livestream`) uses Next.js revalidation (60s cache) for live status checks
- No client-side SSR or incremental static regeneration (ISR) needed for static content

**Loading Strategy**:
- Above-the-fold content prioritized (Hero, Navigation)
- Below-the-fold sections lazy loaded with Intersection Observer
- External scripts (YouTube, payment gateways) loaded on-demand
- Critical rendering path optimized with Next.js automatic optimizations

### Security Architecture

**Client-Side Security**:
- Environment variables for API keys (YouTube, Paystack, Google Maps)
- Public keys only (no server-side secrets in client code)
- Content Security Policy (CSP) headers for XSS protection
- HTTPS enforcement for all external API calls

**Form Security**:
- Client-side validation for all form inputs
- Email validation with regex patterns
- CSRF protection not required (no server-side state)
- Rate limiting handled by external services (Paystack, email providers)

**Payment Security**:
- PCI DSS compliance through Paystack/Flutterwave SDKs
- No card data stored or processed client-side
- Payment tokens handled by payment gateway
- Secure redirect flow for payment completion

**Data Privacy**:
- Cookie consent banner for GDPR compliance
- Privacy policy page with data collection disclosure
- No tracking cookies without user consent
- Third-party service disclosure (YouTube, Zeno.fm, payment gateways)
- YouTube embeds use `youtube-nocookie.com` domain when user declines cookies to respect privacy preferences

## Components and Interfaces

The application is organized into a component hierarchy with clear separation of concerns. Each component has well-defined responsibilities and interfaces.

### Layout Components

#### Navigation Component (`components/layout/Navigation.tsx`)

**Purpose**: Site-wide navigation with sticky positioning and scroll-based styling

**Props Interface**:
```typescript
interface NavigationProps {
  // No props - uses internal state and scroll position
}
```

**Internal State**:
- `isScrolled: boolean` - Tracks if page scrolled past 50px
- `isMobileMenuOpen: boolean` - Mobile menu visibility state
- `activeSection: string` - Current section in viewport

**Key Features**:
- Intersection Observer for active section tracking
- Smooth scroll to anchor sections
- Responsive mobile hamburger menu
- Transparent-to-solid background transition on scroll

**Dependencies**:
- `useScrollPosition` hook for scroll tracking
- `useIntersectionObserver` hook for section detection

---

#### Footer Component (`components/layout/Footer.tsx`)

**Purpose**: Site-wide footer with contact info, quick links, and social media

**Props Interface**:
```typescript
interface FooterProps {
  // No props - uses static content from data files
}
```

**Data Sources**:
- `data/contact.ts` - Contact information
- `data/social.ts` - Social media links
- `data/navigation.ts` - Quick links

**Key Features**:
- Multi-column responsive layout
- Social media icon links
- Copyright with dynamic year
- Branch addresses and contact details

---

#### WhatsApp Float Button (`components/layout/WhatsAppFloat.tsx`)

**Purpose**: Floating WhatsApp contact button with pulse animation

**Props Interface**:
```typescript
interface WhatsAppFloatProps {
  phoneNumber: string; // Format: +234XXXXXXXXXX
  message?: string; // Pre-filled message
}
```

**Key Features**:
- Fixed positioning at bottom-right
- Pulse animation for attention
- Click-to-chat wa.me URL
- Responsive sizing for mobile

---

### Section Components

#### Hero Section (`components/sections/HeroSection.tsx`)

**Purpose**: Full-viewport landing section with animated content

**Props Interface**:
```typescript
interface HeroSectionProps {
  title: string;
  tagline: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  ctaPrimary: CTAButton;
  ctaSecondary: CTAButton;
}

interface CTAButton {
  text: string;
  href: string;
  onClick?: () => void;
}
```

**Animation Sequence**:
1. Title fade-in + slide-up (0ms delay, 800ms duration)
2. Tagline fade-in (400ms delay, 600ms duration)
3. CTA buttons fade-in (800ms delay, 400ms duration)

**Key Features**:
- Full viewport height (100vh)
- Background image/video support
- Framer Motion animations
- Responsive text sizing

---

#### About Section (`components/sections/AboutSection.tsx`)

**Purpose**: Church mission, vision, and animated statistics

**Props Interface**:
```typescript
interface AboutSectionProps {
  mission: string;
  vision: string;
  statistics: Statistic[];
}

interface Statistic {
  label: string;
  value: number;
  suffix?: string; // e.g., "+", "years"
}
```

**Key Features**:
- Counter animation from 0 to target value
- Intersection Observer triggers animation on scroll
- 2000ms animation duration with easing
- Responsive grid layout for statistics

**Dependencies**:
- `useCounterAnimation` hook for number animations
- `useIntersectionObserver` hook for scroll trigger

---

#### Pastor Section (`components/sections/PastorSection.tsx`)

**Purpose**: Pastor biography with photo and credentials

**Props Interface**:
```typescript
interface PastorSectionProps {
  pastor: PastorInfo;
}

interface PastorInfo {
  name: string;
  title: string;
  photo: string;
  biography: string[];
  education: string[];
  ministries: string[];
  family: string;
}
```

**Key Features**:
- Two-column layout (photo + bio)
- Fade-in animation on scroll
- Responsive stacking on mobile
- Structured biography sections

---

#### Service Times Section (`components/sections/ServiceTimesSection.tsx`)

**Purpose**: Display worship service schedules

**Props Interface**:
```typescript
interface ServiceTimesSectionProps {
  services: ServiceTime[];
}

interface ServiceTime {
  name: string;
  day: string;
  time: string;
  location: string; // "Ipaja" | "Ikeja" | "Both"
  description?: string;
}
```

**Key Features**:
- Card-based layout
- Branch-specific filtering
- Responsive grid (1-3 columns)
- Icon indicators for service types

---

#### Sermons Section (`components/sections/SermonsSection.tsx`)

**Purpose**: YouTube sermon video integration

**Props Interface**:
```typescript
interface SermonsSectionProps {
  channelId?: string; // YouTube channel ID
  playlistId?: string; // YouTube playlist ID
  maxVideos?: number; // Default: 6
}
```

**State Management**:
- `videos: YouTubeVideo[]` - Fetched sermon videos
- `isLoading: boolean` - Loading state
- `error: string | null` - Error message

**Key Features**:
- YouTube Data API v3 integration
- Embedded video player modal
- Fallback to channel link on API failure
- Lazy loading for performance
- Grid layout (1-3 columns responsive)

**API Integration**:
```typescript
// lib/api/youtube.ts
async function fetchSermons(channelId: string, maxResults: number): Promise<YouTubeVideo[]>
```

---

#### Radio Section (`components/sections/RadioSection.tsx`)

**Purpose**: Zeno.fm radio player integration

**Props Interface**:
```typescript
interface RadioSectionProps {
  stationId: string; // Zeno.fm station ID
  stationName: string;
}
```

**Key Features**:
- Zeno.fm embed player
- Play/pause controls
- Volume control
- Current track display (if available)
- Link to Zeno.fm station page

---

#### Ministries Section (`components/sections/MinistriesSection.tsx`)

**Purpose**: Showcase church ministry programs

**Props Interface**:
```typescript
interface MinistriesSectionProps {
  ministries: Ministry[];
}

interface Ministry {
  id: string;
  name: string;
  description: string;
  icon: string; // Icon name or path
  image?: string;
  link?: string;
}
```

**Key Features**:
- Card-based grid layout
- Hover scale/shadow effects
- Responsive columns (1-3)
- Icon or image display

---

#### Events Section (`components/sections/EventsSection.tsx`)

**Purpose**: Display upcoming church events

**Props Interface**:
```typescript
interface EventsSectionProps {
  events: Event[];
}

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  description: string;
  image?: string;
  category?: string; // "Youth" | "Women" | "Special" | "General"
}
```

**Key Features**:
- Chronological sorting
- Featured image display
- Empty state message
- Responsive card layout
- Date formatting utilities

---

#### Books Section (`components/sections/BooksSection.tsx`)

**Purpose**: Display and sell Pastor's books

**Props Interface**:
```typescript
interface BooksSectionProps {
  books: Book[];
}

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  currency: string; // "NGN"
  coverImage: string;
  format: ("physical" | "ebook")[];
  availability: "in-stock" | "out-of-stock" | "pre-order" | "digital-only";
  purchaseLink?: string;
  featured?: boolean;
}
```

**Key Features**:
- Grid layout with featured books
- Paystack/Flutterwave payment integration
- Format badges (Physical/E-book)
- Availability indicators
- Hover effects
- Responsive columns (1-4)

**Payment Integration**:
```typescript
// lib/api/paystack.ts
async function initializePayment(amount: number, email: string, metadata: object): Promise<PaymentResponse>
```

---

#### Donation Section (`components/sections/DonationSection.tsx`)

**Purpose**: Online donation with multiple payment methods

**Props Interface**:
```typescript
interface DonationSectionProps {
  purposes: DonationPurpose[];
  paymentMethods: PaymentMethod[];
}

interface DonationPurpose {
  id: string;
  name: string;
  description?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: "bank-transfer" | "card" | "mobile-money";
  config?: object;
}
```

**Form State**:
```typescript
interface DonationFormState {
  amount: number;
  purpose: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  paymentMethod: string;
}
```

**Key Features**:
- Preset and custom amount options
- Purpose selection
- Multi-step payment flow
- Bank details display for transfers
- Paystack/Flutterwave card processing
- Receipt/confirmation email
- Form validation
- Loading states

---

#### Live Stream Section (`components/sections/LiveStreamSection.tsx`)

**Purpose**: Live worship service streaming

**Props Interface**:
```typescript
interface LiveStreamSectionProps {
  youtubeChannelId: string;
  facebookPageId?: string;
  serviceTimes: ServiceTime[];
}
```

**State Management**:
- `isLive: boolean` - Current streaming status
- `nextService: Date | null` - Next scheduled service (computed from serviceTimes)
- `viewerCount: number | null` - Current viewers

**Key Features**:
- YouTube Live embed (primary)
- Facebook Live fallback
- Live/offline indicator
- Countdown to next service
- Viewer count display
- Responsive 16:9 aspect ratio
- Auto-refresh for live status

**Next Service Calculation**:
The component calculates the next service occurrence from `ServiceTime[]` data:
```typescript
// Utility function to calculate next service
function getNextService(serviceTimes: ServiceTime[]): Date | null {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Map day names to day numbers
  const dayMap: Record<string, number> = {
    'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
    'Thursday': 4, 'Friday': 5, 'Saturday': 6
  };
  
  // Find next service
  for (const service of serviceTimes) {
    const serviceDay = dayMap[service.day];
    const [startTime] = service.time.split(' - '); // e.g., "7:00 AM - 9:00 AM" → "7:00 AM"
    const [hours, minutes] = parseTime(startTime); // Parse "7:00 AM" → [7, 0]
    
    // Calculate days until next occurrence
    let daysUntil = serviceDay - currentDay;
    if (daysUntil < 0) daysUntil += 7; // Next week
    if (daysUntil === 0 && now.getHours() >= hours) daysUntil = 7; // Already passed today
    
    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + daysUntil);
    nextDate.setHours(hours, minutes, 0, 0);
    
    return nextDate;
  }
  
  return null;
}
```

**API Integration**:
```typescript
// Client-side call to server-side API route
async function checkLiveStatus(channelId: string): Promise<LiveStreamStatus> {
  const response = await fetch(`/api/livestream?channelId=${channelId}`);
  const data = await response.json();
  return {
    isLive: data.items?.length > 0,
    videoId: data.items?.[0]?.id?.videoId,
    title: data.items?.[0]?.snippet?.title,
    viewerCount: null // Requires additional API call
  };
}
```

---

#### Testimonials Section (`components/sections/TestimonialsSection.tsx`)

**Purpose**: Member testimonies carousel/grid

**Props Interface**:
```typescript
interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  layout?: "carousel" | "grid"; // Default: carousel
}

interface Testimonial {
  id: string;
  name: string;
  photo?: string;
  testimony: string;
  date?: Date;
}
```

**Key Features**:
- Carousel with auto-advance (5000ms)
- Navigation controls (prev/next/dots)
- Hover effects
- Staggered fade-in animations
- Responsive layout
- Quote styling

**Dependencies**:
- **Carousel library**: `embla-carousel-react` (7KB, lightweight, no SSR issues)
  - Install: `npm install embla-carousel-react`
  - Chosen for: minimal bundle size, Next.js App Router compatibility, smooth performance
  - Alternative libraries like Swiper are heavier and have SSR complications

---

#### Gallery Section (`components/sections/GallerySection.tsx`)

**Purpose**: Photo gallery with lightbox

**Props Interface**:
```typescript
interface GallerySectionProps {
  photos: GalleryPhoto[];
  categories?: string[];
}

interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category: string;
  event?: string;
}
```

**State Management**:
- `selectedCategory: string | null` - Active filter
- `lightboxOpen: boolean` - Lightbox visibility
- `currentPhotoIndex: number` - Current photo in lightbox

**Key Features**:
- Masonry/grid layout
- Category filtering
- Lightbox overlay with navigation
- Lazy loading
- Hover zoom effects
- Responsive columns (2-4)

**Dependencies**:
- **Lightbox library**: `yet-another-react-lightbox`
  - Install: `npm install yet-another-react-lightbox`
  - Chosen for: excellent Next.js compatibility, accessible, performant, modern API
  - Includes plugins for thumbnails, zoom, and fullscreen

---

#### Contact Section (`components/sections/ContactSection.tsx`)

**Purpose**: Contact form and location maps

**Props Interface**:
```typescript
interface ContactSectionProps {
  branches: Branch[];
  contactInfo: ContactInfo;
}

interface Branch {
  name: string;
  address: string;
  mapEmbedUrl: string;
}

interface ContactInfo {
  phone: string;
  email: string;
  officeHours?: string;
}
```

**Form State**:
```typescript
interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}
```

**Key Features**:
- Contact form with validation
- Google Maps embeds for both branches
- Click-to-call phone links
- Mailto email links
- Two-column layout (form + maps)
- Responsive stacking on mobile
- Success/error messaging

---

### UI Components

#### Button Component (`components/ui/Button.tsx`)

**Props Interface**:
```typescript
interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}
```

**Key Features**:
- Multiple style variants
- Loading state with spinner
- Disabled state styling
- Accessible (keyboard, ARIA)
- Hover/focus/active states

---

#### Input Component (`components/ui/Input.tsx`)

**Props Interface**:
```typescript
interface InputProps {
  type?: string;
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}
```

**Key Features**:
- Associated label (for/id)
- Error message display
- Required indicator
- Accessible (ARIA attributes)
- Focus states

---

#### Card Component (`components/ui/Card.tsx`)

**Props Interface**:
```typescript
interface CardProps {
  children: React.ReactNode;
  hover?: boolean; // Enable hover effects
  className?: string;
}
```

**Key Features**:
- Consistent padding and borders
- Optional hover effects (scale/shadow)
- Responsive design
- Reusable container

---

#### Modal Component (`components/ui/Modal.tsx`)

**Props Interface**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}
```

**Key Features**:
- Overlay backdrop
- Escape key to close
- Focus trap
- Accessible (role="dialog", aria-modal)
- Scroll lock on body
- Animation (fade-in/out)

---

#### Loading Spinner (`components/ui/LoadingSpinner.tsx`)

**Props Interface**:
```typescript
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}
```

**Key Features**:
- CSS animation
- Multiple sizes
- Brand color variants
- Accessible (role="status", aria-label)

---

#### Skeleton Screen (`components/ui/Skeleton.tsx`)

**Props Interface**:
```typescript
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: "text" | "circular" | "rectangular";
  className?: string;
}
```

**Key Features**:
- Shimmer animation
- Multiple shape variants
- Responsive sizing
- Prevents layout shift

---

#### Privacy Policy Page (`app/privacy/page.tsx`)

**Purpose**: Display privacy policy and data collection disclosure

**Props Interface**:
```typescript
// No props - uses static content from data file
```

**Data Source**:
- `data/privacy.ts` - Privacy policy content

**Key Features**:
- Full-page layout with Navigation and Footer
- Structured content sections (data collection, usage, storage, user rights)
- Table of contents for easy navigation
- Last updated date display
- Contact information for privacy inquiries
- GDPR compliance information
- Third-party service disclosures

**Content Structure**:
```typescript
interface PrivacyPolicyContent {
  lastUpdated: string; // ISO date string
  sections: PrivacySection[];
  contactEmail: string;
}

interface PrivacySection {
  id: string;
  title: string;
  content: string[]; // Array of paragraphs
}
```

---

### Utility Components

#### SEO Component (`components/utility/SEO.tsx`)

**Purpose**: Generate meta tags and structured data

**Props Interface**:
```typescript
interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string; // og:type
  structuredData?: object; // JSON-LD
}
```

**Key Features**:
- Page-specific title/description
- Open Graph tags
- Twitter Card tags
- JSON-LD structured data
- Canonical URLs
- Language meta tags

---

#### Cookie Consent Banner (`components/utility/CookieConsent.tsx`)

**Purpose**: GDPR cookie consent

**Props Interface**:
```typescript
interface CookieConsentProps {
  // No props - manages own state via localStorage
}
```

**State Management**:
- `consentGiven: boolean | null` - User's choice
- Stored in localStorage as `cookie-consent`

**Key Features**:
- Bottom-positioned banner
- Accept/Decline buttons
- Privacy policy link
- Persistent across sessions
- Dismissible after choice

**Cookie Management**:
When user declines cookies, the component:
1. Stores decline preference in localStorage
2. Prevents loading of non-essential third-party scripts
3. Uses `youtube-nocookie.com` domain for YouTube embeds instead of `youtube.com`
4. Disables analytics/tracking scripts (if any)

**Implementation Note**:
```typescript
// Use privacy-enhanced YouTube embed when cookies declined
const youtubeEmbedDomain = consentGiven 
  ? 'https://www.youtube.com/embed/'
  : 'https://www.youtube-nocookie.com/embed/';
```

---

#### Error Boundary (`components/utility/ErrorBoundary.tsx`)

**Purpose**: Catch and display React errors

**Props Interface**:
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
```

**Key Features**:
- Catches component errors
- Displays fallback UI
- Logs errors to console
- Prevents full app crash

---

### Custom Hooks

#### useScrollPosition (`hooks/useScrollPosition.ts`)

**Purpose**: Track scroll position

**Interface**:
```typescript
function useScrollPosition(): {
  scrollY: number;
  isScrolled: boolean; // scrollY > 50
}
```

**Implementation**:
- Window scroll event listener
- Debounced for performance
- Cleanup on unmount

---

#### useIntersectionObserver (`hooks/useIntersectionObserver.ts`)

**Purpose**: Detect element visibility in viewport

**Interface**:
```typescript
function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options?: IntersectionObserverInit
): boolean // isIntersecting
```

**Implementation**:
- Intersection Observer API
- Configurable threshold/rootMargin
- Cleanup on unmount

---

#### useCounterAnimation (`hooks/useCounterAnimation.ts`)

**Purpose**: Animate numbers from 0 to target

**Interface**:
```typescript
function useCounterAnimation(
  target: number,
  duration: number,
  trigger: boolean
): number // current value
```

**Implementation**:
- RequestAnimationFrame for smooth animation
- Easing function for natural motion
- Starts when trigger becomes true

---

#### useFormValidation (`hooks/useFormValidation.ts`)

**Purpose**: Form validation logic

**Interface**:
```typescript
function useFormValidation<T>(
  initialValues: T,
  validationRules: ValidationRules<T>
): {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  handleChange: (name: keyof T, value: T[keyof T]) => void;
  handleSubmit: (onSubmit: (values: T) => void) => (e: React.FormEvent) => void;
  isValid: boolean;
}
```

**Implementation**:
- Real-time validation
- Custom validation rules
- Error message generation
- Submit handler with validation

**Note**: The `handleChange` function uses `T[keyof T]` instead of `any` to maintain type safety as required by Requirement 19.7.

---

## Data Models

All content data is stored in structured TypeScript files in the `data/` directory. This allows church administrators to update content without modifying component code.

### Core Data Types (`types/index.ts`)

```typescript
// Navigation
export interface NavigationLink {
  label: string;
  href: string;
  external?: boolean;
}

// About
export interface Statistic {
  label: string;
  value: number;
  suffix?: string;
}

export interface AboutContent {
  mission: string;
  vision: string;
  statistics: Statistic[];
  branches: string[];
}

// Pastor
export interface PastorInfo {
  name: string;
  title: string;
  photo: string;
  biography: string[];
  education: string[];
  ministries: string[];
  family: string;
}

// Services
export interface ServiceTime {
  id: string;
  name: string;
  day: string; // "Sunday", "Monday", etc.
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  time: string; // "7:00 AM - 9:00 AM"
  startTime: string; // "7:00 AM" (for countdown calculation)
  location: "Ipaja" | "Ikeja" | "Both";
  description?: string;
}

// Ministries
export interface Ministry {
  id: string;
  name: string;
  description: string;
  icon: string;
  image?: string;
  link?: string;
}

// Events
export interface Event {
  id: string;
  title: string;
  date: string; // ISO 8601 date string (e.g., "2024-03-20")
  time: string;
  location: string;
  description: string;
  image?: string;
  category: "Youth" | "Women" | "Special" | "General";
}

// Books
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  currency: "NGN";
  coverImage: string;
  format: ("physical" | "ebook")[];
  availability: "in-stock" | "out-of-stock" | "pre-order" | "digital-only";
  purchaseLink?: string;
  featured?: boolean;
  testimonials?: string[];
}

// Testimonials
export interface Testimonial {
  id: string;
  name: string;
  photo?: string;
  testimony: string;
  date?: string; // ISO 8601 date string
}

// Gallery
export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category: string;
  event?: string;
}

// Contact
export interface Branch {
  name: string;
  address: string;
  mapEmbedUrl: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  whatsapp: string;
  officeHours?: string;
}

// Social Media
export interface SocialLink {
  platform: "Facebook" | "YouTube" | "Instagram" | "Twitter" | "WhatsApp" | "Zeno.fm";
  url: string;
  icon: string;
}

// Donation
export interface DonationPurpose {
  id: string;
  name: string;
  description?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: "bank-transfer" | "card" | "mobile-money";
  config?: {
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
  };
}

// YouTube
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string; // ISO 8601 date string
  duration?: string;
}

export interface LiveStreamStatus {
  isLive: boolean;
  videoId?: string;
  title?: string;
  viewerCount?: number;
}

// Forms
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface PrayerRequestFormData {
  name: string;
  email: string;
  request: string;
}

export interface NewsletterFormData {
  name: string;
  email: string;
}

export interface DonationFormData {
  amount: number;
  purpose: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  paymentMethod: string;
}

// API Responses
export interface PaymentResponse {
  success: boolean;
  reference?: string;
  authorizationUrl?: string;
  error?: string;
}

export interface FormSubmissionResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Privacy Policy
export interface PrivacyPolicyContent {
  lastUpdated: string; // ISO 8601 date string
  contactEmail: string;
  sections: PrivacySection[];
}

export interface PrivacySection {
  id: string;
  title: string;
  content: string[]; // Array of paragraphs
}
```

### Data File Structure

```
data/
├── about.ts          # Mission, vision, statistics
├── pastor.ts         # Pastor biography
├── services.ts       # Service times
├── ministries.ts     # Ministry programs
├── events.ts         # Upcoming events
├── books.ts          # Pastor's books
├── testimonials.ts   # Member testimonies
├── gallery.ts        # Photo gallery
├── contact.ts        # Contact information
├── social.ts         # Social media links
├── navigation.ts     # Navigation links
├── donations.ts      # Donation purposes and methods
└── privacy.ts        # Privacy policy content
```

### Example Data File (`data/about.ts`)

```typescript
import { AboutContent } from '@/types';

export const aboutContent: AboutContent = {
  mission: "To raise holy, healthy and wealthy people who will impact their generation for Christ.",
  vision: "To be a church where people encounter God's presence, grow in faith, and serve with purpose.",
  statistics: [
    { label: "Years of Ministry", value: 25, suffix: "+" },
    { label: "Branches", value: 2 },
    { label: "Members", value: 500, suffix: "+" }
  ],
  branches: ["Ipaja, Lagos State", "Ikeja, Lagos State"]
};
```

### Example Data File (`data/services.ts`)

```typescript
import { ServiceTime } from '@/types';

export const serviceTimes: ServiceTime[] = [
  {
    id: "sunday-first",
    name: "First Service",
    day: "Sunday",
    dayOfWeek: 0,
    time: "7:00 AM - 9:00 AM",
    startTime: "7:00 AM",
    location: "Both",
    description: "Early morning worship service"
  },
  {
    id: "sunday-second",
    name: "Second Service",
    day: "Sunday",
    dayOfWeek: 0,
    time: "9:30 AM - 11:30 AM",
    startTime: "9:30 AM",
    location: "Both",
    description: "Main worship service"
  },
  {
    id: "midweek",
    name: "Midweek Service",
    day: "Wednesday",
    dayOfWeek: 3,
    time: "6:00 PM - 8:00 PM",
    startTime: "6:00 PM",
    location: "Both",
    description: "Bible study and prayer"
  },
  {
    id: "youth",
    name: "YOFIC Youth Service",
    day: "Friday",
    dayOfWeek: 5,
    time: "5:00 PM - 7:00 PM",
    startTime: "5:00 PM",
    location: "Ipaja",
    description: "Youth fellowship and worship"
  }
];
```

### Example Data File (`data/events.ts`)

```typescript
import { Event } from '@/types';

export const events: Event[] = [
  {
    id: "youth-conference-2024",
    title: "Youth Conference 2024",
    date: "2024-03-20", // ISO 8601 string
    time: "10:00 AM",
    location: "Ipaja",
    description: "Annual youth conference with special guest speakers",
    image: "/images/events/youth-conference.jpg",
    category: "Youth"
  },
  // ... more events
];

// Utility function to parse dates at render time
export function parseEventDate(dateString: string): Date {
  return new Date(dateString);
}
```

### Example Data File (`data/privacy.ts`)

```typescript
import { PrivacyPolicyContent } from '@/types';

export const privacyPolicyContent: PrivacyPolicyContent = {
  lastUpdated: "2024-01-15",
  contactEmail: "privacy@hisdayspring.org",
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      content: [
        "Hisdayspring Ministries International ('we', 'us', or 'our') respects your privacy and is committed to protecting your personal data.",
        "This privacy policy explains how we collect, use, and protect your information when you visit our website."
      ]
    },
    {
      id: "data-collection",
      title: "Information We Collect",
      content: [
        "We collect information you provide directly to us through forms on our website, including:",
        "- Contact forms: name, email, subject, message",
        "- Prayer requests: name, email, prayer request text",
        "- Newsletter signup: name, email",
        "- Donation forms: name, email, phone number, donation amount and purpose"
      ]
    },
    {
      id: "third-party-services",
      title: "Third-Party Services",
      content: [
        "Our website uses the following third-party services:",
        "- YouTube (for sermon videos and live streaming)",
        "- Zeno.fm (for radio player)",
        "- Paystack/Flutterwave (for payment processing)",
        "- Google Maps (for location display)",
        "These services may collect data according to their own privacy policies."
      ]
    },
    // ... more sections
  ]
};
```

### Environment Variables Configuration

```typescript
// lib/config/env.ts

export const config = {
  youtube: {
    apiKey: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY, // Client-side (for sermon fetching)
    apiKeyServer: process.env.YOUTUBE_API_KEY, // Server-side only (for live stream status)
    channelId: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID,
  },
  paystack: {
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  },
  flutterwave: {
    publicKey: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
  },
  googleMaps: {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://hisdayspring.org',
    name: 'Hisdayspring Ministries International',
  }
};

// Validate required environment variables at build time
export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_YOUTUBE_API_KEY', // Client-side for sermons
    'YOUTUBE_API_KEY', // Server-side for live stream
    'NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check .env.example for required variables.'
    );
  }
}
```

### Example `.env.example` File

```bash
# YouTube Data API v3
# Get your API key from: https://console.cloud.google.com/apis/credentials

# Client-side API key (for fetching sermon videos)
# This key will be exposed in the browser, so use appropriate restrictions
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key_here
NEXT_PUBLIC_YOUTUBE_CHANNEL_ID=your_channel_id_here

# Server-side API key (for live stream status checks)
# This key is only used server-side and never exposed to the browser
# Can be the same key as above, or a separate restricted key
YOUTUBE_API_KEY=your_youtube_server_api_key_here

# Paystack Payment Gateway
# Get your public key from: https://dashboard.paystack.com/#/settings/developer
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here

# Flutterwave Payment Gateway (Optional - if using Flutterwave instead of Paystack)
# Get your public key from: https://dashboard.flutterwave.com/settings/apis
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your_flutterwave_public_key_here

# Google Maps API (Optional - for embedded maps)
# Get your API key from: https://console.cloud.google.com/google/maps-apis/credentials
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://hisdayspring.org
```

**Note on YouTube API Keys**:
- `NEXT_PUBLIC_YOUTUBE_API_KEY`: Used client-side for fetching sermon videos. This key is exposed in the browser, so apply appropriate API restrictions (HTTP referrer restrictions, YouTube Data API v3 only).
- `YOUTUBE_API_KEY`: Used server-side only in the `/api/livestream` route for checking live stream status. This key is never exposed to the browser and provides better security for API quota management.
- You can use the same YouTube API key for both variables, or create separate keys with different restrictions for better security.



## Error Handling

The application implements comprehensive error handling strategies across all layers to ensure graceful degradation and clear user feedback.

### External API Error Handling

**YouTube API Failures**:
- **Scenario**: YouTube Data API request fails (network error, rate limit, invalid API key)
- **Strategy**: 
  - Display fallback message: "Unable to load sermons at this time"
  - Provide direct link to YouTube channel
  - Log error to console for debugging
  - Retry logic with exponential backoff (3 attempts)
- **User Experience**: Users can still access sermons via direct YouTube link

**Zeno.fm Radio Player Failures**:
- **Scenario**: Zeno.fm embed fails to load
- **Strategy**:
  - Display fallback message: "Radio player unavailable"
  - Provide direct link to Zeno.fm station page
  - Timeout after 10 seconds if embed doesn't load
- **User Experience**: Users can listen via Zeno.fm website

**Payment Gateway Failures**:
- **Scenario**: Paystack/Flutterwave initialization fails
- **Strategy**:
  - Display clear error message with reason
  - Offer alternative payment method (bank transfer details)
  - Log error with transaction details for support
  - Provide contact information for assistance
- **User Experience**: Users have fallback payment options

**Google Maps Embed Failures**:
- **Scenario**: Maps fail to load
- **Strategy**:
  - Display static address text
  - Provide Google Maps link for directions
  - Show placeholder map image
- **User Experience**: Users can still get address and directions

### Form Validation and Submission Errors

**Client-Side Validation**:
- **Required Fields**: Display "This field is required" below empty required fields
- **Email Format**: Display "Please enter a valid email address" for invalid emails
- **Phone Format**: Display "Please enter a valid phone number" for invalid Nigerian phone numbers
- **Amount Validation**: Display "Please enter a valid amount" for non-numeric or negative donation amounts
- **Real-Time Feedback**: Validate on blur, show errors immediately
- **Accessible Errors**: Use `role="alert"` for screen reader announcement

**Form Submission Errors**:
- **Network Failure**: 
  - Display: "Unable to submit form. Please check your connection and try again."
  - Keep form data intact for retry
  - Provide email/phone contact as fallback
- **Server Error (5xx)**:
  - Display: "Something went wrong on our end. Please try again later."
  - Log error details for debugging
  - Provide contact information for urgent requests
- **Validation Error (4xx)**:
  - Display specific field errors returned from server
  - Highlight invalid fields
  - Preserve valid field values

**Success Feedback**:
- Display success message with confirmation
- Clear form fields after successful submission
- Provide next steps (e.g., "We'll respond within 24 hours")
- For donations: Display transaction reference number

### Loading State Error Handling

**Timeout Handling**:
- **Strategy**: Set timeout for external content (10-15 seconds)
- **Action**: Transition from loading state to error state
- **Message**: "Content is taking longer than expected to load"
- **Options**: Provide retry button or fallback content

**Skeleton Screen Failures**:
- **Strategy**: Replace skeleton with error message after timeout
- **Fallback**: Show cached content if available
- **User Action**: Provide refresh button

### Image Loading Errors

**Strategy**:
- Use `onError` handler on `<img>` elements
- Replace failed images with placeholder
- Log broken image URLs for fixing
- Ensure alt text is always present for accessibility

**Implementation**:
```typescript
<Image
  src={imageSrc}
  alt={imageAlt}
  onError={(e) => {
    e.currentTarget.src = '/images/placeholder.jpg';
    console.error('Image failed to load:', imageSrc);
  }}
/>
```

### Navigation and Routing Errors

**404 Not Found**:
- Custom 404 page with church branding
- Clear messaging: "Page Not Found"
- Navigation options: Home, About, Services, Contact
- Search functionality (optional)
- Maintain header and footer for consistency

**Broken Anchor Links**:
- Smooth scroll with error handling
- Fallback to top of page if section doesn't exist
- Log warning for debugging

### Environment Variable Errors

**Missing Required Variables**:
- **Build-Time Check**: Validate all required env vars before build
- **Error Message**: "Missing required environment variable: NEXT_PUBLIC_YOUTUBE_API_KEY"
- **Documentation**: Reference .env.example file
- **Fail Fast**: Prevent deployment with missing variables

**Invalid API Keys**:
- **Runtime Detection**: Catch API authentication errors
- **Fallback**: Display error message with instructions
- **Logging**: Log API key validation failures
- **User Message**: "Configuration error. Please contact support."

### Browser Compatibility Errors

**Unsupported Features**:
- **Intersection Observer**: Polyfill for older browsers
- **Framer Motion**: Graceful degradation (no animations)
- **Modern JavaScript**: Transpile with Babel for compatibility
- **CSS Grid/Flexbox**: Fallback layouts for IE11 (if required)

**Feature Detection**:
```typescript
if ('IntersectionObserver' in window) {
  // Use Intersection Observer
} else {
  // Fallback: trigger animations immediately
}
```

### Error Logging Strategy

**Client-Side Logging**:
- Console errors for development
- Error tracking service integration (optional: Sentry)
- Log context: user action, component, timestamp
- Avoid logging sensitive data (PII, payment info)

**Error Categories**:
- **Critical**: Payment failures, form submission failures
- **High**: API failures, broken navigation
- **Medium**: Image loading failures, animation errors
- **Low**: Non-critical UI glitches

### User-Facing Error Messages

**Principles**:
- Clear and specific (avoid technical jargon)
- Actionable (tell users what to do next)
- Empathetic (acknowledge frustration)
- Branded (maintain church's tone)

**Examples**:
- ❌ "Error 500: Internal Server Error"
- ✅ "We're having trouble processing your request. Please try again in a few moments."

- ❌ "API key invalid"
- ✅ "We're experiencing technical difficulties. Please contact us at hello@hisdayspring.org for assistance."

- ❌ "Validation failed"
- ✅ "Please check the highlighted fields and try again."

### Error Recovery Strategies

**Retry Logic**:
- Automatic retry for transient failures (network errors)
- Exponential backoff: 1s, 2s, 4s delays
- Maximum 3 retry attempts
- User-initiated retry button for manual control

**Graceful Degradation**:
- Core content always accessible (mission, contact info)
- Enhanced features fail gracefully (animations, external content)
- Fallback to static content when dynamic content fails
- Maintain navigation and footer in all error states

**Cache and Offline Support**:
- Cache static assets aggressively
- Service worker for offline page (optional)
- Display cached content when API fails
- Clear "offline" indicator when network unavailable

## Testing Strategy

The testing strategy ensures comprehensive coverage across functionality, accessibility, performance, and user experience. The application uses a multi-layered testing approach appropriate for a static content website with external integrations.

### Testing Philosophy

**Property-Based Testing Assessment**:
Property-based testing (PBT) is **NOT appropriate** for this application because:
- The application is primarily **UI rendering and layout** (not suitable for PBT)
- Content is **static and declarative** (no complex transformation logic)
- External integrations test **infrastructure wiring** (not pure functions)
- Forms perform **simple validation** (better suited for example-based tests)
- Payment processing is handled by **external SDKs** (integration tests, not PBT)

**Testing Approach**:
- **Unit Tests**: Component rendering, utility functions, form validation
- **Integration Tests**: External API interactions, payment flows, form submissions
- **Accessibility Tests**: WCAG 2.1 Level AA compliance, keyboard navigation, screen reader support
- **Visual Regression Tests**: Layout consistency, responsive design, component styling
- **Performance Tests**: Lighthouse audits, Core Web Vitals, load time optimization
- **Manual Tests**: Cross-browser compatibility, real device testing, user acceptance

### Unit Testing

**Framework**: Jest + React Testing Library

**Component Tests**:
Test each component in isolation with example-based tests:

```typescript
// Example: Button component test
describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click Me');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

**Form Validation Tests**:
Test validation logic with specific examples:

```typescript
describe('useFormValidation', () => {
  it('validates required fields', () => {
    const { result } = renderHook(() => 
      useFormValidation({ name: '', email: '' }, {
        name: { required: true },
        email: { required: true, email: true }
      })
    );
    
    expect(result.current.errors.name).toBe('This field is required');
    expect(result.current.errors.email).toBe('This field is required');
  });

  it('validates email format', () => {
    const { result } = renderHook(() => 
      useFormValidation({ email: 'invalid-email' }, {
        email: { required: true, email: true }
      })
    );
    
    expect(result.current.errors.email).toBe('Please enter a valid email address');
  });

  it('validates Nigerian phone numbers', () => {
    const { result } = renderHook(() => 
      useFormValidation({ phone: '12345' }, {
        phone: { required: true, pattern: /^\+?234[0-9]{10}$/ }
      })
    );
    
    expect(result.current.errors.phone).toBe('Please enter a valid phone number');
  });
});
```

**Utility Function Tests**:
Test helper functions with example inputs:

```typescript
describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('January 15, 2024');
  });

  it('handles null dates', () => {
    expect(formatDate(null)).toBe('Invalid date');
  });
  
  it('handles undefined dates', () => {
    expect(formatDate(undefined)).toBe('Invalid date');
  });
});

// Function signature with proper TypeScript types
function formatDate(date: Date | null | undefined): string {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid date';
  }
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

describe('formatCurrency', () => {
  it('formats Nigerian Naira correctly', () => {
    expect(formatCurrency(5000, 'NGN')).toBe('₦5,000');
  });

  it('handles zero amounts', () => {
    expect(formatCurrency(0, 'NGN')).toBe('₦0');
  });
});
```

**Custom Hook Tests**:
Test hooks with specific scenarios:

```typescript
describe('useCounterAnimation', () => {
  it('animates from 0 to target value', async () => {
    const { result } = renderHook(() => 
      useCounterAnimation(100, 1000, true)
    );
    
    expect(result.current).toBe(0);
    
    await waitFor(() => {
      expect(result.current).toBe(100);
    }, { timeout: 1500 });
  });

  it('does not animate when trigger is false', () => {
    const { result } = renderHook(() => 
      useCounterAnimation(100, 1000, false)
    );
    
    expect(result.current).toBe(0);
  });
});
```

**Coverage Targets**:
- Component rendering: 90%+ coverage
- Utility functions: 100% coverage
- Custom hooks: 90%+ coverage
- Form validation: 100% coverage

### Integration Testing

**Framework**: Jest + React Testing Library + MSW (Mock Service Worker)

**External API Integration Tests**:
Test API interactions with MSW for realistic mocking:

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Setup MSW server
const server = setupServer(
  rest.get('https://www.googleapis.com/youtube/v3/search', (req, res, ctx) => {
    return res(
      ctx.json({
        items: [
          { id: '1', snippet: { title: 'Sermon 1', thumbnails: { default: { url: 'url1' } } } },
          { id: '2', snippet: { title: 'Sermon 2', thumbnails: { default: { url: 'url2' } } }
        ]
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('YouTube API Integration', () => {
  it('fetches sermon videos successfully', async () => {
    const videos = await fetchSermons('channel-id', 6);
    expect(videos).toHaveLength(2);
    expect(videos[0].title).toBe('Sermon 1');
  });

  it('handles API errors gracefully', async () => {
    server.use(
      rest.get('https://www.googleapis.com/youtube/v3/search', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Internal server error' }));
      })
    );
    
    const videos = await fetchSermons('channel-id', 6);
    expect(videos).toEqual([]);
  });

  it('handles rate limiting', async () => {
    server.use(
      rest.get('https://www.googleapis.com/youtube/v3/search', (req, res, ctx) => {
        return res(ctx.status(429), ctx.json({ error: 'Rate limit exceeded' }));
      })
    );
    
    const videos = await fetchSermons('channel-id', 6);
    expect(videos).toEqual([]);
  });
});
```

**Why MSW?**
- More realistic than `jest.spyOn(global, 'fetch')` mocking
- Works at the network level, not the code level
- Same mocks work for both tests and development
- Industry standard for API mocking
- Better maintainability for complex API interactions

**Installation**:
```bash
npm install --save-dev msw
```

**Payment Integration Tests**:
Test payment flows with MSW:

```typescript
describe('Paystack Integration', () => {
  beforeAll(() => {
    server.use(
      rest.post('https://api.paystack.co/transaction/initialize', (req, res, ctx) => {
        return res(
          ctx.json({
            status: true,
            data: {
              authorization_url: 'https://paystack.com/pay/xyz',
              reference: 'ref-123'
            }
          })
        );
      })
    );
  });

  it('initializes payment successfully', async () => {
    const response = await initializePayment(5000, 'user@example.com', {
      purpose: 'Tithes'
    });
    
    expect(response.success).toBe(true);
    expect(response.authorizationUrl).toBeDefined();
  });

  it('handles payment initialization errors', async () => {
    server.use(
      rest.post('https://api.paystack.co/transaction/initialize', (req, res, ctx) => {
        return res(ctx.status(401), ctx.json({ message: 'Invalid API key' }));
      })
    );
    
    const response = await initializePayment(5000, 'user@example.com', {});
    
    expect(response.success).toBe(false);
    expect(response.error).toBeDefined();
  });
});
```

**Form Submission Tests**:
Test complete form submission flows:

```typescript
describe('Contact Form Submission', () => {
  it('submits form successfully', async () => {
    render(<ContactSection {...mockProps} />);
    
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Test message' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));
    
    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
    });
  });

  it('displays validation errors', async () => {
    render(<ContactSection {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));
    
    await waitFor(() => {
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });
});
```

### Accessibility Testing

**Automated Accessibility Tests**:
Use jest-axe for automated WCAG checks:

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Navigation Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Navigation />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Form Accessibility', () => {
  it('has proper labels for all inputs', () => {
    render(<ContactForm />);
    
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  it('announces errors to screen readers', async () => {
    render(<ContactForm />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent('This field is required');
    });
  });
});
```

**Keyboard Navigation Tests**:
Test keyboard accessibility:

```typescript
describe('Keyboard Navigation', () => {
  it('allows tab navigation through all interactive elements', () => {
    render(<Navigation />);
    
    const links = screen.getAllByRole('link');
    links[0].focus();
    
    expect(document.activeElement).toBe(links[0]);
    
    userEvent.tab();
    expect(document.activeElement).toBe(links[1]);
  });

  it('closes modal with Escape key', () => {
    const onClose = jest.fn();
    render(<Modal isOpen={true} onClose={onClose} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(onClose).toHaveBeenCalled();
  });

  it('shows visible focus indicators', () => {
    render(<Button>Click Me</Button>);
    
    const button = screen.getByRole('button');
    button.focus();
    
    expect(button).toHaveFocus();
    expect(button).toHaveStyle({ outline: '2px solid #0066cc' });
  });
});
```

**Screen Reader Tests**:
Test ARIA attributes and semantic HTML:

```typescript
describe('Screen Reader Support', () => {
  it('has proper ARIA labels for icon buttons', () => {
    render(<WhatsAppFloat phoneNumber="+2349061234567" />);
    
    const button = screen.getByRole('button', { name: 'Contact us on WhatsApp' });
    expect(button).toBeInTheDocument();
  });

  it('announces loading states', () => {
    render(<Button loading>Submit</Button>);
    
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('uses semantic HTML for navigation', () => {
    render(<Navigation />);
    
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
```

**Manual Accessibility Testing**:
- **Screen Reader Testing**: Test with NVDA (Windows) or VoiceOver (macOS)
- **Keyboard-Only Navigation**: Navigate entire site without mouse
- **Zoom Testing**: Test at 200% browser zoom
- **Contrast Checking**: Verify all text meets 4.5:1 ratio
- **Color Independence**: Test in grayscale mode

**Accessibility Checklist**:
- [ ] All images have alt text
- [ ] All form inputs have labels
- [ ] All buttons have accessible names
- [ ] Focus indicators visible on all interactive elements
- [ ] Keyboard navigation works throughout site
- [ ] ARIA attributes used correctly
- [ ] Heading hierarchy is logical (h1 → h2 → h3)
- [ ] Color contrast meets WCAG AA standards
- [ ] Error messages announced to screen readers
- [ ] Modal dialogs trap focus and close with Escape

### Visual Regression Testing

**Tool**: Percy or Chromatic (optional)

**Test Scenarios**:
- Homepage at 320px, 768px, 1024px, 1920px widths
- All sections in light mode
- Interactive states (hover, focus, active)
- Loading states and skeletons
- Error states and messages
- Modal dialogs and overlays
- Form validation states

**Manual Visual Testing**:
- Test on real devices (iPhone, Android, iPad)
- Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- Verify responsive breakpoints
- Check animation smoothness
- Verify image loading and lazy loading

### Performance Testing

**Lighthouse Audits**:
Run Lighthouse in CI/CD pipeline:

```bash
# Target scores
Performance: ≥90 (desktop), ≥80 (mobile)
Accessibility: ≥90
Best Practices: ≥90
SEO: ≥90
```

**Core Web Vitals Targets**:
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

**Performance Tests**:
```typescript
describe('Performance', () => {
  it('loads hero section within 2 seconds', async () => {
    const startTime = performance.now();
    render(<HeroSection {...mockProps} />);
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(2000);
  });

  it('lazy loads below-the-fold images', () => {
    render(<GallerySection photos={mockPhotos} />);
    
    const images = screen.getAllByRole('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('loading', 'lazy');
    });
  });

  it('uses Next.js Image optimization', () => {
    render(<Image src="/test.jpg" alt="Test" width={800} height={600} />);
    
    const img = screen.getByRole('img');
    expect(img.src).toContain('/_next/image');
  });
});
```

**Bundle Size Monitoring**:
- Monitor JavaScript bundle size (target: < 200KB gzipped)
- Use Next.js bundle analyzer
- Code split heavy components (lightbox, payment modals)
- Tree shake unused dependencies

**Performance Checklist**:
- [ ] Images optimized (WebP/AVIF)
- [ ] Images have width/height attributes (prevent CLS)
- [ ] Lazy loading for below-the-fold content
- [ ] Code splitting for heavy components
- [ ] Font optimization with next/font
- [ ] Minimize JavaScript bundle size
- [ ] Aggressive caching for static assets
- [ ] No render-blocking resources

### End-to-End Testing

**Tool**: Playwright or Cypress (optional for critical flows)

**Critical User Flows**:
1. **Donation Flow**:
   - Navigate to donation section
   - Select amount and purpose
   - Fill donor information
   - Initiate payment
   - Verify redirect to payment gateway

2. **Contact Form Flow**:
   - Navigate to contact section
   - Fill contact form
   - Submit form
   - Verify success message

3. **Sermon Viewing Flow**:
   - Navigate to sermons section
   - Click sermon video
   - Verify video player opens
   - Play video

4. **Navigation Flow**:
   - Click navigation links
   - Verify smooth scroll to sections
   - Verify active section highlighting

### Cross-Browser Testing

**Target Browsers**:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

**Testing Checklist**:
- [ ] Layout renders correctly
- [ ] Animations work smoothly
- [ ] Forms submit successfully
- [ ] External content loads (YouTube, Zeno.fm)
- [ ] Payment flows work
- [ ] Navigation functions properly
- [ ] Responsive design works at all breakpoints

### Testing Workflow

**Development**:
1. Write component with example-based unit tests
2. Run tests locally: `npm test`
3. Check accessibility: `npm run test:a11y`
4. Manual browser testing

**Pre-Commit**:
1. Run all unit tests: `npm test`
2. Run linter: `npm run lint`
3. Check TypeScript: `npm run type-check`

**CI/CD Pipeline**:
1. Run all tests
2. Run Lighthouse audit
3. Check bundle size
4. Build production bundle
5. Deploy to staging
6. Run smoke tests on staging

**Pre-Deployment**:
1. Manual testing on staging
2. Cross-browser testing
3. Real device testing
4. Accessibility audit
5. Performance audit
6. User acceptance testing

### Test Data Management

**Mock Data**:
- Store mock data in `__mocks__` directory
- Use realistic data (actual church information)
- Maintain consistency across tests

**Example Mock Data**:
```typescript
// __mocks__/data.ts
export const mockSermons = [
  {
    id: '1',
    title: 'Walking in Faith',
    description: 'A message about trusting God',
    thumbnail: '/images/sermon1.jpg',
    publishedAt: '2024-01-15' // ISO string
  },
  // ... more sermons
];

export const mockEvents = [
  {
    id: '1',
    title: 'Youth Conference 2024',
    date: '2024-03-20', // ISO string
    time: '10:00 AM',
    location: 'Ipaja',
    description: 'Annual youth conference',
    category: 'Youth'
  },
  // ... more events
];
```

### Testing Documentation

**Test Documentation Requirements**:
- Document test setup in README
- Explain how to run tests locally
- Document CI/CD test pipeline
- Maintain test coverage reports
- Document manual testing procedures

**README Testing Section**:

````markdown
## Testing

### Running Tests

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run accessibility tests
npm run test:a11y

# Run Lighthouse audit
npm run lighthouse
\`\`\`

### Test Coverage

Current coverage: 85%
Target coverage: 90%

### Manual Testing

1. Cross-browser testing checklist
2. Accessibility testing with screen readers
3. Real device testing on iOS and Android
4. Performance testing with Lighthouse
````

### Continuous Improvement

**Test Maintenance**:
- Review and update tests when requirements change
- Remove obsolete tests
- Refactor tests for clarity and maintainability
- Keep test data up to date

**Coverage Monitoring**:
- Track test coverage over time
- Set coverage thresholds in CI/CD
- Identify untested code paths
- Prioritize testing critical flows

**Performance Monitoring**:
- Monitor Lighthouse scores over time
- Track Core Web Vitals in production
- Set performance budgets
- Alert on performance regressions

