# Google Stitch Prompt: Hisdayspring Ministries International - Complete UI Redesign

## Project Overview

**Organization**: Hisdayspring Evangelical Ministries International  
**Tagline**: "Raising holy, healthy and wealthy people"  
**Website**: https://hisdayspring.org  
**Contact**: hello@hisdayspring.org, +234 906 619 2155  
**Branches**: Ipaja, Lagos State + Ikeja, Lagos State

**Mission Statement**: "At HISDAYSPRING, we are committed to raising holy, healthy and wealthy people with a sense of dominion and world evangelism by the power of the Holy Spirit."

**Vision Statement**: "To be a Spirit-filled, word-grounded church that transforms lives, families and communities across Nigeria and beyond for the glory of God."

---

## Current Tech Stack

- **Framework**: Next.js 16.2.4 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion 12.38.0
- **Icons**: Lucide React 1.8.0
- **Testing**: Jest, React Testing Library

---

## Design System Requirements

### Color Palette

**Primary Colors (Deep Navy/Royal Purple - Represents royalty and spirituality)**:
- Primary-50: #f5f3ff
- Primary-100: #ede9fe
- Primary-200: #ddd6fe
- Primary-300: #c4b5fd
- Primary-400: #a78bfa
- Primary-500: #8b5cf6
- Primary-600: #7c3aed
- Primary-700: #6d28d9
- Primary-800: #5b21b6
- Primary-900: #4c1d95
- Primary-950: #2e1065

**Accent Colors (Gold - Represents divinity and excellence)**:
- Accent-50: #fffbeb
- Accent-100: #fef3c7
- Accent-200: #fde68a
- Accent-300: #fcd34d
- Accent-400: #fbbf24
- Accent-500: #f59e0b
- Accent-600: #d97706
- Accent-700: #b45309
- Accent-800: #92400e
- Accent-900: #78350f

**Neutral Colors (Cream/White backgrounds)**:
- Cream: #fdfcf7
- Cream-Dark: #f5f3eb
- White: #ffffff
- Off-White: #fafaf9

**Semantic Colors**:
- Background: #fdfcf7 (cream)
- Foreground: #1a1a2e
- Muted: #64748b
- Muted-Foreground: #94a3b8

### Typography

**Headings**: Serif font (Georgia, "Times New Roman", serif) - for elegance  
**Body**: Sans-serif font (system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)  
**Line Height**: 1.6 for body, 1.2 for headings

### Spacing Scale

- XS: 0.25rem (4px)
- SM: 0.5rem (8px)
- MD: 1rem (16px)
- LG: 1.5rem (24px)
- XL: 2rem (32px)
- 2XL: 3rem (48px)
- 3XL: 4rem (64px)
- 4XL: 6rem (96px)

### Border Radius

- SM: 0.25rem
- MD: 0.5rem
- LG: 0.75rem
- XL: 1rem
- 2XL: 1.5rem
- Full: 9999px

### Shadows

- SM: 0 1px 2px 0 rgb(0 0 0 / 0.05)
- MD: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
- LG: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
- XL: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
- Gold: 0 4px 14px 0 rgb(245 158 11 / 0.25)

### Animation Timing Functions

- Ease-Out-Expo: cubic-bezier(0.16, 1, 0.3, 1)
- Ease-In-Out-Expo: cubic-bezier(0.87, 0, 0.13, 1)
- Ease-Spring: cubic-bezier(0.34, 1.56, 0.64, 1)

### Focus Indicators (Accessibility)

- Focus Ring: 2px solid #8b5cf6 (primary-500)
- Focus Ring Offset: 2px

---

## Page Structure (18 Sections in Order)

1. **Hero Section** - Full-screen hero with background image, church name, tagline, CTA buttons (Watch Live Service, Plan Your Visit)
2. **About Section** - Mission statement, vision statement, statistics (15+ Years, 2 Branches, 500+ Members, 10 Ministries), branch info
3. **Pastor Section** - Pastor Blessing Olamijulo biography, photo, education, ministries, spouse info (Pastor Mrs. Adebamigbe Olamijulo)
4. **Service Times Section** - Sunday services (First 7-9 AM, Second 9:30-11:30 AM), Midweek (Wednesday 6-8 PM), Youth Service (Friday 5-7 PM)
5. **Sermons Section** - YouTube video integration, sermon cards with thumbnails, titles, dates
6. **Radio Section** - Zeno.fm radio embed (https://zeno.fm/radio/hisdayspringradio/)
7. **Ministries Section** - 8 ministries: YOFIC, Discovery for Youth & Singles, The Jewels, BOMS, Friendship Care Centres, Upper Room Prayer Link, Healing From Heaven Crusade, Church Welfare Programs
8. **Events Section** - Event cards with date, time, location, description, categories (youth, women, general, special)
9. **Give Section** - Donation purposes (tithes, offerings, special projects, building fund, missions, youth ministry)
10. **Donation Section** - Bank transfer details, Paystack integration, Flutterwave integration
11. **Books Section** - 12 books by Pastor Blessing Olamijulo with prices, links to pastorblessing.com/shop
12. **Live Stream Section** - YouTube live stream status, embedded player, live indicator
13. **Testimonials Section** - 6-8 testimonial cards with name, photo, testimony, date
14. **Gallery Section** - Photo gallery with categories (Sunday Services, Youth Events, Women's Program, Special Events)
15. **Social Section** - Social media links (Facebook, YouTube, Instagram, Twitter, Zeno.fm)
16. **Prayer Section** - Prayer request form (name, email, prayer request)
17. **Contact Section** - Contact form (name, email, subject, message), Google Maps embed, branch addresses, contact info
18. **Footer** - Quick links, service links, social links, copyright, contact info

---

## Component Requirements

### Reusable UI Components

**Button Component**:
- Variants: primary, secondary, outline, ghost
- Sizes: sm, md, lg
- Loading state with spinner
- Focus indicators (2px ring)
- Hover effects with shadows

**Card Component**:
- Consistent padding and spacing
- Border radius (XL: 1rem)
- Shadow effects (MD, LG)
- Hover states

**Input Component**:
- Consistent styling
- Focus indicators
- Error states
- Label support

**Modal Component**:
- Backdrop blur
- Smooth animations
- Close button
- Focus management

**LoadingSpinner Component**:
- Accessible loading indicators
- Consistent sizing

**Skeleton Component**:
- Placeholder loading states
- Pulse animation

### Layout Components

**Navigation**:
- Fixed header with scroll-based styling
- Contact bar (phone, email, social links) - shows when scrolled
- Logo with "H" icon and church name
- Desktop navigation (8 links max)
- Mobile hamburger menu with slide-in drawer
- Active section highlighting
- "Give Online" CTA button
- Scroll spy functionality

**Footer**:
- Multi-column layout
- Quick links
- Service links
- Social links
- Contact information
- Copyright notice

**WhatsAppFloat**:
- Floating WhatsApp button
- Fixed position (bottom-right)
- Pulse animation
- Link to WhatsApp number

---

## Section-Specific Design Requirements

### Hero Section
- Full-screen (min-h-screen)
- Background image with gradient overlay (primary-950 with 70-80% opacity)
- Church name badge with "H" icon
- Serif heading (text-4xl to text-7xl)
- Gold accent on "Wealthy People"
- Two CTA buttons (primary gold, outline white)
- Scroll indicator animation
- Bottom gradient fade to cream

### About Section
- Two-column layout (text + statistics)
- Mission and vision statements
- Animated statistics counter
- Branch information
- Background: cream or off-white

### Pastor Section
- Two-column layout (photo + biography)
- Circular or rounded square photo
- Education list with icons
- Ministries list
- Spouse information with photo
- Background: primary-50 or cream

### Service Times Section
- Card-based layout for each service
- Time, day, branch information
- Icons for service types
- Interactive hover states
- Background: cream or white

### Sermons Section
- Grid layout for sermon cards
- YouTube thumbnails
- Video duration badges
- Title and date
- Hover effects with play icon overlay
- Background: off-white

### Radio Section
- Zeno.fm iframe embed (100% width, 250px height)
- Station information
- Social media links
- Background: primary-900 with white text

### Ministries Section
- Grid layout (2-4 columns)
- Ministry cards with icons/images
- Name and description
- Hover lift effect
- Background: cream

### Events Section
- Card-based layout
- Date badge
- Time and location
- Category tags
- Featured events highlight
- Background: off-white

### Give Section
- Purpose selection cards
- Icons for each purpose
- Descriptions
- CTA to donation section
- Background: primary-50

### Donation Section
- Two tabs: Bank Transfer, Online Payment
- Bank account details with copy functionality
- Paystack integration
- Flutterwave integration
- Amount input
- Purpose dropdown
- Payment form
- Background: cream

### Books Section
- Grid layout (3-4 columns)
- Book cards with cover images
- Title, author, price
- "Purchase" button linking to pastorblessing.com
- Sale badges for discounted items
- Background: off-white

### Live Stream Section
- YouTube embed player
- Live indicator (red dot + "LIVE NOW")
- Stream title
- Viewer count
- Background: primary-900

### Testimonials Section
- Grid or carousel layout
- Quote icon
- Name and photo
- Testimonial text
- Date
- Background: cream

### Gallery Section
- Masonry or grid layout
- Category filters
- Photo cards with hover zoom
- Captions
- Background: off-white

### Social Section
- Social media icons with links
- Hover effects
- Platform-specific colors or brand colors
- Background: primary-50

### Prayer Section
- Form with name, email, prayer request
- Textarea for prayer request
- Submit button
- Success message
- Background: cream

### Contact Section
- Two-column layout (form + map)
- Contact form (name, email, subject, message)
- Google Maps embed
- Branch addresses
- Contact information
- Background: off-white

### Footer
- Multi-column layout (3-4 columns)
- Quick links
- Service links
- Social links
- Contact info
- Copyright
- Background: primary-900 with white text

---

## External Integrations

### YouTube API
- Channel handle: @hisdayspring
- Fetch sermon videos
- Live stream status
- Video thumbnails
- Embed players

### Zeno.fm Radio
- Station ID: hisdayspringradio
- Embed URL: https://zeno.fm/player/hisdayspringradio
- Iframe dimensions: 100% width, 250px height

### Paystack
- Public key for donations
- Payment processing
- Transaction verification

### Flutterwave (Optional)
- Public key for donations
- Alternative payment method

### Google Maps
- API key for contact section
- Embed branch locations
- Interactive maps

---

## Content Structure

All content is stored in `/data` directory for easy updates:

- `about.ts` - Mission, vision, statistics, branch info
- `pastor.ts` - Pastor biography, education, ministries, spouse info
- `services.ts` - Service times for both branches
- `ministries.ts` - 8 ministries with descriptions
- `events.ts` - Upcoming events with dates and locations
- `books.ts` - 12 books with prices and purchase links
- `donations.ts` - Bank details and payment options
- `contact.ts` - Contact information and branch addresses
- `social.ts` - Social media links
- `navigation.ts` - Navigation menu structure
- `testimonials.ts` - Member testimonies
- `gallery.ts` - Photo gallery with categories
- `privacy.ts` - Privacy policy content

---

## Accessibility Requirements (WCAG 2.1 Level AA)

- Semantic HTML elements
- ARIA labels for interactive elements
- Focus indicators (2px solid outline)
- Keyboard navigation support
- Screen reader friendly
- Color contrast ratios (4.5:1 for text, 3:1 for large text)
- Alt text for images
- Reduced motion support (prefers-reduced-motion)
- Skip to content link
- Form labels and error messages
- Heading hierarchy (h1-h6)

---

## Responsive Design Requirements

**Mobile-First Approach**

- **Mobile (320px-640px)**: Single column, stacked layouts, hamburger menu, simplified navigation
- **Tablet (641px-1024px)**: 2-column layouts, horizontal scrolling for galleries, compact navigation
- **Desktop (1025px-1920px)**: Multi-column layouts, full navigation, hover interactions
- **Large Desktop (1920px+)**: Max-width containers (max-w-7xl), optimized spacing

**Breakpoints**:
- SM: 640px
- MD: 768px
- LG: 1024px
- XL: 1280px
- 2XL: 1536px

---

## Animation Requirements

### Framer Motion Usage

- Smooth page transitions
- Scroll-triggered animations (useIntersectionObserver)
- Hover effects on cards and buttons
- Mobile menu slide-in animation
- Counter animations for statistics
- Scroll indicator animation
- WhatsApp pulse animation
- Fade-in animations on scroll

### Animation Patterns

- Hero: Fade up with staggered delays
- Sections: Fade in on scroll
- Cards: Hover lift with shadow
- Buttons: Scale on hover
- Navigation: Smooth background transition
- Modals: Fade in with scale

---

## Performance Requirements

- Optimized images (WebP format, lazy loading)
- Code splitting (automatic with Next.js)
- Minimal JavaScript bundle
- CSS-in-JS (Tailwind CSS v4)
- Font optimization
- Critical CSS inline
- Preload key resources

---

## SEO Requirements

- JSON-LD structured data
- Sitemap.xml
- robots.txt
- Open Graph meta tags
- Twitter Card meta tags
- Semantic HTML
- Alt text for images
- Descriptive page titles
- Meta descriptions

---

## Form Requirements

### Contact Form
- Name (text input)
- Email (email input)
- Subject (text input or dropdown)
- Message (textarea)
- Validation (required fields, email format)
- Success/error feedback
- Accessibility (labels, ARIA)

### Prayer Request Form
- Name (text input)
- Email (email input)
- Prayer Request (textarea)
- Validation
- Success message

### Donation Form
- Amount (number input)
- Purpose (dropdown: tithes, offerings, special projects, building fund, missions, youth ministry)
- Payment Method (radio: bank transfer, card payment, mobile money)
- Name (text input)
- Email (email input)
- Phone (phone input)
- Validation
- Payment integration

---

## Icon Requirements

Use Lucide React icons throughout:

- Navigation: Menu, X, Phone, Mail
- Hero: Play, MapPin
- Sections: Users, Compass, Heart, GraduationCap, HandHeart, Cross, Gift
- UI: Loader2, CheckCircle, AlertCircle, ArrowRight, Calendar, Clock, MapPin, ExternalLink
- Social: Facebook, Youtube, Instagram, Twitter

---

## Image Requirements

- Pastor photos: Professional portraits
- Ministry images: Relevant ministry activities
- Event images: Event photos or relevant graphics
- Book covers: Actual book covers
- Gallery: Church events and activities
- Hero: High-quality church or worship background
- All images: Optimized (WebP), responsive sizes, alt text

---

## Testing Requirements

- Jest unit tests for components
- React Testing Library for component testing
- Accessibility testing (jest-axe)
- Integration tests for forms
- E2E tests for critical user flows

---

## Deployment Requirements

- Vercel (recommended)
- Environment variables:
  - NEXT_PUBLIC_YOUTUBE_API_KEY
  - YOUTUBE_API_KEY (server-side)
  - YOUTUBE_CHANNEL_ID
  - NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
  - NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY (optional)
  - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  - NEXT_PUBLIC_WHATSAPP_NUMBER

---

## Design Goals for Redesign

1. **Modern & Premium**: Elevate the visual quality to match the church's stature
2. **User-Friendly**: Intuitive navigation and clear calls-to-action
3. **Accessible**: WCAG 2.1 AA compliance for all users
4. **Performant**: Fast loading and smooth interactions
5. **Responsive**: Perfect experience on all devices
6. **Consistent**: Unified design system across all sections
7. **Engaging**: Subtle animations and interactive elements
8. **Professional**: High-quality typography and spacing
9. **Conversion-Optimized**: Clear paths to giving, watching, and connecting
10. **Maintainable**: Clean code with easy content updates

---

## Current Implementation Notes

- Single-page application with smooth scroll navigation
- All sections on one page (page.tsx)
- Data-driven content in `/data` directory
- TypeScript strict mode
- Tailwind CSS v4 with custom theme
- Framer Motion for animations
- Lucide React for icons
- Custom hooks: useScrollPosition, useIntersectionObserver, useCounterAnimation, useFormValidation
- API clients in `/lib/api` for YouTube, Paystack, Flutterwave
- Animation variants in `/lib/animations`

---

## Redesign Deliverables

1. **Complete UI redesign** for all 18 sections
2. **Enhanced visual hierarchy** with better spacing and typography
3. **Improved color usage** with the existing palette
4. **Modern card designs** with consistent patterns
5. **Better button styles** with clear hierarchy
6. **Enhanced navigation** with improved UX
7. **Responsive improvements** for all breakpoints
8. **Accessibility enhancements** where needed
9. **Animation refinements** for smoother experience
10. **Component library** with reusable patterns

---

## File Structure to Maintain

```
app/
├── api/
├── globals.css (design system)
├── layout.tsx
├── page.tsx (18 sections)
components/
├── layout/ (Navigation, Footer, WhatsAppFloat)
├── sections/ (18 section components)
├── ui/ (Button, Card, Input, Modal, LoadingSpinner, Skeleton)
├── utility/ (CookieConsent, ErrorBoundary)
data/ (all content files)
hooks/ (custom React hooks)
lib/
├── api/ (external API clients)
├── animations/ (Framer Motion variants)
├── config/ (environment configuration)
types/ (TypeScript definitions)
```

---

## Additional Notes

- The website is for a Nigerian Pentecostal church
- Target audience includes members, visitors, and those seeking spiritual growth
- Content includes real data from pastor's website (pastorblessing.com) where available
- Some content is placeholder and clearly marked (service times, branch addresses, bank details, events, testimonials, gallery photos)
- The design should be welcoming, professional, and spiritually uplifting
- Gold accent color represents divinity and excellence
- Light red primary color represents royalty and spirituality
- White background provides warmth and readability
