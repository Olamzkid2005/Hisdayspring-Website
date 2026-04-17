# Hisdayspring Ministries International - UI Redesign Prompt for Google Stitch

## Project Overview

**Website Name:** Hisdayspring Evangelical Ministries International
**Type:** Church/Ministry Website
**Purpose:** Multi-purpose church website with information, media, donations, and community engagement
**Current Stack:** Next.js 16, React 19, Tailwind CSS v4, Framer Motion, TypeScript

---

## Brand Identity

### Organization Description
A Spirit-filled, word-grounded Pentecostal church based in Lagos, Nigeria that transforms lives, families and communities through the power of the Holy Spirit. The church has 2 branches (Ipaja and Ikeja) and various ministry programs.

### Mission
Raising holy, healthy and wealthy people with a sense of dominion and world evangelism by the power of the Holy Spirit.

### Vision
To be a Spirit-filled, word-grounded church that transforms lives, families and communities across Nigeria and beyond for the glory of God.

### Tagline
"Raising Holy, Healthy & Wealthy People"

---

## Current Design System

### Color Palette
```
Primary (Light Red/Crimson):
- Primary 50: #fef2f2
- Primary 100: #fee2e2
- Primary 200: #fecaca
- Primary 300: #fca5a5
- Primary 400: #f87171
- Primary 500: #ef4444
- Primary 600: #dc2626
- Primary 700: #b91c1c
- Primary 800: #991b1b
- Primary 900: #7f1d1d
- Primary 950: #450a0a

Accent (Gold):
- Accent 50: #fffbeb
- Accent 100: #fef3c7
- Accent 200: #fde68a
- Accent 300: #fcd34d
- Accent 400: #fbbf24
- Accent 500: #f59e0b
- Accent 600: #d97706
- Accent 700: #b45309
- Accent 800: #92400e
- Accent 900: #78350f

Backgrounds:
- White: #ffffff
- Off White: #fafaf9
- Foreground: #1a1a2e
- Muted: #64748b
- Muted Foreground: #94a3b8
```

### Typography
- **Display/Headings:** Serif font (Georgia, "Times New Roman", serif)
- **Body:** Sans-serif (system fonts: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)
- **Font Variable:** --font-inter

### Spacing Scale
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px, 3xl: 64px, 4xl: 96px

### Border Radius
- sm: 4px, md: 8px, lg: 12px, xl: 16px, 2xl: 24px, full: 9999px

### Shadows
- sm, md, lg, xl, gold (gold glow with 0.25 opacity)

### Animation
- Custom easing: ease-out-expo, ease-in-out-expo, ease-spring
- Reduced motion support via prefers-reduced-motion

---

## Website Structure & Sections

### 1. Navigation (Fixed, Sticky)
- Logo: Circle with "H" letter in gold
- Top contact bar (shows on scroll): Phone, Email, Social links
- Main nav links: Home, About, Our Pastor, Service Times, Sermons, Radio, Ministries, Events, Books, Give, Contact
- Mobile: Hamburger menu with slide-in drawer from right
- CTA: "Give Online" button
- Scroll spy active states

### 2. Hero Section
- Full viewport height
- Background: Unsplash church/worship image with purple overlay gradient
- Church name badge: "HISDAYSPRING EVANGELICAL MINISTRIES INTERNATIONAL"
- Main headline: "Raising Holy, Healthy & Wealthy People" with "Wealthy" in accent gold
- Subheadline: Church mission description
- Two CTA buttons: "Watch Live Service" (primary), "Plan Your Visit" (outline)
- Animated scroll indicator at bottom
- Gradient fade to cream at bottom

### 3. About Section
- Section badge: "About Our Church"
- H2: "Who We Are"
- Two-column layout: Mission & Vision side by side
- Mission: Eye icon, quote block with left gold border
- Vision: Globe icon, quote block with left purple border
- Statistics row: 4 animated counters (15+ Years, 2 Branches, 500+ Members, 10 Ministries) on dark purple background
- Branch info footer

### 4. Pastor Section
- Section badge: "Our Shepherd"
- H2: "Meet Our Pastor"
- Two-column: Pastor image (placeholder with gradient) on left, bio content on right
- Pastor name: Pastor Blessing Olamijulo, Senior Pastor
- Bio in prose format with paragraphs
- Education badges (CAC Theological Seminary, WOFBI, etc.)
- Ministries founded badges (YOFIC, Discovery, BOMS, etc.)
- Family info card
- Spouse section below with similar layout (Pastor Mrs Adebamigbe Olamijulo)

### 5. Service Times Section
- Section badge: "Join Us"
- H2: "Service Times"
- 3-column grid of service cards with hover lift effect
- Each card: Icon, branch badge (Ipaja/Ikeja/Both), service name, day/time
- Two location cards at bottom: Ipaja Branch and Ikeja Branch with dark backgrounds

### 6. Sermons Section
- Section badge: "Sermons"
- H2: "Watch Our Sermons"
- 3-column grid of sermon video cards
- Thumbnail with play button overlay on hover
- Duration badge
- Title, date, view count
- YouTube modal player
- "View All Sermons on YouTube" CTA

### 7. Radio Section
- Section badge: "Hisdayspring Radio"
- H2: "Listen Live 24/7"
- Dark background (primary-900)
- Zeno.fm embedded player
- Now playing status indicator
- Links to open on Zeno.fm and Facebook

### 8. Ministries Section
- Section badge: "Our Ministries"
- H2: "Get Involved"
- 3-column grid of ministry cards with image/icon
- Ministries: YOFIC, Discovery for Youth & Singles, The Jewels Women's Program, Blessing Ola Mentoring School (BOMS), Upper Room Prayer Link, Healing From Heaven Crusade
- WhatsApp CTA for contact

### 9. Events Section
- Section badge: "Upcoming Events"
- H2: "Join Us at Our Events"
- 3-column grid of event cards
- Each card: Date badge (day/month/year), category tag, title, description, time/location
- Featured event badge option
- Newsletter subscription CTA

### 10. Give Section
- Section badge: "Give"
- H2: "Partner With Us in Ministry"
- Scripture quote (Luke 6:38)
- Two-column: Bank transfer details card + Online giving info card
- Bank details: Bank name, account number (large), account name
- Scripture references grid below (4 verses)

### 11. Donation Section
- Section badge: "Give"
- H2: "Support Our Ministry"
- Full donation form with:
  - Preset amount buttons (₦1,000, ₦2,500, ₦5,000, ₦10,000)
  - Custom amount input
  - Donation purpose selector (Tithes, Offerings, Special Projects, Building Fund, Missions, Youth Ministry)
  - Donor info: Name, Email, Phone
  - Payment method: Card (Paystack) or Bank Transfer
  - Submit button
- Success state with bank transfer instructions

### 12. Books Section
- Section badge: "Resources"
- H2: "Books & Resources"
- 4-column grid of book cards
- Each card: Cover image area, price badge, format badges (Physical/E-book), title, author, description, "Buy Now" button
- "View All Resources" CTA to pastorblessing.com/shop

### 13. LiveStream Section
- Section badge: "Live Stream"
- H2: "Join Us Online"
- Dark background (primary-950)
- Live status bar (LIVE badge with viewer count or Offline)
- YouTube embed area
- Next service info: Name, date, time
- Subscribe CTA for YouTube notifications
- Facebook Live alternative link

### 14. Testimonials Section
- Section badge: "Testimonies"
- H2: "What God Has Done"
- Carousel with previous/next buttons and dot indicators
- Auto-rotate every 5 seconds
- Each testimonial: Large quote icon, testimony text, avatar initial circle, name, date
- Quote styling with decorative marks

### 15. Gallery Section
- Section badge: "Gallery"
- H2: "Our Community in Pictures"
- Category filter pills (All, Sunday Services, Youth Events, Women Program, Special Events)
- 4-column masonry-style grid of photos
- Lightbox modal on click with navigation arrows and close button
- Photo counter
- Keyboard navigation (Escape, Arrow keys)

### 16. Social Section
- H2: "Connect With Us"
- 5-column grid of social platform cards (Facebook, YouTube, Instagram, Twitter/X, Zeno.fm)
- Hover effects with platform brand colors
- Radio CTA below with "Listen to Hisdayspring Radio 24/7"
- Listen Now button

### 17. Prayer Section
- Section badge: "Prayer Request"
- H2: "We're Praying With You"
- Two-column: Info on left (Email, Phone contact cards), Form on right
- Form: Name, Email, Prayer Request textarea
- Submit button with loading state
- Confidentiality note

### 18. Contact Section
- Section badge: "Contact Us"
- H2: "Get In Touch"
- Two-column: Contact info + Google Maps embed on left, Form on right
- Contact cards: Email, Phone
- Addresses for both branches
- Office hours
- Form: Name, Email, Subject, Message textarea
- Office hours info

### 19. Footer
- Dark background (primary-950)
- 4-column grid:
  - Column 1: Church logo/name, description, social icons
  - Column 2: Quick Links navigation
  - Column 3: Service Times list
  - Column 4: Contact info (addresses, phone, email)
- Bottom bar: Copyright, Privacy Policy, Terms of Service links

### 20. Utility Components
- **WhatsApp Float:** Fixed floating button for WhatsApp contact
- **Cookie Consent:** GDPR-compliant cookie banner at bottom
- **Navigation:** Sticky header with scroll-based styling changes
- **Mobile Menu:** Full-screen overlay with slide-in drawer

---

## Key Pages

### Home Page (Single Page Application)
All sections listed above in order, with smooth scroll navigation between them.

### Privacy Page
Standalone page with privacy policy content.

### 404 Not Found
Custom error page.

---

## Technical Requirements

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
- Large Desktop: > 1280px

### Accessibility Requirements
- WCAG 2.1 AA compliance
- Focus visible outlines (2px solid)
- Keyboard navigation support
- ARIA labels
- Reduced motion support
- Screen reader friendly

### Performance Considerations
- Optimized images
- Lazy loading
- Animation performance with transform/opacity only

### Integrations
- YouTube API for sermons
- Zeno.fm for radio embedding
- Paystack for online donations
- WhatsApp API for contact
- Google Maps Embed

---

## Website Data

### Church Info
- Name: Hisdayspring Evangelical Ministries International
- Email: hello@hisdayspring.org
- Phone: +234 906 619 2155
- WhatsApp: +2349066192155
- Addresses:
  - Ipaja: Gowon Estate, Ipaja, Lagos State, Nigeria
  - Ikeja: Ikeja, Lagos State, Nigeria

### Social Links
- Facebook: facebook.com/hisdayspring
- YouTube: youtube.com/@hisdayspring
- Instagram: instagram.com/hisdayspring_family
- Radio: zeno.fm/radio/hisdayspringradio

### Service Times
- Sunday First Service: Sunday 7:00 AM – 9:00 AM (Both branches)
- Sunday Second Service: Sunday 9:30 AM – 11:30 AM (Both branches)
- Midweek Service: Wednesday 6:00 PM – 8:00 PM (Both branches)
- YOFIC Youth Service: Friday 5:00 PM – 7:00 PM (Ipaja)
- The Jewels Women's Program: Monthly (Varies)

### Key Statistics
- 15+ Years of Ministry
- 2 Church Branches
- 500+ Church Members
- 10 Ministries

---

## Design Direction Suggestions

### Aesthetic Direction
- Modern yet reverent - balances contemporary web design with the sacred nature of church content
- Warm and passionate with spiritual undertones using light red tones
- Clean layouts with generous whitespace
- Professional photography integration

### Layout Philosophy
- Single-page scrolling experience with distinct sections
- Visual hierarchy guides users from awareness to engagement
- Strategic placement of CTAs for donations and service attendance
- Mobile-first responsive approach

### Color Usage
- Light red/crimson primary for headers, backgrounds, and emphasis
- Gold accent for CTAs, highlights, and important elements
- White backgrounds for main content areas (clean, bright, reverent)
- Deep red (primary-900/950) for footer and immersive sections (radio, livestream)

### Typography Treatment
- Serif headings convey tradition, authority, and elegance
- Sans-serif body text ensures readability
- Generous line heights and spacing

### Interaction Patterns
- Subtle hover animations (lift, scale, color shifts)
- Scroll-triggered fade-in animations
- Modal overlays for video and gallery
- Form validation with inline errors

---

## Deliverables for Google Stitch

Please create a comprehensive UI design that includes:

1. **Design System/Typography Spec** - Colors, fonts, spacing, shadows, animations

2. **Home Page Design** - Complete single-page layout with all 19+ sections

3. **Mobile Variants** - Responsive designs for mobile and tablet breakpoints

4. **Component Library** - Buttons, cards, inputs, badges, navigation elements

5. **Interactive States** - Hover, active, disabled, loading states for key components

6. **Form Designs** - Donation form, contact form, prayer request form

7. **Modal/Lightbox Designs** - Video player modal, gallery lightbox

8. **Navigation Designs** - Desktop header, mobile menu drawer

9. **Footer Design** - Complete footer with all columns

10. **Asset Suggestions** - Recommended imagery, iconography style

---

## Notes

- Current design uses placeholder images (gradients with initials) where photos are pending
- Some content marked as "PLACEHOLDER" in data files needs verification from church leadership
- YouTube integration for live stream status
- Paystack integration for online donations (not yet fully implemented)
- Zeno.fm for 24/7 radio streaming
