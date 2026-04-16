# Implementation Plan: Hisdayspring Church Website

## Overview

This implementation plan breaks down the development of the Hisdayspring Ministries International website into discrete, manageable tasks. The website is a single-page application built with Next.js 14+ App Router, TypeScript, Tailwind CSS, and Framer Motion, featuring 15+ major sections with external API integrations (YouTube, Zeno.fm, Paystack/Flutterwave, Google Maps).

**Implementation Approach**: Build incrementally from foundation to features, ensuring each component is functional and tested before moving to the next. Start with project setup and core infrastructure, then implement layout components, followed by content sections, and finally integrations and polish.

**Key Technologies**:
- Next.js 14+ (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Framer Motion
- React Testing Library + Jest
- MSW (Mock Service Worker) for API testing

## Tasks

- [x] 0. Pre-Build Research and Content Scraping
  - Scrape content from all 6 source URLs listed in design document
  - Extract mission/vision statements, pastor biography, service times, ministry descriptions
  - Gather event information, testimonials, and contact details
  - Download and organize images (pastor photo, ministry images, gallery photos)
  - Document scraped content in temporary notes for use in Task 5
  - Use placeholder content only where scraping yields no data
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6_

- [ ] 1. Project Setup and Configuration
  - [ ] 1.1 Initialize Next.js 14+ project with TypeScript and App Router
    - Run: `npx create-next-app@latest hisdayspring-website --typescript --tailwind --app --eslint`
    - Select options: TypeScript (Yes), ESLint (Yes), Tailwind CSS (Yes), src/ directory (No), App Router (Yes), import alias (Yes, @/*)
    - _Requirements: 19.1, 19.2_

  - [ ] 1.2 Install all required dependencies
    - Install production dependencies:
      ```bash
      npm install framer-motion lucide-react embla-carousel-react yet-another-react-lightbox
      ```
    - Install development dependencies:
      ```bash
      npm install -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom jest-axe msw eslint-plugin-jsx-a11y @types/react @types/node
      ```
    - _Requirements: 19.2, 19.3_

  - [ ] 1.3 Configure ESLint with accessibility rules
    - Update .eslintrc.json to include eslint-plugin-jsx-a11y
    - Enable recommended accessibility rules
    - _Requirements: 18.1, 19.4_

  - [ ] 1.4 Create project directory structure
    - Create directories: app/, components/, lib/, data/, types/, hooks/, public/
    - Create subdirectories: components/layout/, components/sections/, components/ui/, components/utility/
    - Create subdirectories: lib/api/, lib/config/, lib/utils/, lib/animations/
    - _Requirements: 19.1, 19.2_

  - [ ] 1.5 Configure TypeScript with strict mode
    - Update tsconfig.json with strict: true
    - Configure path aliases for clean imports
    - _Requirements: 19.2, 32.6_

  - [ ] 1.6 Create environment variable configuration
    - Create .env.example file with all required variables:
      - NEXT_PUBLIC_YOUTUBE_API_KEY (client-side, for sermon fetching)
      - YOUTUBE_API_KEY (server-side only, for livestream status API route)
      - NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
      - NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY (optional)
      - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    - Add .env.local to .gitignore
    - _Requirements: 32.1, 32.2, 32.3, 32.4, 32.5, 32.8, 32.9_

  - [ ] 1.7 Set up Git repository
    - Initialize git repository if not already done
    - Verify .gitignore includes .env.local, node_modules/, .next/
    - Create initial commit
    - _Requirements: 19.1_

- [ ] 2. Design System Foundation
  - [ ] 2.1 Create Tailwind configuration with brand colors
    - Define primary color (deep navy/royal purple)
    - Define accent color (gold)
    - Define background colors (cream/white)
    - Configure typography (serif for headings, sans-serif for body)
    - Set up spacing scale and breakpoints
    - _Requirements: 14.1, 14.2, 14.3, 14.7_

  - [ ] 2.2 Create global styles and CSS variables
    - Set up base typography styles
    - Define focus indicator styles (2px solid outline)
    - Configure smooth scroll behavior
    - Set up animation timing functions
    - _Requirements: 14.4, 14.5, 14.6, 18.3_

  - [ ] 2.4 Create animation system foundation
    - Create lib/animations/variants.ts with reusable Framer Motion variants
    - Define fadeIn, slideUp, staggerContainer, scaleOnHover variants
    - Configure useReducedMotion hook integration
    - Export animation utilities for consistent usage across components
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [ ] 2.3 Create reusable UI components
    - Implement Button component with variants (primary, secondary, outline, ghost)
    - Implement Input component with label association and error states
    - Implement Card component with hover effects
    - Implement Modal component with focus trap and Escape key handling
    - Implement LoadingSpinner component
    - Implement Skeleton component for loading states
    - _Requirements: 18.2, 18.3, 18.6, 18.7_

- [ ] 3. TypeScript Type Definitions
  - Create types/index.ts with all data model interfaces
  - Define NavigationLink, AboutContent, Statistic interfaces
  - Define PastorInfo, ServiceTime, Ministry, Event interfaces
  - Define Book, Testimonial, GalleryPhoto interfaces
  - Define ContactInfo, Branch, SocialLink interfaces
  - Define DonationPurpose, PaymentMethod, DonationFormData interfaces
  - Define YouTubeVideo, LiveStreamStatus interfaces
  - Define form data interfaces (ContactFormData, PrayerRequestFormData, NewsletterFormData)
  - Define API response interfaces (PaymentResponse, FormSubmissionResponse)
  - _Requirements: 19.2, 19.3, 19.6_

- [ ] 4. Custom Hooks Implementation
  - [ ] 4.1 Create useScrollPosition hook
    - Implement scroll event listener with debouncing
    - Return scrollY and isScrolled (scrollY > 50) values
    - Add cleanup on unmount
    - _Requirements: 1.4, 15.2_

  - [ ] 4.2 Create useIntersectionObserver hook
    - Implement Intersection Observer API wrapper
    - Support configurable threshold and rootMargin
    - Return isIntersecting boolean
    - Add cleanup on unmount
    - _Requirements: 15.2, 15.7_

  - [ ] 4.3 Create useCounterAnimation hook
    - Implement requestAnimationFrame-based counter animation
    - Animate from 0 to target value over specified duration
    - Apply easing function for natural motion
    - Trigger animation when boolean flag becomes true
    - _Requirements: 3.4, 15.5_

  - [ ] 4.4 Create useFormValidation hook
    - Implement real-time form validation logic
    - Support custom validation rules (required, email, pattern)
    - Generate error messages for failed validations
    - Provide handleChange and handleSubmit functions
    - Return values, errors, and isValid state
    - _Requirements: 12.3, 12.4, 12.5_

- [ ] 5. Data Files and Content Structure
  - Populate data files with content from Pre-Build Research (Task 0)
  - Create data/about.ts with mission, vision, and statistics
  - Create data/pastor.ts with Pastor Blessing Olamijulo's biography
  - Create data/services.ts with service times for both branches
  - Create data/ministries.ts with ministry program information
  - Create data/events.ts with upcoming events (use ISO date strings)
  - Create data/books.ts with Pastor's books and resources
  - Create data/testimonials.ts with member testimonies
  - Create data/gallery.ts with photo gallery data
  - Create data/contact.ts with contact information and branch addresses
  - Create data/social.ts with social media links
  - Create data/navigation.ts with navigation menu items
  - Create data/donations.ts with donation purposes and payment methods
  - Create data/privacy.ts with privacy policy content
  - Use placeholder content only where scraping yielded no data
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6_

- [ ] 6. Environment Configuration and Validation
  - Create lib/config/env.ts with environment variable exports
  - Implement validateEnv() function to check required variables at build time
  - Export config object with separate YouTube API keys:
    - youtubeApiKeyPublic: NEXT_PUBLIC_YOUTUBE_API_KEY (client-side, for sermon fetching)
    - youtubeApiKeyServer: YOUTUBE_API_KEY (server-side only, for livestream API route)
  - Export Paystack, Flutterwave, Google Maps API keys
  - Add error handling for missing environment variables
  - _Requirements: 32.1, 32.2, 32.3, 32.4, 32.8, 32.9_

- [ ] 7. Layout Components
  - [ ] 7.1 Create Navigation component
    - Implement sticky navigation bar with scroll-based background transition
    - Add all navigation links (Home, About, Pastor, Services, Sermons, Radio, Ministries, Events, Books, Donate, Prayer, Contact)
    - Implement smooth scroll to section on link click
    - Add active section highlighting based on scroll position
    - Implement mobile hamburger menu for viewports < 768px
    - Use useScrollPosition and useIntersectionObserver hooks
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

  - [ ] 7.2 Create Footer component
    - Display church name and tagline
    - Display physical addresses for Ipaja and Ikeja branches
    - Display contact email and phone number
    - Add quick links to all major sections
    - Display social media icons with links
    - Add copyright information with dynamic year
    - Implement responsive stacking for mobile
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8_

  - [ ] 7.3 Create WhatsAppFloat component
    - Implement floating button fixed at bottom-right
    - Add pulse animation for attention
    - Implement click-to-chat with wa.me URL format
    - Use church WhatsApp number +234 906 619 2155
    - Add pre-filled message parameter
    - Ensure responsive sizing for mobile
    - _Requirements: 24.1, 24.2, 24.3, 24.6, 24.7, 24.8, 24.9, 24.10_

- [ ] 8. Utility Components
  - [ ] 8.1 Create CookieConsent component
    - Implement bottom-positioned consent banner
    - Add Accept and Decline buttons
    - Store consent preference in localStorage
    - Provide privacy policy link
    - Implement YouTube privacy-enhanced embed when cookies declined
    - Hide banner after user makes choice
    - _Requirements: 31.1, 31.2, 31.3, 31.4, 31.5, 31.6, 31.7, 31.8_

  - [ ] 8.2 Create ErrorBoundary component
    - Implement React error boundary with componentDidCatch
    - Display fallback UI on error
    - Log errors to console
    - Prevent full app crash
    - _Requirements: Error handling strategy_

- [ ] 9. Hero Section
  - Create HeroSection component with full viewport height
  - Display church name "Hisdayspring Ministries International"
  - Display tagline "Raising holy, healthy and wealthy people"
  - Add primary CTA button "Watch Live Service"
  - Add secondary CTA button "Plan Your Visit"
  - Implement Framer Motion animations (heading fade-in/slide-up 800ms, tagline fade-in 400ms delay)
  - Add background image with overlay
  - Implement responsive text sizing and button layouts for mobile
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9_

- [ ] 10. About Section
  - Create AboutSection component
  - Display mission statement
  - Display vision statement
  - Implement animated counter statistics (years of ministry, branches, members)
  - Use useCounterAnimation hook with 2000ms duration
  - Trigger animation when section enters viewport
  - Display information about Ipaja and Ikeja branches
  - Apply gold accent colors from design system
  - Implement responsive vertical stacking for mobile
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [ ] 11. Pastor Biography Section
  - Create PastorSection component
  - Display professional photograph of Pastor Blessing Olamijulo
  - Display name and title "Senior Pastor"
  - Display biographical information (founder, lead pastor)
  - Mention educational background (CAC Theological Seminary, Christian Theological Seminary, WOFBI, DLA, Church Growth Institute)
  - Describe ministry work (YOFIC, Discovery for Youth & Singles)
  - Mention wife Adebamigbe Olamijulo and three children
  - Include information about Blessing Ola Mentoring School (BOMS)
  - Implement fade-in animation for photo on scroll
  - Implement responsive vertical stacking for mobile
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9_

- [ ] 12. Service Times Section
  - Create ServiceTimesSection component
  - Display all regular worship service schedules
  - Show service day, time, and location for each service
  - Distinguish between service types (Sunday, Midweek, Youth, etc.)
  - Display branch-specific service times (Ipaja, Ikeja, Both)
  - Implement card-based grid layout
  - Implement responsive single-column layout for mobile
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 13. Checkpoint - Core Layout Complete
  - Ensure all tests pass for layout components
  - Verify navigation works correctly with smooth scrolling
  - Test responsive behavior at 320px, 768px, and 1024px+ widths
  - Verify accessibility (keyboard navigation, focus indicators, ARIA labels)
  - Ask the user if questions arise

- [ ] 14. YouTube API Integration
  - [ ] 14.1 Create YouTube API client (lib/api/youtube.ts)
    - Implement fetchSermons function with YouTube Data API v3
    - Use NEXT_PUBLIC_YOUTUBE_API_KEY (client-side key) for sermon fetching
    - Add error handling for API failures (network, rate limit, invalid key)
    - Implement retry logic with exponential backoff (3 attempts)
    - Return YouTubeVideo[] array
    - _Requirements: 6.1, 6.7_

  - [ ] 14.2 Create server-side API route for live stream status
    - Create app/api/livestream/route.ts
    - Implement GET handler to check YouTube live status
    - Use YOUTUBE_API_KEY (server-side only key, NOT exposed to client)
    - Add caching with 60-second revalidation
    - Return live status, video ID, title, and viewer count
    - _Requirements: 25.4, 25.8_

- [ ] 15. Sermons Section
  - Create SermonsSection component
  - Integrate YouTube API to fetch sermon videos (uses client-side NEXT_PUBLIC_YOUTUBE_API_KEY)
  - Display at least 6 recent sermon videos in grid layout
  - Implement embedded YouTube player modal on video click
  - Display sermon title, date, and speaker for each video
  - Add "View All Sermons" link to YouTube channel
  - Implement responsive single-column layout for mobile
  - Add fallback message with direct YouTube link on API failure
  - Implement lazy loading for performance
  - Apply loading states (skeleton screens) while fetching
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [ ] 16. Radio Player Section
  - Create RadioSection component
  - Integrate Zeno.fm radio player embed
  - Display station name "Hisdayspring Radio"
  - Implement playback controls (play, pause, volume)
  - Display current playing information if available
  - Add link to Zeno.fm station page
  - Implement fallback message if embed fails to load
  - Maintain responsive player sizing for mobile
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [ ] 17. Ministries Section
  - Create MinistriesSection component
  - Display information about YOFIC youth ministry
  - Display information about Discovery for Youth & Singles
  - Display information about Women's Program
  - Display information about Blessing Ola Mentoring School (BOMS)
  - Display information about Friendship Care Centres
  - Show brief description and icon/image for each ministry
  - Implement hover scale and shadow effects
  - Implement responsive single-column layout for mobile
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

- [ ] 18. Events Section
  - Create EventsSection component
  - Display upcoming events in chronological order
  - Show event name, date, time, and location
  - Display featured image for each event
  - Include Discovery for Youths and Singles events
  - Include Women's Program events
  - Include special events (weddings, conferences)
  - Display "no upcoming events" message when empty
  - Implement responsive single-column layout for mobile
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8_

- [ ] 19. Giving Information Section
  - Create GiveSection component
  - Display information about giving and tithing
  - Show bank account information (bank name, account number, account name)
  - Display alternative giving methods
  - Include scripture reference about giving
  - Use gold accent colors to highlight giving information
  - Maintain readability of account information on mobile
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

- [ ] 20. Checkpoint - Content Sections Complete
  - Ensure all tests pass for content sections
  - Verify YouTube API integration works correctly
  - Test Zeno.fm radio player functionality
  - Verify all sections are responsive at all breakpoints
  - Test animations and scroll-triggered effects
  - Ask the user if questions arise

- [ ] 21. Payment Gateway Integration
  - [ ] 21.1 Create Paystack API client (lib/api/paystack.ts)
    - Implement initializePayment function
    - Use NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
    - Handle payment initialization errors
    - Return PaymentResponse with authorization URL and reference
    - _Requirements: 21.7, 21.19_

  - [ ] 21.2 Create Flutterwave API client (lib/api/flutterwave.ts) (optional)
    - Implement initializePayment function
    - Use NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY
    - Handle payment initialization errors
    - Return PaymentResponse with authorization URL and reference
    - _Requirements: 21.8, 21.20_

- [ ] 22. Donation Section
  - Create DonationSection component
  - Display heading and introductory text about giving
  - Provide donation amount options (preset and custom input)
  - Display donation purpose options (Tithes, Offerings, Special Projects, Building Fund, Missions, Youth Ministry)
  - Implement purpose selection with highlighting
  - Provide payment method options (Bank Transfer, Card Payment, Mobile Money)
  - Display bank account details for Bank Transfer option
  - Integrate Paystack/Flutterwave for Card Payment option
  - Display mobile money payment instructions
  - Create donation form with fields (name, email, phone, amount, purpose)
  - Implement form validation (required fields, email format, phone format)
  - Display error messages for validation failures
  - Display success message with transaction reference on completion
  - Include scripture reference about giving
  - Apply gold accent colors to donation amounts and CTAs
  - Implement responsive vertical stacking for mobile
  - Ensure PCI DSS compliance through payment gateway SDKs
  - _Requirements: 21.1-21.18_

- [ ] 23. Books and Resources Section
  - Create BooksSection component
  - Display heading "Books & Resources" with introductory text
  - Display grid of 4-6 books and resources
  - Show book cover image, title, author name, description, and price (₦)
  - Indicate book format options (Physical, E-book, Both)
  - Implement hover scale and shadow effects
  - Add "Purchase" or "Buy Now" button for each book
  - Integrate Paystack/Flutterwave payment modal for online purchases
  - Add "View on [Platform]" link for external sales platforms
  - Display "Contact us to order" modal for manual ordering
  - Show availability status (In Stock, Out of Stock, Pre-order, Digital Only)
  - Implement filtering/category options if multiple resource types exist
  - Display featured or bestselling books prominently
  - Implement staggered fade-in animations for book cards
  - Use serif fonts for book titles, sans-serif for descriptions
  - Implement responsive layouts (1 column mobile, 2 columns tablet, 3-4 columns desktop)
  - Add "View All Resources" link if more books exist
  - Provide book preview or sample chapter links where available
  - Ensure all book cover images have appropriate alt text
  - _Requirements: 22.1-22.24_

- [ ] 24. Live Streaming Section
  - Create LiveStreamSection component
  - Embed YouTube Live player as primary streaming platform
  - Fetch live status from /api/livestream route (uses server-side YOUTUBE_API_KEY)
  - Provide Facebook Live as fallback option
  - Display live/offline state indicator
  - Show "No live service currently" message when offline
  - Implement countdown timer to next scheduled service
  - Calculate countdown based on ServiceTime data using getNextService utility
  - Display stream title and viewer count when live
  - Provide playback controls through embedded player
  - Display next service date and time prominently when offline
  - Maintain responsive 16:9 aspect ratio for mobile
  - Use design system styling for section container and indicators
  - Apply loading states while checking live status
  - _Requirements: 25.1-25.12_

- [ ] 25. Testimonials Section
  - Create TestimonialsSection component
  - Display heading "Testimonies" or "Member Stories"
  - Display 6-8 testimonial cards
  - Show member name, photo placeholder, and testimony text (150-200 words)
  - Implement carousel layout with navigation controls (prev, next, pagination dots)
  - Add auto-advance every 5000ms
  - Implement hover scale/shadow effects
  - Add staggered fade-in animations on scroll
  - Use appropriate quote styling from design system
  - Implement responsive single-column layout for mobile
  - Ensure photo placeholders have appropriate alt text
  - Install and configure embla-carousel-react for carousel functionality
  - _Requirements: 26.1-26.12_

- [ ] 26. Photo Gallery Section
  - Create GallerySection component
  - Display heading "Gallery" or "Our Community"
  - Display 12-16 photos in masonry/grid layout
  - Organize photos by categories (Sunday Services, Youth Events, Women's Program, Special Events)
  - Implement lightbox overlay with full-size view on photo click
  - Provide lightbox navigation controls (prev, next, close)
  - Display photo caption and event name in lightbox
  - Implement lazy loading for gallery images
  - Add hover zoom/overlay effects
  - Provide category filter buttons
  - Add staggered fade-in animations on scroll
  - Implement responsive layouts (2 columns mobile, 3-4 columns desktop masonry)
  - Ensure all images have appropriate alt text
  - Install and configure yet-another-react-lightbox for lightbox functionality
  - _Requirements: 27.1-27.14_

- [ ] 27. Social Media Integration
  - Create SocialSection component
  - Display links to Facebook page
  - Display links to YouTube channel
  - Display links to Instagram account
  - Display links to Hisdayspring Radio on Zeno.fm
  - Add social media icons with hover effects
  - Open links in new browser tab
  - Attempt to display recent Instagram posts if API available (Note: Instagram API requires Meta developer approval - expect fallback to link-only)
  - Display Instagram link only if API fails
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8_

- [ ] 28. Prayer Request and Newsletter Forms
  - Create PrayerSection component
  - Display prayer request form (name, email, prayer request message)
  - Display newsletter signup form (name, email)
  - Implement form validation (required fields, email format)
  - Display error messages for validation failures
  - Display success message on successful submission
  - Show church contact email hello@hisdayspring.org
  - Show church contact phone +234 906 619 2155
  - Implement responsive vertical stacking for mobile
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9_

- [ ] 29. Contact Section
  - Create ContactSection component
  - Display heading "Contact Us" with introductory text
  - Create contact form (name, email, subject, message)
  - Implement form validation (required fields, email format)
  - Display error messages for validation failures
  - Display success message on submission
  - Embed Google Maps iframe for Ipaja branch
  - Embed Google Maps iframe for Ikeja branch
  - Display physical addresses for both branches
  - Add click-to-call phone number +234 906 619 2155
  - Add mailto link for hello@hisdayspring.org
  - Display office hours if applicable
  - Implement responsive layouts (vertical stacking mobile, two-column desktop)
  - Ensure Google Maps embeds are responsive
  - _Requirements: 30.1-30.15_

- [ ] 30. Checkpoint - All Sections Complete
  - Ensure all tests pass for all sections
  - Verify all external integrations work (YouTube, Zeno.fm, Paystack, Google Maps)
  - Test all forms (contact, prayer, newsletter, donation)
  - Verify responsive behavior at all breakpoints
  - Test all animations and transitions
  - Ask the user if questions arise

- [ ] 31. Privacy Policy Page
  - Create app/privacy/page.tsx
  - Display privacy policy content from data/privacy.ts
  - Include Navigation and Footer components
  - Create structured content sections (introduction, data collection, usage, storage, user rights)
  - Add table of contents for easy navigation
  - Display last updated date
  - Provide contact information for privacy inquiries
  - Include GDPR compliance information
  - Disclose third-party services (YouTube, Zeno.fm, payment gateways)
  - _Requirements: 31.9, 31.10, 31.11, 31.12, 31.13_

- [ ] 32. Custom 404 Error Page
  - Create app/not-found.tsx
  - Display church name and logo
  - Show clear "Page Not Found" or "404 Error" heading
  - Display helpful messaging
  - Add prominent "Go to Homepage" button
  - Display quick links to major sections (About, Services, Contact, Sermons)
  - Use design system brand colors and typography
  - Include Navigation and Footer components
  - Implement responsive layout for mobile
  - _Requirements: 28.1-28.10_

- [ ] 33. Loading States and Transitions Audit
  - Note: Loading states should be applied to each section as it is built (Tasks 15, 16, 22, 24, etc.)
  - This task is a final audit pass to ensure completeness
  - Verify page preloader/loading spinner for initial load
  - Verify skeleton screens for external content sections (YouTube, Zeno.fm, Instagram)
  - Verify loading spinners for form submissions
  - Verify submit buttons are disabled during form submission
  - Verify smooth fade-in transitions when content loads
  - Verify design system brand colors used for loading indicators
  - Verify loading states display for minimum 300ms to prevent flickering
  - Verify transition from loading to error message on failure
  - Verify loading progress indicators for multi-step processes
  - Verify loading indicators have appropriate ARIA labels
  - _Requirements: 29.1-29.10_

- [ ] 34. SEO and Metadata Implementation
  - Use Next.js 14 App Router Metadata API (not custom SEO component)
  - Create app/layout.tsx with base metadata export
  - Generate page-specific metadata using generateMetadata() in page.tsx files
  - Implement title template: "[Page Name] | Hisdayspring Ministries International"
  - Generate page-specific meta description tags
  - Implement Open Graph meta tags for all pages
  - Implement Twitter Card meta tags for all pages
  - Optimize Open Graph images (1200x630px minimum)
  - Implement JSON-LD structured data (LocalBusiness and Church schemas)
  - Create app/sitemap.ts file for automatic sitemap.xml generation
  - Create app/robots.ts file for automatic robots.txt generation
  - Implement canonical URLs for all pages
  - Add meta viewport tags for mobile optimization
  - _Requirements: 23.1-23.11_

- [ ] 35. Performance Optimization
  - Use Next.js Image component for all images with automatic optimization
  - Use Next.js Font optimization for custom fonts
  - Implement lazy loading for images below the fold
  - Implement lazy loading for external content (YouTube, Instagram)
  - Minimize JavaScript bundle size with code splitting
  - Implement proper caching headers for static assets
  - Run Lighthouse audit (target: 90+ desktop, 80+ mobile)
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8_

- [ ] 36. Accessibility Compliance
  - Provide alt text for all images
  - Ensure all interactive elements are keyboard accessible
  - Provide visible focus indicators for all interactive elements
  - Use semantic HTML elements throughout
  - Ensure color is not the only means of conveying information
  - Provide ARIA labels for icon-only buttons
  - Ensure form inputs have associated labels
  - Maintain logical heading hierarchy (h1, h2, h3)
  - Run accessibility audit (target: WCAG 2.1 Level AA)
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7, 18.8, 18.9_

- [ ] 37. Testing Implementation
  - [ ] 37.1 Set up testing infrastructure
    - Install Jest and React Testing Library
    - Install jest-axe for accessibility testing
    - Install MSW (Mock Service Worker) for API mocking
    - Configure test environment
    - _Requirements: Testing strategy_

  - [ ] 37.2 Write unit tests for UI components
    - Test Button component (rendering, onClick, loading, disabled states)
    - Test Input component (label association, error display, validation)
    - Test Modal component (open/close, Escape key, focus trap)
    - Test Card component (rendering, hover effects)
    - Test LoadingSpinner and Skeleton components
    - _Requirements: Testing strategy_

  - [ ] 37.3 Write unit tests for custom hooks
    - Test useScrollPosition hook
    - Test useIntersectionObserver hook
    - Test useCounterAnimation hook
    - Test useFormValidation hook
    - _Requirements: Testing strategy_

  - [ ] 37.4 Write integration tests for API clients
    - Test YouTube API client with MSW mocking
    - Test Paystack API client with MSW mocking
    - Test error handling and retry logic
    - _Requirements: Testing strategy_

  - [ ] 37.5 Write accessibility tests
    - Test keyboard navigation for all interactive elements
    - Test ARIA labels and semantic HTML
    - Test focus indicators
    - Run jest-axe on all components
    - _Requirements: 18.1-18.9_

  - [ ] 37.6 Write form submission tests
    - Test contact form validation and submission
    - Test prayer request form validation and submission
    - Test newsletter form validation and submission
    - Test donation form validation and submission
    - _Requirements: 12.3-12.6, 21.10-21.12, 30.3-30.6_

- [ ] 38. Final Checkpoint - Pre-Export Validation
  - Run all tests and ensure 100% pass rate (or all required tests pass)
  - Run Lighthouse audit and verify scores (90+ desktop, 80+ mobile)
  - Run accessibility audit and verify WCAG 2.1 Level AA compliance
  - Test on multiple browsers (Chrome, Firefox, Safari, Edge)
  - Test on real devices (iOS, Android)
  - Verify all environment variables are documented in .env.example
  - Verify all external integrations work correctly
  - Test all forms and payment flows
  - Verify responsive behavior at all breakpoints (320px, 768px, 1024px, 1920px)
  - Ask the user if questions arise before final export

- [ ] 39. Documentation
  - Create comprehensive README.md with project overview
  - Document project setup instructions
  - Document how to update content data files
  - List all required environment variables with instructions for obtaining API keys
  - Provide instructions for obtaining API keys (YouTube, Paystack, Google Maps)
  - Document export process for static files
  - Add code comments in content files explaining how to update
  - _Requirements: 20.7, 20.8, 20.9, 20.10, 20.11, 32.11, 32.12_

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- The implementation follows a bottom-up approach: foundation → layout → content → integrations → polish
- All code should use TypeScript with strict mode enabled
- All components should be accessible (WCAG 2.1 Level AA)
- All sections should be responsive (320px to 1920px)
- External API integrations should have proper error handling and fallbacks
