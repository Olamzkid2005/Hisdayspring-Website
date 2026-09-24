# Hisdayspring Ministries International Website

A premium, accessible church website built with Next.js 14+, TypeScript, Tailwind CSS v4, and Framer Motion.

## Features

- **16 Sections**: Hero, About, Pastor, Service Times, Sermons, Radio, Ministries, Events, Giving, Donation, Books, Live Stream, Testimonials, Gallery, Prayer Request, Contact
- **External Integrations**: YouTube API, Zeno.fm Radio, Bachs Payments, Google Maps
- **Accessibility**: WCAG 2.1 Level AA compliant with semantic HTML and ARIA attributes
- **Responsive Design**: Mobile-first approach supporting 320px to 1920px viewports
- **Performance**: Optimized images, lazy loading, and automatic code splitting
- **SEO**: JSON-LD structured data, sitemap.xml, robots.txt, and Open Graph meta tags

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Testing**: Jest, React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Olamzkid2005/Hisdayspring-Website.git
   cd Hisdayspring-Website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables template:
   ```bash
   cp .env.example .env.local
   ```

4. Fill in your API keys in `.env.local` (see [Environment Variables](#environment-variables))

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# YouTube API (for sermon fetching)
NEXT_PUBLIC_YOUTUBE_API_KEY=your_client_side_key

# YouTube API Server-side (for live stream status - keep secret!)
YOUTUBE_API_KEY=your_server_side_key
YOUTUBE_CHANNEL_ID=@hisdayspring

# Server-side payment secrets (never expose these to the browser)
# `sk_sandbox_...` routes to sandbox-api.bachs.io, `sk_live_...` to
# api.bachs.io. The base URL is derived from the key prefix, so going live is
# a key swap rather than a code change.
BACHS_SECRET_KEY=sk_sandbox_xxxxx

# Signing secret from the webhook endpoint (Bachs Developer Portal → Webhooks)
BACHS_WEBHOOK_SECRET=xxxxx

# Optional: override the API base URL (defaults from the key prefix)
# BACHS_API_BASE_URL=

# Google Maps (for contact section)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=+2349066192155
```

### Obtaining API Keys

- **YouTube API Key**: [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → Create Credentials
- **Bachs Keys**: [Bachs dashboard](https://app.bachs.io) → Developer Portal → API keys (secret key) and → Webhooks (signing secret). Build against the sandbox first — see the [Bachs docs](https://docs.bachs.io)
- **Google Maps API Key**: [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/              # API routes
│   │   └── livestream/  # YouTube live status API
│   ├── privacy/         # Privacy policy page
│   ├── globals.css      # Tailwind v4 design system
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/
│   ├── layout/          # Navigation, Footer, WhatsAppFloat
│   ├── sections/        # Page sections (Hero, About, etc.)
│   ├── ui/              # Reusable UI (Button, Input, Card, Modal)
│   └── utility/         # CookieConsent, ErrorBoundary
├── data/                 # Content data files (easy to update)
│   ├── about.ts
│   ├── books.ts
│   ├── donations.ts
│   └── ...
├── hooks/                # Custom React hooks
│   ├── useScrollPosition.ts
│   ├── useIntersectionObserver.ts
│   ├── useCounterAnimation.ts
│   └── useFormValidation.ts
├── lib/
│   ├── api/             # External API clients
│   │   ├── youtube.ts
│   │   └── bachs.ts
│   ├── server/          # Server-only helpers
│   │   ├── bachs.ts     # Checkout sessions + webhook signature checks
│   │   └── payments.ts  # Donation validation
│   ├── animations/      # Framer Motion variants
│   └── config/         # Environment configuration
├── types/               # TypeScript type definitions
└── __tests__/          # Jest tests
```

### Payment routes

Payment initialization and verification are handled by server-side route handlers:

- `POST /api/payments/bachs/initialize`
- `POST /api/payments/bachs/verify`
- `POST /api/payments/bachs/webhook`

Donations are collected on a Bachs hosted checkout: the server creates a checkout session priced in NGN (as a decimal string, never minor units) and the donor is redirected to it. Both card (`NGN_CARD`) and bank transfer (`NGN_BANK_TRANSFER`) complete on that same page.

Returning from checkout is not treated as proof of payment — the success page calls `/verify`, which asks the Bachs API whether the session actually reached `completed`. Webhooks (`collection.succeeded`) remain the source of truth for fulfilment and are verified with an HMAC-SHA256 signature over `"{timestamp}.{raw_body}"`.

Configure the Bachs webhook URL as `https://<your-domain>/api/payments/bachs/webhook` and subscribe to the Payments and Checkout events. Webhooks authenticate signatures, but payment records are not persisted because this project does not yet include a database or queue. Add persistence before relying on webhook events for donor receipts, reconciliation, or fulfillment.

Pastor & ministerial giving is transfer-only. Selecting it replaces the online form with the pastor's own bank account and copy-to-clipboard buttons, because a card gift cannot be routed to an individual and would silently settle into the church account. The account shown to donors is `pastoralGivingAccount` in `data/donations.ts` — change it there, not in the page. See `DEPLOYMENT.md` §6.

## Updating Content

The website uses structured data files in `/data` for easy content updates. No coding knowledge required!

### To Update:

| Content | File |
|---------|------|
| About Section | `data/about.ts` |
| Pastor Info | `data/pastor.ts` |
| Service Times | `data/services.ts` |
| Ministries | `data/ministries.ts` |
| Events | `data/events.ts` |
| Books | `data/books.ts` |
| Donation Bank Details | `data/donations.ts` |
| Contact Info | `data/contact.ts` |
| Social Links | `data/social.ts` |
| Privacy Policy | `data/privacy.ts` |

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Static Export

```bash
npm run build
```

The optimized output will be in `.next/` directory.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Private - All rights reserved.

## Contact

**Hisdayspring Evangelical Ministries International**

- Website: https://hisdayspring.org
- Email: hello@hisdayspring.org
- Phone: +234 906 619 2155
- WhatsApp: +234 906 619 2155

**Developer**: Olamzkid2005
