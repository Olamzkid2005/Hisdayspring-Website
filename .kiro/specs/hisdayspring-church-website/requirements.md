# Requirements Document: Hisdayspring Church Website

## Introduction

This document specifies requirements for a complete, professional church website for Hisdayspring Ministries International. The website serves as the primary digital presence for the church, providing information about services, ministries, events, sermons, and enabling online engagement through giving, prayer requests, and newsletter signups. The site is a static/presentational application built with Next.js 14+ App Router, TypeScript, Tailwind CSS, and Framer Motion, featuring an editorial magazine aesthetic with luxury ministry design elements.

**Project Structure:**
The application follows a standard Next.js 14+ App Router structure with the following key directories:
- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable React components organized by feature
- `lib/` - Utility functions, helpers, and shared logic
- `data/` - Content data files (JSON/TypeScript constants) for easy content management
- `types/` - Shared TypeScript interfaces and type definitions
- `hooks/` - Custom React hooks (e.g., useScrollPosition, useCounterAnimation)
- `public/` - Static assets (images, fonts, icons)

## Glossary

- **Website**: The Hisdayspring Ministries International church website application
- **Navigation_System**: The sticky navigation bar component that provides site-wide navigation
- **Hero_Component**: The full-viewport landing section with animated content
- **About_Section**: The section displaying church mission, vision, and statistics
- **Pastor_Section**: The section featuring Pastor Blessing Olamijulo's biography and photo
- **Service_Times_Section**: The section displaying worship service schedules
- **Sermons_Section**: The section integrating YouTube sermon videos
- **Radio_Section**: The section integrating Zeno.fm radio player
- **Ministries_Section**: The section showcasing church ministry programs
- **Events_Section**: The section displaying upcoming church events
- **Give_Section**: The section providing donation information and methods
- **Social_Section**: The section displaying social media links and feeds
- **Prayer_Section**: The section with prayer request form and newsletter signup
- **Donation_Section**: The section providing online donation functionality with multiple payment methods and giving purposes
- **Books_Section**: The section showcasing Pastor Blessing Olamijulo's books and ministry resources for purchase
- **Contact_Section**: The section with contact form, location maps, and church contact information
- **Live_Stream_Section**: The section displaying live worship service streams with YouTube/Facebook Live integration
- **Testimonials_Section**: The section showcasing member testimonies and stories
- **Gallery_Section**: The section displaying photo gallery of church events and services
- **WhatsApp_Integration**: The floating WhatsApp button and community links for direct messaging
- **SEO_System**: The search engine optimization implementation including metadata, Open Graph tags, and structured data
- **Error_Page**: The custom 404 not found page with branded design
- **Loading_System**: The loading states, preloaders, and skeleton screens for asynchronous content
- **Privacy_System**: The cookie consent banner and privacy policy implementation
- **Environment_Config**: The environment variables configuration for API keys and sensitive data
- **Footer_Component**: The site-wide footer with contact information and links
- **Animation_System**: The Framer Motion scroll-based animation implementation
- **Design_System**: The brand palette, typography, and visual styling framework
- **Responsive_Layout**: The adaptive layout system supporting 320px to 1920px viewports
- **User**: A visitor browsing the church website
- **Form_Submission**: Data submitted through prayer request or newsletter forms
- **External_Content**: Content loaded from YouTube, Zeno.fm, Facebook, or Instagram APIs

## Requirements

### Requirement 1: Navigation System

**User Story:** As a User, I want to navigate between different sections of the website, so that I can quickly access the information I need.

#### Acceptance Criteria

1. THE Navigation_System SHALL display all primary navigation links (Home, About, Pastor, Services, Sermons, Radio, Ministries, Events, Books, Donate, Prayer, Contact)
2. THE Navigation_System SHALL remain fixed at the top of the viewport during scrolling
3. WHEN the page scroll position is at the top, THE Navigation_System SHALL display with a transparent background
4. WHEN the page scroll position exceeds 50 pixels, THE Navigation_System SHALL transition to a solid background with smooth animation
5. WHEN a User clicks a navigation link, THE Website SHALL scroll smoothly to the corresponding section
6. WHERE the viewport width is less than 768 pixels, THE Navigation_System SHALL display a mobile hamburger menu
7. WHEN a User clicks the mobile menu icon, THE Navigation_System SHALL expand to show all navigation links
8. THE Navigation_System SHALL highlight the active section based on scroll position

### Requirement 2: Hero Section Display

**User Story:** As a User, I want to see an impactful hero section when I land on the website, so that I immediately understand the church's mission and feel welcomed.

#### Acceptance Criteria

1. THE Hero_Component SHALL occupy the full viewport height on initial page load
2. THE Hero_Component SHALL display the church name "Hisdayspring Ministries International"
3. THE Hero_Component SHALL display the church tagline "Raising holy, healthy and wealthy people"
4. WHEN the Hero_Component loads, THE Animation_System SHALL animate the heading text with a fade-in and slide-up effect over 800 milliseconds
5. WHEN the Hero_Component loads, THE Animation_System SHALL animate the tagline text with a fade-in effect delayed by 400 milliseconds
6. THE Hero_Component SHALL display a primary call-to-action button for "Watch Live Service"
7. THE Hero_Component SHALL display a secondary call-to-action button for "Plan Your Visit"
8. THE Hero_Component SHALL include a background image or video that represents the church community
9. WHERE the viewport width is less than 768 pixels, THE Hero_Component SHALL adjust text sizes and button layouts for mobile readability

### Requirement 3: About Section Content

**User Story:** As a User, I want to learn about the church's mission and impact, so that I can understand what the church stands for and its community reach.

#### Acceptance Criteria

1. THE About_Section SHALL display the church mission statement
2. THE About_Section SHALL display the church vision statement
3. THE About_Section SHALL display animated counter statistics for years of ministry, branches, and members
4. WHEN the About_Section enters the viewport, THE Animation_System SHALL animate each counter from zero to its target value over 2000 milliseconds
5. THE About_Section SHALL display information about church branches in Ipaja and Ikeja, Lagos State
6. THE About_Section SHALL include visual elements with gold accent colors from the Design_System
7. WHERE the viewport width is less than 768 pixels, THE About_Section SHALL stack content vertically for mobile readability

### Requirement 4: Pastor Biography Section

**User Story:** As a User, I want to learn about Pastor Blessing Olamijulo, so that I can understand the church's leadership and spiritual guidance.

#### Acceptance Criteria

1. THE Pastor_Section SHALL display a professional photograph of Pastor Blessing Olamijulo
2. THE Pastor_Section SHALL display Pastor Blessing Olamijulo's full name and title as "Senior Pastor"
3. THE Pastor_Section SHALL display biographical information including his role as founder and lead pastor
4. THE Pastor_Section SHALL mention his educational background from CAC Theological Seminary, Christian Theological Seminary, WOFBI, DLA, and Church Growth Institute
5. THE Pastor_Section SHALL describe his ministry work including YOFIC youth ministry and Discovery for Youth & Singles outreach program
6. THE Pastor_Section SHALL mention his wife Adebamigbe Olamijulo and their three children
7. THE Pastor_Section SHALL include information about Blessing Ola Mentoring School (BOMS)
8. WHEN the Pastor_Section enters the viewport, THE Animation_System SHALL animate the photo with a fade-in effect
9. WHERE the viewport width is less than 768 pixels, THE Pastor_Section SHALL stack the photo and text vertically

### Requirement 5: Service Times Display

**User Story:** As a User, I want to see when church services are held, so that I can plan to attend worship services.

#### Acceptance Criteria

1. THE Service_Times_Section SHALL display all regular worship service schedules
2. THE Service_Times_Section SHALL display service day, time, and location for each service
3. THE Service_Times_Section SHALL distinguish between different service types (Sunday Service, Midweek Service, Youth Service, etc.)
4. THE Service_Times_Section SHALL display branch-specific service times for Ipaja and Ikeja locations
5. WHERE the viewport width is less than 768 pixels, THE Service_Times_Section SHALL display service cards in a single column layout

### Requirement 6: Sermons Integration

**User Story:** As a User, I want to watch and listen to sermons, so that I can receive spiritual teaching and catch up on messages I missed.

#### Acceptance Criteria

1. THE Sermons_Section SHALL integrate with the YouTube API to display sermon videos from the Hisdayspring YouTube channel
2. THE Sermons_Section SHALL display at least 6 recent sermon videos in a grid layout
3. WHEN a User clicks a sermon video thumbnail, THE Sermons_Section SHALL play the video in an embedded YouTube player
4. THE Sermons_Section SHALL display sermon title, date, and speaker for each video
5. THE Sermons_Section SHALL include a "View All Sermons" link that directs to the YouTube channel
6. WHERE the viewport width is less than 768 pixels, THE Sermons_Section SHALL display sermon videos in a single column layout
7. IF the YouTube API fails to load, THEN THE Sermons_Section SHALL display a fallback message with a direct link to the YouTube channel
8. THE Environment_Config SHALL store the YouTube Data API v3 key as NEXT_PUBLIC_YOUTUBE_API_KEY in the .env.local file

### Requirement 7: Radio Player Integration

**User Story:** As a User, I want to listen to Hisdayspring Radio, so that I can enjoy Christian music and teaching throughout the day.

#### Acceptance Criteria

1. THE Radio_Section SHALL integrate the Zeno.fm radio player for Hisdayspring Radio
2. THE Radio_Section SHALL display the radio station name "Hisdayspring Radio"
3. WHEN a User clicks the play button, THE Radio_Section SHALL begin streaming audio from the Zeno.fm station
4. THE Radio_Section SHALL display playback controls (play, pause, volume)
5. THE Radio_Section SHALL display current playing information if available from Zeno.fm API
6. THE Radio_Section SHALL include a link to the Zeno.fm station page
7. WHERE the viewport width is less than 768 pixels, THE Radio_Section SHALL maintain full player functionality with adjusted sizing

### Requirement 8: Ministries Showcase

**User Story:** As a User, I want to learn about different church ministries, so that I can find opportunities to serve and connect with others.

#### Acceptance Criteria

1. THE Ministries_Section SHALL display information about YOFIC youth ministry
2. THE Ministries_Section SHALL display information about Discovery for Youth & Singles program
3. THE Ministries_Section SHALL display information about Women's Program
4. THE Ministries_Section SHALL display information about Blessing Ola Mentoring School (BOMS)
5. THE Ministries_Section SHALL display information about Friendship Care Centres
6. THE Ministries_Section SHALL display a brief description and icon or image for each ministry
7. WHEN a User hovers over a ministry card, THE Animation_System SHALL apply a subtle scale and shadow effect
8. WHERE the viewport width is less than 768 pixels, THE Ministries_Section SHALL display ministry cards in a single column layout

### Requirement 9: Events Display

**User Story:** As a User, I want to see upcoming church events, so that I can participate in special programs and activities.

#### Acceptance Criteria

1. THE Events_Section SHALL display upcoming church events in chronological order
2. THE Events_Section SHALL display event name, date, time, and location for each event
3. THE Events_Section SHALL display a featured image for each event
4. THE Events_Section SHALL include information about Discovery for Youths and Singles events
5. THE Events_Section SHALL include information about Women's Program events
6. THE Events_Section SHALL include information about special events such as weddings
7. IF no upcoming events exist, THEN THE Events_Section SHALL display the message "There are no upcoming events at this time"
8. WHERE the viewport width is less than 768 pixels, THE Events_Section SHALL display event cards in a single column layout

### Requirement 10: Giving Information

**User Story:** As a User, I want to know how to give financially to the church, so that I can support the ministry and its mission.

#### Acceptance Criteria

1. THE Give_Section SHALL display information about the importance of giving and tithing
2. THE Give_Section SHALL display bank account information for direct transfers
3. THE Give_Section SHALL display the church's bank name, account number, and account name
4. THE Give_Section SHALL display alternative giving methods if available
5. THE Give_Section SHALL include a scripture reference about giving
6. THE Give_Section SHALL use the Design_System's gold accent colors to highlight giving information
7. WHERE the viewport width is less than 768 pixels, THE Give_Section SHALL maintain readability of account information

### Requirement 11: Social Media Integration

**User Story:** As a User, I want to connect with the church on social media, so that I can stay updated and engage with the community online.

#### Acceptance Criteria

1. THE Social_Section SHALL display links to the church's Facebook page
2. THE Social_Section SHALL display links to the church's YouTube channel
3. THE Social_Section SHALL display links to the church's Instagram account
4. THE Social_Section SHALL display links to Hisdayspring Radio on Zeno.fm
5. THE Social_Section SHALL display social media icons with hover effects from the Animation_System
6. WHEN a User clicks a social media icon, THE Website SHALL open the corresponding social media page in a new browser tab
7. THE Social_Section SHALL attempt to display recent Instagram posts if API access is available
8. IF Instagram API access fails, THEN THE Social_Section SHALL display only the Instagram link without feed

### Requirement 12: Prayer Request and Newsletter Forms

**User Story:** As a User, I want to submit prayer requests and sign up for newsletters, so that I can receive prayer support and stay informed about church news.

#### Acceptance Criteria

1. THE Prayer_Section SHALL display a prayer request form with fields for name, email, and prayer request message
2. THE Prayer_Section SHALL display a newsletter signup form with fields for name and email
3. WHEN a User submits the prayer request form, THE Prayer_Section SHALL validate that all required fields are filled
4. WHEN a User submits the newsletter signup form, THE Prayer_Section SHALL validate that the email field contains a valid email format
5. WHEN form validation fails, THE Prayer_Section SHALL display error messages indicating which fields need correction
6. WHEN form validation succeeds, THE Prayer_Section SHALL display a success message confirming submission
7. THE Prayer_Section SHALL display the church contact email hello@hisdayspring.org
8. THE Prayer_Section SHALL display the church contact phone number +234 906 619 2155
9. WHERE the viewport width is less than 768 pixels, THE Prayer_Section SHALL stack form fields vertically for mobile usability

### Requirement 13: Footer Information

**User Story:** As a User, I want to access important links and contact information from any page, so that I can quickly find what I need without scrolling back to the top.

#### Acceptance Criteria

1. THE Footer_Component SHALL display the church name and tagline
2. THE Footer_Component SHALL display the church's physical addresses for Ipaja and Ikeja branches
3. THE Footer_Component SHALL display the church contact email and phone number
4. THE Footer_Component SHALL display quick links to all major sections
5. THE Footer_Component SHALL display social media icons with links
6. THE Footer_Component SHALL display copyright information with the current year
7. THE Footer_Component SHALL use the Design_System's color palette with appropriate contrast for readability
8. WHERE the viewport width is less than 768 pixels, THE Footer_Component SHALL stack footer columns vertically

### Requirement 14: Design System Implementation

**User Story:** As a User, I want the website to have a visually cohesive and professional appearance, so that I have confidence in the church's credibility and feel spiritually uplifted.

#### Acceptance Criteria

1. THE Design_System SHALL implement a brand color palette with deep navy or royal purple as primary color, gold as accent color, and cream or white as background color
2. THE Design_System SHALL use a serif font for display headings and section titles
3. THE Design_System SHALL use a humanist sans-serif font for body text and navigation
4. THE Design_System SHALL apply generous whitespace between sections (minimum 80 pixels vertical spacing)
5. THE Design_System SHALL use bold section dividers with gold accent lines
6. THE Design_System SHALL implement overlapping elements where appropriate for visual depth
7. THE Design_System SHALL maintain consistent spacing, sizing, and color usage across all components
8. THE Design_System SHALL ensure text contrast ratios meet WCAG AA standards for accessibility

### Requirement 15: Animation System Implementation

**User Story:** As a User, I want smooth and engaging animations throughout the website, so that my browsing experience feels modern and delightful.

#### Acceptance Criteria

1. THE Animation_System SHALL use Framer Motion for all animations
2. WHEN any section enters the viewport, THE Animation_System SHALL trigger fade-in animations for section content
3. THE Animation_System SHALL apply staggered animations to lists and grids with 100 millisecond delays between items
4. WHEN a User hovers over interactive elements, THE Animation_System SHALL apply subtle scale or color transition effects
5. THE Animation_System SHALL ensure all animations complete within 1000 milliseconds
6. THE Animation_System SHALL respect user's prefers-reduced-motion settings by using Framer Motion's useReducedMotion hook to disable animations when requested
7. THE Animation_System SHALL not trigger animations for elements already in viewport on initial page load

### Requirement 16: Responsive Layout System

**User Story:** As a User, I want the website to work perfectly on any device I use, so that I can access church information whether I'm on my phone, tablet, or computer.

#### Acceptance Criteria

1. THE Responsive_Layout SHALL support viewport widths from 320 pixels to 1920 pixels
2. THE Responsive_Layout SHALL use mobile-first responsive design principles
3. WHERE the viewport width is less than 640 pixels, THE Responsive_Layout SHALL display single-column layouts
4. WHERE the viewport width is between 640 pixels and 1024 pixels, THE Responsive_Layout SHALL display two-column layouts where appropriate
5. WHERE the viewport width exceeds 1024 pixels, THE Responsive_Layout SHALL display multi-column layouts with maximum content width of 1440 pixels
6. THE Responsive_Layout SHALL ensure all interactive elements have minimum touch target sizes of 44 pixels on mobile devices
7. THE Responsive_Layout SHALL ensure text remains readable without horizontal scrolling on all viewport sizes
8. THE Responsive_Layout SHALL use responsive images with appropriate sizes for different viewport widths

### Requirement 17: Performance Optimization

**User Story:** As a User, I want the website to load quickly and run smoothly, so that I don't waste time waiting and can access information immediately.

#### Acceptance Criteria

1. THE Website SHALL use Next.js Image component for all images with automatic optimization
2. THE Website SHALL use Next.js Font optimization for all custom fonts
3. THE Website SHALL implement lazy loading for images below the fold
4. THE Website SHALL implement lazy loading for External_Content (YouTube videos, Instagram feeds)
5. THE Website SHALL achieve a Lighthouse performance score of at least 90 on desktop
6. THE Website SHALL achieve a Lighthouse performance score of at least 80 on mobile
7. THE Website SHALL minimize JavaScript bundle size by code splitting and tree shaking
8. THE Website SHALL implement proper caching headers for static assets

### Requirement 18: Accessibility Compliance

**User Story:** As a User with disabilities, I want the website to be accessible with assistive technologies, so that I can fully participate in the church community regardless of my abilities.

#### Acceptance Criteria

1. THE Website SHALL provide alternative text for all images
2. THE Website SHALL ensure all interactive elements are keyboard accessible
3. THE Website SHALL provide visible focus indicators for all interactive elements
4. THE Website SHALL use semantic HTML elements for proper document structure
5. THE Website SHALL ensure color is not the only means of conveying information
6. THE Website SHALL provide ARIA labels for icon-only buttons and links
7. THE Website SHALL ensure form inputs have associated labels
8. THE Website SHALL maintain logical heading hierarchy (h1, h2, h3) throughout the page
9. THE Website SHALL achieve WCAG 2.1 Level AA compliance for accessibility

### Requirement 19: TypeScript Type Safety

**User Story:** As a developer maintaining the website, I want comprehensive TypeScript types, so that I can catch errors early and maintain code quality.

#### Acceptance Criteria

1. THE Website SHALL use TypeScript for all component files
2. THE Website SHALL define interfaces for all component props
3. THE Website SHALL define types for all data structures (events, sermons, ministries)
4. THE Website SHALL enable strict mode in TypeScript configuration
5. THE Website SHALL have zero TypeScript compilation errors
6. THE Website SHALL use proper typing for all API responses and External_Content
7. THE Website SHALL avoid using 'any' type except where absolutely necessary with documented justification

### Requirement 20: Content Management Structure

**User Story:** As a church administrator, I want content to be organized in a maintainable structure, so that I can easily update information without developer assistance.

#### Acceptance Criteria

1. THE Website SHALL store static content in structured data files (JSON or TypeScript constants)
2. THE Website SHALL separate content data from component presentation logic
3. THE Website SHALL organize content files by section (about, ministries, events, etc.)
4. THE Website SHALL include clear comments in content files explaining how to update information
5. THE Website SHALL validate content structure at build time to catch errors early
6. THE Website SHALL provide example content entries for events, sermons, and ministries
7. THE Website SHALL document the content update process in a README file
8. THE Website SHALL include project setup instructions in the README file
9. THE Website SHALL document how to update content data files in the README file
10. THE Website SHALL list all required environment variables in the README file
11. THE Website SHALL provide deployment guide with Vercel as the recommended platform in the README file

### Requirement 21: Donation Section

**User Story:** As a User, I want to make online donations to the church, so that I can support the ministry financially through various giving purposes and payment methods.

#### Acceptance Criteria

1. THE Donation_Section SHALL display a heading and introductory text explaining the importance of giving to the ministry
2. THE Donation_Section SHALL provide donation amount options (preset amounts and custom amount input)
3. THE Donation_Section SHALL display donation purpose options including Tithes, Offerings, Special Projects, Building Fund, Missions, and Youth Ministry
4. WHEN a User selects a donation purpose, THE Donation_Section SHALL highlight the selected purpose
5. THE Donation_Section SHALL provide multiple payment method options including Bank Transfer, Card Payment, and Mobile Money
6. WHEN a User selects Bank Transfer, THE Donation_Section SHALL display the church's bank account details (bank name, account number, account name)
7. WHERE Card Payment is selected, THE Donation_Section SHALL integrate with a payment gateway (Paystack or Flutterwave) for secure card processing
8. WHERE Mobile Money is selected, THE Donation_Section SHALL display mobile money payment instructions or integration
9. THE Donation_Section SHALL include a donation form with fields for donor name, email, phone number, amount, and purpose
10. WHEN a User submits the donation form, THE Donation_Section SHALL validate that all required fields are filled
11. WHEN form validation fails, THE Donation_Section SHALL display error messages indicating which fields need correction
12. WHEN form validation succeeds and payment is completed, THE Donation_Section SHALL display a success message with transaction reference
13. THE Donation_Section SHALL include a scripture reference about giving and generosity
14. WHEN the Donation_Section enters the viewport, THE Animation_System SHALL animate the section content with fade-in effects
15. THE Donation_Section SHALL use the Design_System's gold accent colors to highlight donation amounts and call-to-action buttons
16. WHERE the viewport width is less than 768 pixels, THE Donation_Section SHALL stack donation options and payment methods vertically for mobile usability
17. THE Donation_Section SHALL ensure all payment processing complies with PCI DSS standards for security
18. THE Donation_Section SHALL provide a receipt or confirmation email option after successful donation
19. THE Environment_Config SHALL store the Paystack public key as NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in the .env.local file
20. WHERE Flutterwave is used, THE Environment_Config SHALL store the Flutterwave public key as NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY in the .env.local file

### Requirement 22: Books and Resources Section

**User Story:** As a User, I want to browse and purchase Pastor Blessing Olamijulo's books and ministry resources, so that I can deepen my spiritual growth and support the ministry's publishing work.

#### Acceptance Criteria

1. THE Books_Section SHALL display a heading "Books & Resources" with introductory text about available ministry materials
2. THE Books_Section SHALL display a grid of available books and resources with at least 4-6 items
3. THE Books_Section SHALL display a book cover image for each resource
4. THE Books_Section SHALL display the title, author name (Pastor Blessing Olamijulo), and brief description for each book
5. THE Books_Section SHALL display the price for each book in Nigerian Naira (₦)
6. THE Books_Section SHALL indicate book format options (Physical Book, E-book, or Both) where applicable
7. WHEN a User hovers over a book card, THE Animation_System SHALL apply a subtle scale and shadow effect
8. THE Books_Section SHALL provide a "Purchase" or "Buy Now" button for each book
9. WHEN a User clicks a purchase button for online payment, THE Books_Section SHALL open a Paystack or Flutterwave payment modal for secure checkout
10. WHERE books are sold through external platforms, THE Books_Section SHALL include a "View on [Platform]" link that opens in a new browser tab
11. WHERE books require manual ordering, THE Books_Section SHALL display a "Contact us to order" modal with church contact information
12. THE Books_Section SHALL display availability status for each book (In Stock, Out of Stock, Pre-order, Digital Only)
13. THE Books_Section SHALL include filtering or category options if multiple resource types exist (Books, Study Guides, Audio Resources, Video Series)
14. THE Books_Section SHALL display featured or bestselling books prominently at the top of the section
15. WHEN the Books_Section enters the viewport, THE Animation_System SHALL animate book cards with staggered fade-in effects
16. THE Books_Section SHALL use the Design_System's typography with serif fonts for book titles and sans-serif for descriptions
17. WHERE the viewport width is less than 768 pixels, THE Books_Section SHALL display book cards in a single column layout
18. WHERE the viewport width is between 768 pixels and 1024 pixels, THE Books_Section SHALL display book cards in a two-column layout
19. WHERE the viewport width exceeds 1024 pixels, THE Books_Section SHALL display book cards in a three or four-column grid layout
20. THE Books_Section SHALL include a "View All Resources" link if more books exist than displayed on the main page
21. THE Books_Section SHALL provide book preview or sample chapter links where available
22. THE Books_Section SHALL display testimonials or reviews for featured books if available
23. THE Books_Section SHALL ensure all book cover images have appropriate alt text for accessibility
24. WHERE book data cannot be scraped or obtained from external sources, THE Books_Section SHALL use clearly labeled placeholder content with instructions for the church administrator to provide real book titles, descriptions, prices, and cover images


### Requirement 23: SEO and Metadata System

**User Story:** As a User searching for churches online, I want the website to appear in search results with accurate information, so that I can discover Hisdayspring Ministries and see rich previews when sharing links.

#### Acceptance Criteria

1. THE SEO_System SHALL generate page-specific `<title>` tags for each page with format "[Page Name] | Hisdayspring Ministries International"
2. THE SEO_System SHALL generate page-specific `<meta name="description">` tags with relevant content for each page
3. THE SEO_System SHALL implement Open Graph meta tags (og:title, og:description, og:image, og:url, og:type) for all pages
4. THE SEO_System SHALL implement Twitter Card meta tags (twitter:card, twitter:title, twitter:description, twitter:image) for all pages
5. THE SEO_System SHALL ensure Open Graph images are optimized for WhatsApp and Facebook link previews with minimum dimensions of 1200x630 pixels
6. THE SEO_System SHALL implement JSON-LD structured data using LocalBusiness schema for church information
7. THE SEO_System SHALL implement JSON-LD structured data using Church schema with service times, address, and contact information
8. THE SEO_System SHALL generate a sitemap.xml file listing all public pages with appropriate priority and change frequency
9. THE SEO_System SHALL generate a robots.txt file allowing search engine crawling of all public pages
10. THE SEO_System SHALL implement canonical URLs for all pages to prevent duplicate content issues
11. THE SEO_System SHALL include appropriate meta viewport tags for mobile optimization
12. THE SEO_System SHALL implement language meta tags (lang="en") for proper content language declaration

### Requirement 24: WhatsApp Integration

**User Story:** As a User in Nigeria, I want to easily contact the church via WhatsApp, so that I can ask questions and join the church community using my preferred messaging platform.

#### Acceptance Criteria

1. THE WhatsApp_Integration SHALL display a floating WhatsApp call-to-action button fixed at the bottom-right corner of the viewport
2. THE WhatsApp_Integration SHALL ensure the floating button remains visible during scrolling on all pages
3. WHEN a User clicks the floating WhatsApp button, THE WhatsApp_Integration SHALL open WhatsApp with a pre-filled message to the church's WhatsApp number
4. THE WhatsApp_Integration SHALL display WhatsApp community or group links in the Footer_Component
5. THE WhatsApp_Integration SHALL display WhatsApp contact information in the Contact_Section
6. THE WhatsApp_Integration SHALL implement click-to-chat functionality using the wa.me URL format
7. THE WhatsApp_Integration SHALL use the church's official WhatsApp number +234 906 619 2155
8. THE WhatsApp_Integration SHALL include a WhatsApp icon with the Design_System's brand colors
9. WHERE the viewport width is less than 768 pixels, THE WhatsApp_Integration SHALL adjust the floating button size for mobile usability while maintaining visibility
10. THE WhatsApp_Integration SHALL apply a subtle pulse animation to the floating button to draw attention

### Requirement 25: Live Streaming Section

**User Story:** As a User who cannot attend church in person, I want to watch live worship services online, so that I can participate in church services remotely.

#### Acceptance Criteria

1. THE Live_Stream_Section SHALL display a dedicated section for live streaming with prominent placement on the homepage
2. THE Live_Stream_Section SHALL embed a YouTube Live player as the primary streaming platform
3. WHERE YouTube Live is unavailable, THE Live_Stream_Section SHALL provide Facebook Live as a fallback streaming option
4. THE Live_Stream_Section SHALL display a live/offline state indicator showing current streaming status
5. WHEN no live service is currently streaming, THE Live_Stream_Section SHALL display the message "No live service currently. Join us for our next service!"
6. WHEN no live service is streaming, THE Live_Stream_Section SHALL display a countdown timer to the next scheduled service
7. THE Live_Stream_Section SHALL calculate countdown time based on the Service_Times_Section schedule data
8. WHEN a live stream is active, THE Live_Stream_Section SHALL display the stream title and current viewer count if available from the API
9. THE Live_Stream_Section SHALL provide playback controls (play, pause, volume, fullscreen) through the embedded player
10. THE Live_Stream_Section SHALL display the next service date and time prominently when offline
11. WHERE the viewport width is less than 768 pixels, THE Live_Stream_Section SHALL maintain responsive video player aspect ratio (16:9)
12. THE Live_Stream_Section SHALL use the Design_System's styling for the section container and state indicators

### Requirement 26: Testimonials and Member Stories Section

**User Story:** As a User considering joining the church, I want to read testimonies from current members, so that I can understand how the church has impacted people's lives.

#### Acceptance Criteria

1. THE Testimonials_Section SHALL display a heading "Testimonies" or "Member Stories" with introductory text
2. THE Testimonials_Section SHALL display testimonials in a carousel or grid layout
3. THE Testimonials_Section SHALL display at least 6-8 testimonial cards
4. THE Testimonials_Section SHALL display member name, photo placeholder, and testimony text for each testimonial card
5. THE Testimonials_Section SHALL limit testimony text to 150-200 words per card for readability
6. WHEN the Testimonials_Section uses a carousel layout, THE Animation_System SHALL provide navigation controls (previous, next, pagination dots)
7. WHERE a carousel is used, THE Testimonials_Section SHALL auto-advance testimonials every 5000 milliseconds
8. WHEN a User hovers over a testimonial card, THE Animation_System SHALL apply a subtle scale or shadow effect
9. WHEN the Testimonials_Section enters the viewport, THE Animation_System SHALL animate testimonial cards with staggered fade-in effects
10. THE Testimonials_Section SHALL use the Design_System's typography with appropriate quote styling
11. WHERE the viewport width is less than 768 pixels, THE Testimonials_Section SHALL display testimonials in a single column layout
12. THE Testimonials_Section SHALL include member photo placeholders with appropriate alt text for accessibility

### Requirement 27: Photo Gallery and Media Section

**User Story:** As a User interested in the church community, I want to view photos from church events and services, so that I can see the church atmosphere and community activities.

#### Acceptance Criteria

1. THE Gallery_Section SHALL display a heading "Gallery" or "Our Community" with introductory text
2. THE Gallery_Section SHALL display photos in a masonry or grid layout
3. THE Gallery_Section SHALL display at least 12-16 photos from various church events and services
4. WHERE real church photos are unavailable, THE Gallery_Section SHALL use high-quality royalty-free placeholder images from services like Unsplash or Picsum Photos with a clear note that these should be replaced with actual church photos
4. THE Gallery_Section SHALL organize photos by categories (Sunday Services, Youth Events, Women's Program, Special Events)
5. WHEN a User clicks a photo, THE Gallery_Section SHALL open the image in a lightbox overlay with full-size view
6. THE Gallery_Section SHALL provide lightbox navigation controls (previous, next, close) for browsing photos
7. WHEN the lightbox is open, THE Gallery_Section SHALL display photo caption and event name if available
8. THE Gallery_Section SHALL implement lazy loading for gallery images to optimize performance
9. WHEN a User hovers over a gallery image, THE Animation_System SHALL apply a subtle zoom or overlay effect
10. THE Gallery_Section SHALL provide category filter buttons to show photos from specific event types
11. WHEN the Gallery_Section enters the viewport, THE Animation_System SHALL animate gallery images with staggered fade-in effects
12. WHERE the viewport width is less than 768 pixels, THE Gallery_Section SHALL display photos in a two-column grid layout
13. WHERE the viewport width exceeds 768 pixels, THE Gallery_Section SHALL display photos in a three or four-column masonry layout
14. THE Gallery_Section SHALL ensure all gallery images have appropriate alt text for accessibility

### Requirement 28: Custom 404 Error Page

**User Story:** As a User who encounters a broken link, I want to see a helpful error page, so that I can easily navigate back to the main website.

#### Acceptance Criteria

1. THE Error_Page SHALL display a custom 404 not found page when a User navigates to a non-existent route
2. THE Error_Page SHALL display the church name "Hisdayspring Ministries International" and logo
3. THE Error_Page SHALL display a clear heading "Page Not Found" or "404 Error"
4. THE Error_Page SHALL display helpful messaging explaining that the requested page does not exist
5. THE Error_Page SHALL provide a prominent "Go to Homepage" button that navigates to the root URL
6. THE Error_Page SHALL display quick links to major sections (About, Services, Contact, Sermons)
7. THE Error_Page SHALL use the Design_System's brand colors, typography, and styling for visual consistency
8. THE Error_Page SHALL include the Navigation_System for easy site navigation
9. THE Error_Page SHALL include the Footer_Component for complete site structure
10. WHERE the viewport width is less than 768 pixels, THE Error_Page SHALL maintain responsive layout and readability

### Requirement 29: Loading States and Transitions

**User Story:** As a User waiting for content to load, I want to see loading indicators, so that I know the website is working and content is being fetched.

#### Acceptance Criteria

1. THE Loading_System SHALL display a page preloader or loading spinner during initial page load
2. THE Loading_System SHALL display skeleton screens for External_Content sections (YouTube videos, Instagram feeds) while content is loading
3. THE Loading_System SHALL display loading spinners for form submissions (prayer requests, newsletter signup, donations)
4. WHEN a form is submitting, THE Loading_System SHALL disable the submit button and display a loading indicator
5. THE Loading_System SHALL implement smooth fade-in transitions when content finishes loading
6. THE Loading_System SHALL ensure loading indicators use the Design_System's brand colors
7. THE Loading_System SHALL display loading states for a minimum of 300 milliseconds to prevent flickering
8. WHERE External_Content fails to load, THE Loading_System SHALL transition from loading state to error message
9. THE Loading_System SHALL provide loading progress indicators for multi-step processes if applicable
10. THE Loading_System SHALL ensure loading indicators are accessible with appropriate ARIA labels

### Requirement 30: Contact Section with Form and Maps

**User Story:** As a User wanting to contact the church, I want to submit a contact form and see the church locations on a map, so that I can reach out with questions or plan a visit.

#### Acceptance Criteria

1. THE Contact_Section SHALL display a heading "Contact Us" with introductory text
2. THE Contact_Section SHALL display a contact form with fields for name, email, subject, and message
3. WHEN a User submits the contact form, THE Contact_Section SHALL validate that all required fields are filled
4. WHEN a User submits the contact form, THE Contact_Section SHALL validate that the email field contains a valid email format
5. WHEN form validation fails, THE Contact_Section SHALL display error messages indicating which fields need correction
6. WHEN form validation succeeds, THE Contact_Section SHALL display a success message confirming submission
7. THE Contact_Section SHALL display an embedded Google Maps iframe showing the Ipaja branch location
8. THE Contact_Section SHALL display an embedded Google Maps iframe showing the Ikeja branch location
9. THE Contact_Section SHALL display the physical address for both Ipaja and Ikeja branches
10. THE Contact_Section SHALL display the church contact phone number +234 906 619 2155 with click-to-call functionality
11. THE Contact_Section SHALL display the church contact email hello@hisdayspring.org with mailto link
12. THE Contact_Section SHALL display office hours or best times to contact if applicable
13. WHERE the viewport width is less than 768 pixels, THE Contact_Section SHALL stack the contact form and maps vertically
14. WHERE the viewport width exceeds 768 pixels, THE Contact_Section SHALL display the contact form and maps in a two-column layout
15. THE Contact_Section SHALL ensure Google Maps embeds are responsive and maintain aspect ratio on all devices

### Requirement 31: Privacy Policy and Cookie Consent

**User Story:** As a User concerned about privacy, I want to see a cookie consent banner and access the privacy policy, so that I understand how my data is collected and used.

#### Acceptance Criteria

1. THE Privacy_System SHALL display a cookie consent banner on the User's first visit to the website
2. THE Privacy_System SHALL position the cookie consent banner at the bottom of the viewport
3. THE Privacy_System SHALL display clear messaging explaining that the website uses cookies
4. THE Privacy_System SHALL provide "Accept" and "Decline" buttons in the cookie consent banner
5. WHEN a User clicks "Accept", THE Privacy_System SHALL store the consent preference in browser localStorage
6. WHEN a User clicks "Decline", THE Privacy_System SHALL store the decline preference and disable non-essential cookies
7. THE Privacy_System SHALL not display the cookie consent banner on subsequent visits after User has made a choice
8. THE Privacy_System SHALL provide a link to the privacy policy page in the cookie consent banner
9. THE Privacy_System SHALL create a dedicated privacy policy page accessible from the Footer_Component
10. THE Privacy_System SHALL display privacy policy content covering data collection, usage, storage, and user rights
11. THE Privacy_System SHALL ensure privacy policy content complies with GDPR requirements for form data collection
12. THE Privacy_System SHALL include information about third-party services (YouTube, Zeno.fm, payment gateways) in the privacy policy
13. THE Privacy_System SHALL provide contact information for privacy-related inquiries in the privacy policy
14. WHERE the viewport width is less than 768 pixels, THE Privacy_System SHALL ensure cookie banner text and buttons remain readable and accessible

### Requirement 32: Environment Variables and Configuration Management

**User Story:** As a developer deploying the website, I want all API keys and sensitive configuration stored securely in environment variables, so that credentials are not exposed in the codebase.

#### Acceptance Criteria

1. THE Environment_Config SHALL store the YouTube Data API v3 key as NEXT_PUBLIC_YOUTUBE_API_KEY in the .env.local file (as specified in Requirement 6.8)
2. THE Environment_Config SHALL store the Paystack public key as NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in the .env.local file (as specified in Requirement 21.19)
3. WHERE Flutterwave is used, THE Environment_Config SHALL store the Flutterwave public key as NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY in the .env.local file (as specified in Requirement 21.20)
4. THE Environment_Config SHALL store the Google Maps API key as NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in the .env.local file if required for embedded maps
5. THE Environment_Config SHALL provide a .env.example file with all required environment variable names and placeholder values
6. THE Environment_Config SHALL include comments in .env.example explaining what each environment variable is used for
7. THE Environment_Config SHALL ensure .env.local is listed in .gitignore to prevent committing sensitive keys
8. THE Environment_Config SHALL validate that required environment variables are present at build time
9. WHEN a required environment variable is missing, THE Environment_Config SHALL throw a clear error message indicating which variable is missing
10. THE Environment_Config SHALL use Next.js environment variable conventions (NEXT_PUBLIC_ prefix for client-side variables)
11. THE Environment_Config SHALL document all required environment variables in the README file
12. THE Environment_Config SHALL provide instructions for obtaining API keys (YouTube, Paystack, Google Maps) in the README file
