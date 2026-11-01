# Killer: homepage (Hisdayspring)

**Tier** T2 route · **Surface** A acquisition · **Verdict** detectors clean, copy proposals open
**Scope** `app/page.tsx` + the sections it renders + shared nav/ui it uses

## Pending decision (the user's, not mine)

1. The cookie card covers both hero CTAs on first visit at 1440×900 (card
   top 648px, CTA row 665–745px). Recommendation: make it a compact bottom bar
   (≤96px) or shift the hero by `--consent-banner-offset`. Not changed here
   because that is a consent-UI redesign, not a fix.
2. The pastor's welcome letter still carries 8 copy-gate occurrences (em-dash,
   "not just", "genuine"/"truly"). Those are the client's words, so they are
   listed below instead of rewritten.

## Surfaces

| File | Surface (A/B/C) | Business variable it moves | Notes |
|---|---|---|---|
| app/page.tsx | A | First visit → watch live / plan a visit | Hero, service times, giving and contact on one scroll |
| app/layout.tsx | A | Route entry on every page | Shell: nav, footer, consent, analytics |
| app/giving/page.tsx | C | Completed donation | Money flow, Bachs checkout |
| app/books/page.tsx | C | Book order | Money flow, cart |
| app/books/receipt/page.tsx | C | Receipt retrieval | Post-payment support |
| app/books/receipt/layout.tsx | C | Receipt retrieval shell | Noindex, minimal chrome |
| app/books/verify/page.tsx | C | Payment verification | Post-payment support |
| app/books/verify/layout.tsx | C | Payment verification shell | Noindex, minimal chrome |
| app/live/page.tsx | A | Watch live / attendance | YouTube live status |
| app/radio/page.tsx | A | Listen / engagement | Audio stream |
| app/prayer/page.tsx | A | Prayer request submitted | Form → WhatsApp |
| app/pastors/page.tsx | A | Trust in leadership | Team and lead pastors |
| app/ministries/[slug]/page.tsx | A | Ministry join / enquiry | Detail per ministry |
| app/crusade/page.tsx | A | Crusade attendance | Event page |
| app/welfare/page.tsx | A | Welfare engagement | Ministry page |
| app/testimonials/page.tsx | A | Trust / proof | Social proof |
| app/privacy/page.tsx | C | Consent trust | Legal copy |
| app/terms/page.tsx | C | Legal trust | Legal copy |

## Screen seen

| Route | Width | Data state | What happened |
|---|---|---|---|
| / | 1440×900 | live data, first visit (no consent stored) | Hero photo loads at 1440 Cloudinary width; cookie card overlaps the hero CTA row; document overflow 0 |
| / | 390×844 | live data, first visit | Hero photo, single CTA; document overflow 0 after the reveal fixes (was 6px); 891 nodes |
| /#welcome | 390×844 | live data | Lead/resident pastor block: name, role and letter legible; no italics or all-caps overlines |
| / | 1440×900 | live data, consent dismissed | Hero photo fully painted, `naturalWidth` 1440; CTA row clear; doc overflow 0 |

Hydration was confirmed by the hero photo (`onLoad` → painted underlay) and by
the consent timer mounting the banner; measurement ran after a warm route
(second load, 0.14s) with the node count checked (891). The first desktop capture
was grey at 4.5s: the Cloudinary image had not decoded yet, so that capture was
discarded and re-taken at 10s (see `environment.md`).

## Gate

| Detector | Before | After |
|---|---|---|
| impeccable | 0 | 0 |
| token (built-in fallback) | 0 | 0 |
| chrome noise | 30 findings | 0 |
| copy-lint (manual, repo skill folder) | 12 occurrences | 4 fixed (aria-labels); 8 open |
| tsc --noEmit | pass | pass |
| 390px document overflow | +6px | 0px |

`killer-scan` reports copy as SKIPPED because it looks for `copy-lint` under
`~/.claude/skills`; the repo copy is at `.agents/skills/visant-copy/scripts/`.
It was run by hand, so the fourth gate is measured, not skipped.

## Slop fixed

| # | Rule | Where | Fix |
|---|---|---|---|
| 1 | hover-lift | HeroSection.tsx:103, LiveStreamSection.tsx:98 | scale replaced with colour/brightness |
| 2 | hover-lift | MinistriesSection.tsx:53, GalleryGrid.tsx:67, SermonsSection.tsx, BooksSection.tsx, WorkforceSection.tsx | image zoom removed |
| 3 | stagger-by-index | Books, Events, Ministries, Sermons, ServiceTimes, Workforce, GalleryTestimonials, MobileMenu | per-index delay removed; content appears on entry, not on a queue |
| 4 | blur-on-card | HeroSection.tsx:111, Badge.tsx:27, BackButton.tsx:22 | decorative `backdrop-blur` removed |
| 5 | arrow-glyph | DesktopMenu.tsx:78 | text arrow → lucide `ArrowRight` |
| 6 | italic-headline-word | PastorSection.tsx:51, WorkforceSection.tsx:101 | `<em>` → coloured `<span>` |
| 7 | shouting-label | PastorSection.tsx:112,119,138,145 | uppercase + widest tracking dropped on micro-labels |
| 8 | tile-img-no-onerror | SermonsSection.tsx:188,230 | error handler hides the broken thumbnail, surface stays as the backdrop |
| 9 | opacity-ladder | GiveSection.tsx:70 | border alphas normalised to /30 |

## Screen defect fixed (measured, not guessed)

The 6px document overflow at 390px came from reveal transforms, not layout:
`initial={{ x: 30 }}` on full-width columns (PastorSection, ContactSection,
ServiceTimesSection) and `x: 20` on sermon rows pushed 342–358px of content to
396px before the element entered the viewport. Those reveals are vertical now
(`y: 24` / `y: 16`), so the pre-reveal state cannot exceed the viewport. Measured
`document.documentElement.scrollWidth - clientWidth`: 6 → 0 at 390px.

## Runtime scan (`corta-scan`, 390 and 1440)

Run against the live homepage. Confirmed false positives, discarded after
checking the node at each line: headings whose line box clips 2–6px of font
overshoot (all headings, including ones with no overflow ancestor); gradient
and scrim layers covering the image they sit on; the gallery caption bar
(52px below its tile until hover, by design); the decorative About image
clipped by its `overflow-hidden` section.

One real stacking, left as designed: the WhatsApp button (z-40) is 100% covered
by the consent modal (z-50) on first visit. The modal is a blocking choice by
design and the button returns after Accept/Decline; it is not a lost action.

## Copy proposals (visible text, untouched)

| File | Line | Current | Proposed |
|---|---|---|---|
| PastorSection.tsx | 13 | "you are not just welcome here, you belong here" | "you are welcome here, and you belong here" |
| PastorSection.tsx | 13, 22 | "—" used twice in the letters | comma or full stop |
| PastorSection.tsx | 15 | "genuine community" | "community" |
| PastorSection.tsx | 22 | "truly cares" | "cares" |
| ServiceTimesSection.tsx | 65 | "various settings — from Sunday worship…" | "various settings, from Sunday worship…" |

## Not verified

- T2 interrogation (12 questions) and the F1–F6 fixed block: not run this round.
- Light/dark theme pass (`verify-screens --theme both`): not run.
- Keyboard sweep over the whole homepage: only the hero CTAs and nav were
  exercised; no regression was introduced in their focus styles.
- Probe with the backend stopped: not run; the homepage's only network data is
  YouTube, which already falls back to an empty sermon grid.

---

# Whole-site audit — 1 November 2026

**Scope:** all 25 indexable routes (home, 14 content routes, 10 ministry
routes), the payment/book APIs, metadata, structured data and the production
host. **Method:** production build, full Jest suite, ESLint, a JSDOM crawl of
`next start` (status, title, description, canonical, headings, alt text, form
labels, duplicate ids, internal links), axe on the routes the page suites did
not cover, unauthenticated probes of every payment endpoint, `npm audit
--omit=dev`, and live requests to both domains.

## Fixed in this pass

| Area | Defect | Fix |
|---|---|---|
| Canonicals | Every route advertised `https://hisdayspring.org`, a host that answers 406. | One `SITE_URL` (`lib/site.ts`); per-route canonicals; home canonical added. |
| Sitemap / robots / JSON-LD | Old origin; sitemap omitted `/live`, `/prayer`, `/testimonials`; robots blocked `/_next/`. | New origin, three routes added, `/_next/` allowed. |
| Social previews | OG images for welfare, crusade and ministries pointed at `/images/...`, which is not deployed (404). | Cloudinary URLs at 1200px. |
| Duplicate pages | `/welfare` and `/ministries/welfare` (same for crusade) were both indexable. | Ministry copies canonicalise to the dedicated route; sitemap lists one each. |
| Headings | `/prayer` and `/testimonials` had no h1; `/giving` had h2 before h1; receipt loading state had none. | One h1 per page; giving panel is the page h1. |
| Forms | Giving custom amount input had no label. | `aria-label="Custom donation amount"`. |
| Content | JSON-LD and `llms.txt` said Sundays 8:00 & 10:30; the site runs 8:00, 10:00, 12:00. `llms.txt` also named Ikeja instead of Island Church. | Corrected. |
| Headers | `X-Powered-By: Next.js`. | `poweredByHeader: false`. |
| Tooling | The committed skills' fixtures broke `jest` and `eslint`; one book-cart test still used the old aria-label. | Ignore lists for `.agents` and the other tool directories; selector updated. |
| Navigation | Homepage still carried the giving panel after it moved. | Panel now opens `/giving` and jumps to the form/bank card. |

## Verified

- `next build` passes; **227 tests in 29 suites** pass; ESLint has **0 errors**
  (3 pre-existing warnings).
- All 25 routes return 200; unknown routes return 404; no broken internal
  links, duplicate ids, missing `alt`, or unlabelled inputs in the crawl.
- Canonicals now self-reference on every indexable route; sitemap and robots
  emit the new origin; sitemap no longer lists the duplicate ministry URLs.
- axe found no violations on the nine uncovered surfaces (pastors, prayer,
  privacy, terms, 404, error, book verify, book receipt, ministry detail).
- Unsigned webhook POST returns 401, GET returns 405; initialize/verify/download
  refuse when payment env is absent; signature checks use timing-safe compare
  with a 300s timestamp window.
- Cloudinary OG URLs return 200 image responses; live production returns 200 on
  `www.hisdayspringfamily.org` and 406 on `hisdayspring.org`.

## Open findings

| Severity | Finding | Evidence / next step |
|---|---|---|
| Critical | `npm audit --omit=dev` reports 3 production vulnerabilities: Next 16.3.6 (advisory range 16.0.0–16.4.0, critical), `sharp` (high), `source-map-js` (high). | `npm audit fix` reports updates available; upgrade and re-run build/tests before the next payment release. |
| High | Cookie consent does not gate anything: Analytics renders unconditionally and the YouTube/Google Maps iframes load before a choice. | `CookieConsent` stores a preference no other component reads; wire consent to embeds/analytics or change the copy. |
| High | No Content-Security-Policy. | Add a report-only policy first; allow Cloudinary, YouTube, Maps and Bachs, then tighten. |
| Medium | Date-dependent static pages: `EventsSection` and the hero call `lagosToday`/`getUpcomingEvents` during render, while the page is cached with `s-maxage=31536000`. | Events stay after they end and the first client render can mismatch after midnight. Move to ISR/dynamic or pass a server reference date; reduce the HTML cache lifetime. |
| Medium | Rate limits are per Node process and keyed only by IP (10/min on donation init). | A shared church/NAT network can hit the cap; replicas each get their own bucket. Use a shared store or raise the limit. |
| Medium | Mobile menu has no focus trap, no Escape handling and no dialog semantics. | Keyboard focus can move behind the drawer; add `role="dialog"`,`aria-modal`, focus trap and Escape. |
| Medium | Webhooks are verified but not persisted; no donation/book fulfilment or receipt is triggered by an event. | Documented in the route; needs a database/queue before relying on webhooks as the source of truth. |
| Medium | `@vercel/analytics` is mounted on Pxxl, which does not serve `/_vercel/*`. | Verify in the network panel; remove or replace with a host-compatible analytics tool. |
| Low | Apex and `www` both return 200 with no redirect. | Pick www (used by canonicals) and redirect the apex at the host. |
| Low | Contact data only lists the Ipaja headquarters, while pastor data names Island Church and Ikorodu branches. | Add the branch addresses or link them from the pastors page. |
| Low | Sitemap `lastModified` is build time for every URL. | Search engines see everything change on every deploy; use real content dates. |
| Low | `DEPLOYMENT.md` still describes the old domain; test fixtures still use it as an arbitrary origin. | Docs drift, not runtime behaviour. Update when the deployment guide is next touched. |
| Info | The Visant UI gate was run over `app` + `components`: 3 token findings and 21 chrome-noise findings; copy lint was skipped because it looks under `~/.claude/skills`. | Not fixed in this pass; run the gate per route before a visual redesign. |

## Operational checklist for the Pxxl deploy

1. `SITE_URL=https://www.hisdayspringfamily.org` (checkout success/cancel URLs).
2. `YOUTUBE_CHANNEL_ID=UCsK_cum0IKbuQ75Va8ty0CA` (a handle is rejected by the API;
   the code falls back, but set it correctly).
3. Confirm `BACHS_WEBHOOK_SECRET` is the secret for the production endpoint and
   resend one signed delivery; expect `{"received":true,"handled":true}`.
4. Purge the Pxxl/CDN cache after the deploy — the previous HTML was sent with a
   one-year `s-maxage`.
5. Spot-check `/giving`, `/live` and one ministry page in a private window
   (canonical host, YouTube links, OG image).
