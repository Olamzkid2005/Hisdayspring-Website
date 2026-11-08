# Hisdayspring Evangelical Ministries International — Website

The church's website: **https://www.hisdayspringfamily.org**

Built with Next.js (App Router), TypeScript, Tailwind CSS v4 and Framer Motion.
Content lives in typed data files, images are served from Cloudinary, and
donations/books are paid through Bachs.

> The legacy site at `hisdayspring.org` is a separate WordPress installation on
> Qservers. It is **not** this app, it is not the canonical host, and it still
> hosts the church mailbox (`hello@hisdayspring.org`). Do not point it here —
> see [DEPLOYMENT.md](DEPLOYMENT.md) §4.

## Pages

| Route | What it does |
|---|---|
| `/` | Hero, about, lead pastor, service times, sermons, ministries, events, gallery, socials, contact |
| `/pastors` | Lead pastor, branch pastors, ministers and department heads |
| `/giving` | Tithes, offerings and seeds by card/bank transfer, plus pastor & ministerial giving (direct transfer) |
| `/books` | Book catalogue, cart, pickup or PDF fulfilment via Bachs |
| `/books/receipt` | Post-payment receipt, reference and PDF downloads (noindex) |
| `/books/verify` | Staff check of a buyer's payment reference (noindex) |
| `/live` | YouTube live status and the latest service |
| `/radio` | Hisdayspring Radio stream (Zeno.fm) |
| `/prayer` | Prayer request form that opens WhatsApp |
| `/testimonials` | Church testimonies |
| `/ministries/[slug]` | Ministry detail pages (YOFIC, Discovery, Jewels, BOMS, …) |
| `/welfare`, `/crusade` | Dedicated ministry pages; their `/ministries/...` copies canonicalise here |
| `/privacy`, `/terms` | Legal pages |

API routes: `POST /api/payments/bachs/initialize`, `/verify`, `/webhook`,
`/book-order/initialize`, `/book-order/download`, plus `GET /api/livestream`.

## Features

- **Live and media** — YouTube channel `@Dayspring_Family` (channel ID
  `UCsK_cum0IKbuQ75Va8ty0CA`), automatic live-status lookup, sermon grid, radio
  player.
- **Giving** — Bachs hosted checkout in NGN (card and bank transfer), church
  bank details, and transfer-only pastor & ministerial giving. Minimum ₦100.
- **Books** — server-priced cart, pickup reference or instant PDF download,
  shareable receipt, staff verification page.
- **Forms** — prayer requests via WhatsApp; contact via mailto; map embed.
- **Accessibility** — semantic landmarks, one `h1` per page, labelled inputs,
  keyboard-visible focus, WCAG 2.1 AA target.
- **SEO** — per-route canonical URLs on one `SITE_URL`, JSON-LD, sitemap,
  robots, `llms.txt`, Open Graph/Twitter images, `security.txt`.
- **Images** — every `/images/...` path is rewritten by a custom Next image
  loader to an optimised Cloudinary URL (`f_auto`, responsive width, no
  upscaling).

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, React Server Components) |
| Language | TypeScript 5 (strict) |
| UI | React 19, Tailwind CSS v4, Framer Motion, Lucide icons |
| Payments | Bachs (hosted checkout + HMAC-signed webhooks) |
| Media | Cloudinary image CDN, YouTube Data API, Zeno.fm |
| Tests | Jest 30, React Testing Library, jest-axe, MSW |

## Getting started

Requires **Node.js 20.9+** and npm.

```bash
git clone https://github.com/Olamzkid2005/Hisdayspring-Website.git
cd Hisdayspring-Website
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. Payments and live status need keys (below);
everything else renders without them.

## Environment variables

```env
# ── Public origin ───────────────────────────────────────────────────────────
# Server-only, read at request time. Used for Bachs success/cancel URLs and
# receipt links. Required in production: behind Pxxl's proxy request.url is the
# internal container address, and Bachs rejects a non-public success URL (502).
SITE_URL=https://www.hisdayspringfamily.org

# Build-time override for canonical URLs, sitemap, robots and JSON-LD.
# Optional in production (lib/site.ts defaults to the URL above), useful for
# preview deployments that should point at themselves.
# NEXT_PUBLIC_SITE_URL=https://preview.example.com

# ── YouTube ────────────────────────────────────────────────────────────────
# Optional client-side key for the public sermon grid.
NEXT_PUBLIC_YOUTUBE_API_KEY=

# Server-side key for live-stream status.
YOUTUBE_API_KEY=
# Numeric channel id — the Data API's channelId does not accept a handle.
YOUTUBE_CHANNEL_ID=UCsK_cum0IKbuQ75Va8ty0CA

# ── Payments (server only, never NEXT_PUBLIC_) ─────────────────────────────
# sk_sandbox_... → sandbox-api.bachs.io, sk_live_... → api.bachs.io.
BACHS_SECRET_KEY=sk_sandbox_xxxxx
# Signing secret of the webhook endpoint (Bachs → Developer Portal → Webhooks).
BACHS_WEBHOOK_SECRET=xxxxx
# Optional override; normally derived from the key prefix.
# BACHS_API_BASE_URL=
# Escape hatch for sandbox keys on a production build. Leave unset.
# ALLOW_SANDBOX_PAYMENTS_IN_PRODUCTION=

# ── Third-party public keys ────────────────────────────────────────────────
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=+2348077829444
# Cloudinary cloud name (public). Defaults to hurqcssn in the image loader.
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=hurqcssn

# Only the upload scripts need these; the site never reads them.
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

The two URL variables are deliberately different:

- **`SITE_URL`** is server-only and read at runtime, because a `NEXT_PUBLIC_`
  value is inlined at build time and a runtime change would never be seen.
- **`NEXT_PUBLIC_SITE_URL`** is read while metadata, the sitemap and robots are
  generated (build time). Set it only when the canonical host must differ from
  the production URL — otherwise leave it unset.

Getting keys:

- **YouTube** — [Google Cloud Console](https://console.cloud.google.com/) →
  APIs & Services → Credentials → YouTube Data API v3.
- **Bachs** — [dashboard](https://app.bachs.io) → Developer Portal (secret key)
  and → Webhooks (signing secret). Build against the sandbox first; the
  [Bachs docs](https://docs.bachs.io) cover checkout and webhook signatures.
- **Google Maps** — same Cloud Console → Maps Embed/JavaScript API.

## Project structure

```
app/
  api/
    livestream/                    # YouTube live status
    payments/bachs/                # initialize, verify, webhook
      book-order/                  # initialize + download
  books/{receipt,verify}/          # noindex post-payment pages
  ministries/[slug]/               # ministry detail
  giving/                          # giving page + client form
  ...                              # pastors, live, radio, prayer, welfare,
                                   # crusade, testimonials, privacy, terms
  layout.tsx, page.tsx             # root shell and homepage
  sitemap.ts, robots.ts            # crawl metadata from lib/site.ts
components/
  layout/                          # Navigation, Footer, WhatsApp float
  sections/                        # homepage and page sections
  ui/                              # Button, Input, Card, Modal, Badge…
  utility/                         # CookieConsent, ErrorBoundary
data/                              # all site copy and content (typed)
hooks/                             # scroll, intersection, counters, forms
lib/
  api/                             # YouTube and Bachs clients
  server/                          # server-only payment/site helpers
  cdn/cloudinary-loader.ts         # Next image loader
  site.ts                          # SITE_URL for canonical metadata
scripts/                           # image/Cloudinary/font/launch-ad tooling
__tests__/                         # Jest suites
artifacts/                         # generated launch photos and ad
```

### Payments in one paragraph

`initialize` creates a Bachs checkout priced in NGN as a decimal string (never
minor units) and redirects the donor to it; card and bank transfer both finish
there. Returning from checkout is not proof of payment — the success page calls
`/verify`, which asks Bachs whether the session reached `completed`. Webhooks
(`collection.succeeded`) are the source of truth for fulfilment and are checked
with an HMAC-SHA256 signature over `"{timestamp}.{raw_body}"`, with a 300-second
timestamp window. **Nothing is persisted** — there is no database or queue yet,
so webhook events do not create donor receipts or records. Read
[DEPLOYMENT.md](DEPLOYMENT.md) §5–6 before changing this flow.

## Updating content

All copy is in `data/`; no component edits needed for routine updates.

| Content | File |
|---|---|
| Service times | `data/services.ts` |
| Events | `data/events.ts` |
| Ministries | `data/ministries.ts` |
| Books and prices | `data/books.ts` |
| Donation bank accounts, minimum, pastoral account | `data/donations.ts` |
| Contact details and HQ address | `data/contact.ts` |
| Pastors and ministers | `data/workforce.ts` |
| Social links | `data/social.ts` |
| Gallery | `data/gallery.ts` (generated — see `scripts/generate-gallery.mjs`) |
| Testimonials | `data/testimonials.ts` |
| Privacy / terms | `data/privacy.ts`, `data/terms.ts` |
| About / vision | `data/about.ts` |

Events disappear automatically the day after they end (Lagos time). Delete an
entry rather than leaving a stale date in place; past events belong in
`pastEvents`.

## Scripts

```bash
npm run dev            # development server
npm run build          # production build
npm run start          # serve the production build
npm run lint           # ESLint
npm run test           # Jest
npm run test:watch     # Jest in watch mode
npm run test:coverage  # coverage report
```

Utility scripts (run manually, not part of the build):

| Script | Purpose |
|---|---|
| `scripts/upload-images-to-cdn.mjs` | Upload `public/images` to Cloudinary; skips files in `.cdn-uploads.json` |
| `scripts/check-cdn.mjs` | Verify every referenced image exists on the CDN |
| `scripts/generate-gallery.mjs` | Regenerate `data/gallery.ts` from the gallery folder |
| `scripts/optimize-images.py` | Resize/compress camera originals before upload |
| `scripts/subset-fonts.mjs` | Subset the self-hosted fonts |
| `scripts/generate-launch-ad.swift` | Render the launch ad video |

Requires `CLOUDINARY_*` env vars for the upload/check scripts.

## Deployment

Production runs on **Pxxl**, deployed automatically from `main`:

- Canonical: **https://www.hisdayspringfamily.org**
- Project preview: `https://hisdayspring-website.pxxlspace.cv`

The full runbook — Pxxl settings, environment variables, DNS, cache purging,
webhooks, post-deploy checks and rollback — is in
[DEPLOYMENT.md](DEPLOYMENT.md). There is no Vercel deployment anymore.

## Quality checks

Before pushing:

```bash
npm run lint
npm run test
npm run build
```

The current results, open findings and their severity live in
[AUDIT.md](AUDIT.md). Anything not re-run since the last docs sync is marked
there rather than assumed.

## Documentation

| File | Contents |
|---|---|
| [DEPLOYMENT.md](DEPLOYMENT.md) | Hosting, env vars, DNS, webhooks, verification, rollback |
| [AUDIT.md](AUDIT.md) | Homepage and whole-site audit, fixes, open findings |
| [CONTENT_RESEARCH_NOTES.md](CONTENT_RESEARCH_NOTES.md) | Source material and what is confirmed vs. placeholder |
| [public/llms.txt](public/llms.txt) | Public machine-readable summary of the church and site |

## Browser support

Chrome, Firefox, Safari and Edge (latest two versions).

## Contributing

1. Branch from `main` (`git checkout -b feature/your-change`).
2. Make the change and run the checks above.
3. Open a pull request describing the user-visible effect.

## License

Private — all rights reserved.

## Contact

**Hisdayspring Evangelical Ministries International**

- Website: https://www.hisdayspringfamily.org
- Email: hello@hisdayspring.org (mailbox hosted on the legacy domain)
- Phone: +234 906 619 2155
- WhatsApp: +234 807 782 9444
- Address: Plot 200, 21 Road, Beside Faith Academy, Gate Bus Stop, Gowon Estate,
  Ipaja, Lagos 100278, Nigeria

**Developer**: Olamzkid2005
