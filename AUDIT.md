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
