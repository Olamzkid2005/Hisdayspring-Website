# Deployment Guide — Hisdayspring Website

Production deployment to **Pxxl** at **https://www.hisdayspringfamily.org**.

Current state (checked 8 November 2026):

- Pxxl builds `main` automatically and serves the production domain. The
  project's own URL is still `https://hisdayspring-website.pxxlspace.cv`.
- `www.hisdayspringfamily.org` is canonical. The apex
  `hisdayspringfamily.org` also answers 200 with no redirect (open follow-up).
- `hisdayspring.org` is **not** this site. It is the old WordPress
  installation on Qservers (`45.43.14.156`) and it still runs the church
  mailbox. `www.hisdayspring.org` 301s to that apex. Leave that zone alone —
  see §4.
- The former Vercel mirror (`hisdayspring.vercel.app`) is retired.

Tip: test checkout on the preview host before swapping in live Bachs keys, then
set `sk_live_...`. Zero code changes — the key prefix picks the API
environment.

---

## 1. Commit & push (required first)

Pxxl builds from GitHub. Nothing ships until `main` is up to date.

```bash
git add -A
git commit -m "feat: describe the change"
git push origin main
```

---

## 2. Deploy on Pxxl

Official flow per docs.pxxl.app (`Dashboard > Deploy Project`):

1. Sign in at **pxxl.app** → **Dashboard → Deploy Project**
   (or Projects → Add New → Deploy from GitHub).
2. Connect GitHub if asked, find **Olamzkid2005/Hisdayspring-Website**, click
   **Import**.
3. Configure the project:

   | Field | Value |
   |---|---|
   | Project Domain | `hisdayspring-website` → `hisdayspring-website.pxxlspace.cv` (preview) |
   | Custom domain | `www.hisdayspringfamily.org` (production, §4) |
   | Port Number | **3000** (`next start` reads `PORT`; Pxxl also injects `PORT` and `EXPOSE_PORT`) |
   | GitHub Branch | `main` |

4. **Environment Variables — add BEFORE clicking Deploy** (see §3). The
   container starts without them, but payments and live status return 503.
5. **Additional Build Settings** (auto-detect should handle this; verify):

   | Setting | Value |
   |---|---|
   | Install command | `npm ci` |
   | Build command | `npm run build` |
   | Start command | `npm start` |
   | Runtime version | Node 26 (locked by Pxxl — the `node-npm:26` buildpack pins it) |
   | Package manager | npm |

6. **Server and Scaling**: the default tier is fine — images are served from
   the Cloudinary CDN, not the app. Enable **Build cache**.
7. **Advanced Options**:
   - Auto-deploy on push: **enable** (deploys every push to `main`)
   - Preview environments: enable if you want branch previews
   - Blue-green deployment: enable if your plan supports it
8. Click **Deploy Project**, watch **Project → Deployments** and
   **Project → Live Logs** until the build finishes.
9. Verify the preview host, then the production domain:

   ```bash
   curl -sI https://www.hisdayspringfamily.org | head -1          # 200
   curl -s https://www.hisdayspringfamily.org | grep -o '<link rel="canonical"[^>]*>'
   # <link rel="canonical" href="https://www.hisdayspringfamily.org"/>
   ```

### Redeploying — and the env-var trap

Two things bite here, both learned the hard way:

- **Changing a build-time env var does nothing until you rebuild.** Pxxl
  applies variables while it builds the image, so after adding or editing one,
  open **Overview → Redeploy** and wait for the build to go green. `SITE_URL` is
  read at request time, but `NEXT_PUBLIC_SITE_URL` (and therefore canonicals,
  sitemap, robots and JSON-LD) is fixed at build time.
- **A variable is only read if the deployed commit reads it.** Compare the
  commit on the Overview card against `git log --oneline -1` before debugging a
  "still broken" deploy.

To redeploy: **Overview → Redeploy → Deploy `<commit>`**. A clean build takes
~2.5 minutes and the runtime rolls over with no downtime.

After every deploy, **purge the HTML cache**. The site is served with
`Cache-Control: s-maxage=31536000`, so a stale copy can survive a release:

```bash
curl -sI https://www.hisdayspringfamily.org | grep -i cache-control
# cache-control: s-maxage=31536000
# purge via Pxxl's cache control, or redeploy with a fresh route generation
```

Sanity-check the payment endpoints after every deploy:

```bash
BASE=https://www.hisdayspringfamily.org

curl -s -X POST $BASE/api/payments/bachs/initialize \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","amount":1000,"paymentMethod":"card-payment","metadata":{"name":"Test","phone":"+2348077829444","purpose":"tithes","type":"donation"}}'

curl -s -X POST $BASE/api/payments/bachs/book-order/initialize \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"test@example.com","phone":"+2348077829444","paymentMethod":"card-payment","fulfillment":"pickup","items":[{"bookId":"100-days-devotional","quantity":1}]}'
```

Both must return **200** with a `chk_...` id and a
`sandbox-checkout.bachs.io` URL (`checkout.bachs.io` once live keys are in).
A **502** means `SITE_URL` is missing or wrong, or the deployed commit predates
the fix.

---

## 3. Environment variables (Pxxl dashboard)

Add these in the Environment Variables panel **before deploying**.

| Variable | Value / where to get it | Required |
|---|---|---|
| `SITE_URL` | `https://www.hisdayspringfamily.org` — the public origin **with scheme**, read at runtime for Bachs `success_url`/`cancel_url` and receipt links. Behind Pxxl's proxy `request.url` is the internal container address, and Bachs rejects a non-public success URL with a 502. | yes |
| `NEXT_PUBLIC_SITE_URL` | Same origin, or leave unset (the default in `lib/site.ts` is already correct). Read at **build time** for canonicals, sitemap, robots and JSON-LD. Set it only when a preview build must point at itself. | no |
| `BACHS_SECRET_KEY` | Bachs dashboard → Developer Portal → API keys. `sk_live_...` for production, `sk_sandbox_...` for sandbox. | yes (donations) |
| `BACHS_WEBHOOK_SECRET` | Bachs Developer Portal → Webhooks → the production endpoint's signing secret. | yes (webhooks) |
| `YOUTUBE_API_KEY` | Google Cloud Console → YouTube Data API v3 credential. `/live` degrades gracefully without it. | no |
| `YOUTUBE_CHANNEL_ID` | `UCsK_cum0IKbuQ75Va8ty0CA`. A handle (`@Dayspring_Family`) is rejected by the API; the code falls back to this id, but set it correctly. | no |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Cloud Console; map embed on the contact section. | no |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `+2348077829444` (has a default). | no |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `hurqcssn` is baked in as the default; set only to override. | no |

Leave `BACHS_API_BASE_URL` and `ALLOW_SANDBOX_PAYMENTS_IN_PRODUCTION` unset in
production; both exist for local/sandbox work. `CLOUDINARY_API_KEY` and
`CLOUDINARY_API_SECRET` are only used by the upload scripts, not by the running
site.

Rules:

- Never use `NEXT_PUBLIC_` for secrets — anything with that prefix is inlined
  into the browser bundle.
- Rotate keys if they were ever committed or shared.
- Live and sandbox Bachs destinations have **different** signing secrets. Pair
  a live secret key with a live signing secret in the same deploy, or every
  delivery is rejected with 401.

---

## 4. Domains and DNS

Two separate domains, deliberately:

| Domain | Points at | Serves |
|---|---|---|
| `www.hisdayspringfamily.org` | Pxxl (`193.181.208.160`, via `www` CNAME → apex) | this Next.js site, canonical |
| `hisdayspringfamily.org` | same Pxxl edge | the same site, non-canonical (open follow-up) |
| `hisdayspring.org` | Qservers `45.43.14.156` | the old WordPress site **and the church mailbox** |
| `www.hisdayspring.org` | CNAME to `hisdayspring.org` (301) | the old WordPress site |

DNS for `hisdayspringfamily.org` is managed at `ns1/ns2.dyna-ns.net`; records:

```
A      @     193.181.208.160        (Pxxl — confirm in the Domains panel)
CNAME  www   hisdayspringfamily.org
```

### Do not repoint the old domain

`hisdayspring.org` still resolves to the Qservers box, whose zone is:

```
MX    0  hisdayspring.org.     <- mail follows the apex A record
A       45.43.14.156           <- same host runs the website and Exim
CNAME   mail -> hisdayspring.org
```

Moving the apex A record to Pxxl would send `@hisdayspring.org` mail to a host
with no mail service, silently killing the church inbox. If the church ever
wants the old domain redirected here, migrate mail first:

1. Create the mailbox on a mail provider that is not tied to the web host.
2. Point `MX` (and `SPF`/`DKIM`/`DMARC`) at it and confirm delivery.
3. Only then add the domain in Pxxl and point `A @` at Pxxl.

Until then, leave the entire `hisdayspring.org` zone untouched. It is a
different website, not a redirect target.

### Adding or changing the production domain

1. Pxxl dashboard → project → **Domains** → add `hisdayspringfamily.org` and
   `www.hisdayspringfamily.org`; copy the A/CNAME values Pxxl shows.
2. Update the DNS records above (TTL 300 during changes).
3. Wait for propagation, then confirm both hosts serve HTTPS with a valid
   certificate:

   ```bash
   dig +short hisdayspringfamily.org A
   dig +short www.hisdayspringfamily.org CNAME
   curl -sI https://www.hisdayspringfamily.org | head -1
   ```

4. Update `SITE_URL` (and `NEXT_PUBLIC_SITE_URL` if it was set) and
   **redeploy** — otherwise Bachs keeps sending buyers to the old host and
   canonicals keep advertising it.
5. Re-point the Bachs webhook (§5) and resend one signed test delivery.
6. Purge the HTML cache.

**Open follow-up:** the apex and `www` both answer 200 and neither redirects.
Pick `www` (what the canonicals use) and add an apex→www redirect at the host
when Pxxl supports it, or at the DNS/proxy layer.

Security headers (HSTS, `X-Frame-Options`, `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy`) are configured in `next.config.ts` and
activate over HTTPS automatically.

---

## 5. Payment webhooks (critical)

Card and bank-transfer donations both complete on Bachs' hosted checkout.
Webhook-verified fulfilment needs this:

1. Bachs dashboard → **Developer Portal → Webhooks** → **Add destination**:

   ```
   https://www.hisdayspringfamily.org/api/payments/bachs/webhook
   ```

2. Subscribe to the **Checkout** and **Payments** events — at minimum
   `collection.succeeded` (the source of truth for fulfilment) and
   `checkout.completed`.
3. Copy the endpoint's **signing secret** into `BACHS_WEBHOOK_SECRET` (§3).
   Deliveries are signed with HMAC-SHA256 over `"{timestamp}.{raw_body}"` and
   sent as `X-Bachs-Signature-V2`; the route rejects anything unsigned or older
   than 5 minutes.

The donor's thank-you page is driven by a server-side call to
`/api/payments/bachs/verify`, not by the webhook, so a misconfigured webhook
does not break the donor journey — but without it there is no server-side
record of the payment beyond the Bachs dashboard. Nothing is persisted in this
project: there is no database or queue, so webhook events do not create donor
receipts, reconciliation records or fulfilment jobs yet.

### Book ordering (paid online, collected in church)

`/books` has in-site ordering on the same Bachs pipeline: a multi-book cart,
a **Pick up in church** option (the buyer shows the payment reference at the
bookstand) and a **PDF** option (download links shown right after payment).
The cart is priced server-side from `data/books.ts` — clients send only book
IDs and quantities.

After paying, Bachs redirects the buyer to `/books/receipt?checkout_id=…` for
**both** fulfilment modes: pickup orders get their bookstand reference, PDF
orders their download links. The receipt verifies the payment server-side (with
retries — Bachs can bounce the buyer back before the checkout session settles),
clears the book cart, and offers a manual **Check again** for bank transfers
that reflect late.

Setup and notes:

1. **PDF delivery** uses Cloudinary. Upload each PDF as
   `books/pdf/<book-id>` (e.g. `books/pdf/made-to-be-whole`) in the **raw**
   uploads folder of the `hurqcssn` cloud. A title whose PDF is not uploaded yet
   gets a polite "not available yet" message at download time — no code change
   needed when the file goes live.
2. **Staff verification**: at the bookstand, open `/books/verify`, paste the
   buyer's reference (or their download-link URL), and confirm what was paid
   before handing over books. It checks the checkout against Bachs' API live —
   no database.
3. **Receipts**: every paid order gets a receipt at
   `/books/receipt?checkout_id=<id>` — church logo, order lines, total,
   reference and buyer. Shareable straight to WhatsApp, plus native share,
   copy-link, and a print/save-as-PDF view (site chrome hidden via print
   styles). The URL is stable, so buyers can return to it later.
4. Download links are per-checkout and re-verified on every request, but anyone
   holding the link can download — the same trust model as any download link
   sent by email.
5. The Bachs webhook receives book-order `collection.succeeded` events too;
   nothing extra to configure.

---

## 6. Pastor & Ministerial giving (direct transfer only)

When a donor picks **"Pastor & Ministerial Giving"**, no checkout is created.
The giving page hides the amount/donor form and the card option, and shows the
pastor's own bank account with copy-to-clipboard buttons instead. Bachs has no
subaccount concept, so a card gift cannot be routed to an individual — it would
settle into the church account while the donor believed it reached the pastor.
Transfer-only is the honest option, and the church pays no processing fee on
those gifts.

### The pastor's account

`pastoralGivingAccount` in `data/donations.ts` is the single source for what
donors are shown:

```ts
export const pastoralGivingAccount: BankAccount = {
  bankName: "Access (Diamond Bank)",
  accountNumber: "0025053293",
  accountName: "BLESSING PHILIP OLAMIJULO",
};
```

Change the account there, not in the page. The account name is kept exactly as
the bank prints it so a donor can match it against their transfer confirmation.

### Sharing the pastor's account

`https://www.hisdayspringfamily.org/giving?purpose=pastoral-giving` opens the
giving page with **Pastor & Ministerial Giving** already selected — this is the
link to send to members over WhatsApp or print in a bulletin. Choosing a purpose
on the page writes it back into the address bar, so a URL copied from the
browser always describes what the donor is looking at rather than going stale.
Values that are not real purposes are ignored.

Both copy buttons (`Copy account number`, `Copy bank details`) and the
per-account buttons in the church details card read straight from this data, so
nothing else needs changing. **Copy bank details** copies bank name, account
name and account number as three lines, so a donor can paste it into a chat
message without retyping anything.

### If the church later wants pastoral gifts paid out online

That needs the platform **connect** capability (which irreversibly converts the
Bachs account from individual to company), a connected account created and
onboarded for the pastor, and a checkout naming `transfer_data.destination` —
all recorded here so the option is not rediscovered from scratch:

1. Apply for the **connect** capability — https://docs.bachs.io/connect/become-a-platform
2. Create a connected account for the pastor and onboard it — https://docs.bachs.io/connect/guides/create-an-account
3. Add `transfer_data.destination = <acct_...>` plus either `platform_fee` or
   `transfer_data.amount` to the checkout in
   `app/api/payments/bachs/initialize/route.ts`, resolved server-side from the
   validated purpose only.

Be aware this changes the money model: with a destination charge the church
stays merchant of record, and a refund or lost dispute debits the **church**
balance rather than the pastor's.
See https://docs.bachs.io/connect/split-payments/destination

### Behaviour today (safe by default)

- Pastoral giving → no checkout at all; the pastor's account is displayed and
  copyable, and the church account card is hidden to prevent wrong-account gifts
- Every other purpose → church account, always
- Client-supplied `transfer_data` / `platform_fee` / subaccount codes → ignored
- Missing or malformed key config → donations fail cleanly (503) instead of
  charging to an unintended destination

---

## 7. Post-launch verification checklist

Run through this after a deploy:

- [ ] Pxxl **Overview shows the latest `main` commit** (`git log --oneline -1`) — a stale commit silently disables every fix
- [ ] `https://www.hisdayspringfamily.org` loads over HTTPS (no cert warnings), and every page emits `<link rel="canonical" href="https://www.hisdayspringfamily.org…">`
- [ ] `/sitemap.xml` and `/robots.txt` use the same host; the sitemap lists `/live`, `/prayer`, `/testimonials` and one copy each of `/welfare` and `/crusade`
- [ ] The HTML cache was purged after the deploy (`Cache-Control: s-maxage=31536000`)
- [ ] Both checkout endpoints on the live domain return 200 with a `chk_...` id (commands in §2)
- [ ] All nav pages render: `/pastors`, `/giving`, `/books`, `/radio`, `/live`, `/welfare`, `/crusade`, `/testimonials`, `/prayer`, `/privacy`, `/terms`, `/ministries/yofic`
- [ ] `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/.well-known/security.txt`, `/site.webmanifest` all return 200
- [ ] Browser tab shows the church logo favicon; `curl -I https://www.hisdayspringfamily.org` shows `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and **no** `X-Powered-By`
- [ ] Donate ₦100 via **card** → complete on the Bachs checkout → confirm it appears in the Bachs dashboard
- [ ] Donate ₦100 via **bank transfer** → complete on the Bachs checkout → same check
- [ ] Return from checkout → thank-you card shows, and the URL no longer carries `checkout_id`
- [ ] Hand-edit `?checkout_id=fake` on `/giving` → page reports it could not confirm (never shows a thank-you)
- [ ] Pick **Pastor & Ministerial Giving** → the online form disappears, the pastor's account (Access/Diamond `0025053293`) shows, and both **Copy** buttons put the right text on the clipboard over HTTPS
- [ ] Open `/giving?purpose=pastoral-giving` directly → it lands on the pastor's account without any clicking
- [ ] Order a book on `/books` (₦100 min title works) → pay → reference shows → `/books/verify` confirms it at the bookstand
- [ ] Pick **PDF** fulfilment → download link serves a file after payment; a hand-edited `?checkout_id=fake` link is refused
- [ ] Bachs webhook: Developer Portal → Webhooks → send a test → 200 in Pxxl Live Logs
- [ ] `/live` shows stream status with the production `YOUTUBE_API_KEY`
- [ ] Every YouTube link points at `@Dayspring_Family` (the old `@hisdayspring` handle is 404)
- [ ] Prayer request form opens WhatsApp with the message prefilled
- [ ] Contact form opens the visitor's email client (mailto)
- [ ] `hisdayspring.org` still serves the old WordPress site and `hello@hisdayspring.org` still receives mail (this deploy must not have touched it)
- [ ] Run a Lighthouse audit against the live domain (§8)

---

## 8. Local Lighthouse audit (optional)

```bash
npm run build
npm start                                    # serves on :3000
npx --yes lighthouse http://localhost:3000 \
  --output=html --output-path=./lighthouse.html \
  --chrome-flags="--headless=new --no-sandbox" \
  --only-categories=performance,accessibility,best-practices,seo
open ./lighthouse.html
```

Requires local Chrome. If the headless run fails with a Chrome interstitial
error, open `http://localhost:3000` in a normal Chrome window first, then rerun.

Targets: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

---

## 9. Known follow-ups (not blockers)

- **Production dependency advisories.** `npm audit --omit=dev` reports 3
  (Next 16.3.6 in the critical advisory range 16.0.0–16.4.0, `sharp` high,
  `source-map-js` high). Upgrade and re-run build/tests before the next payment
  release. Tracked in [AUDIT.md](AUDIT.md).
- **3 lint warnings** — `<img>` for YouTube thumbnails in `SermonsSection`
  (×2) and one unused variable in `scripts/upload-images-to-cdn.mjs`.
  `npm run lint` exits 0.
- **Pxxl's dependency scan lists packages that are not ours.** The build log
  flags `tar`, `brace-expansion`, `ip-address`, `undici` and the Alpine trio
  `openssl`/`libssl3`/`libcrypto3`. They come from Pxxl's Node 26/npm buildpack
  and builder image, not from this repo (e.g. `ip-address` appears nowhere in
  `package-lock.json`, and the reported versions match neither our lock nor our
  installed tree). Ask Pxxl to refresh their buildpack if a clean scan is
  required.
- **Apex and `www` both answer 200.** Pick `www` and redirect the apex at the
  host (§4).
- **HTML is cached for a year** (`s-maxage=31536000`) while the homepage
  filters events by the current date. An event can outlive its end date until
  the next purge; purge on every deploy and consider a shorter lifetime or ISR.
- **Cookie consent is not wired to third parties.** Analytics and the YouTube /
  Maps embeds load before a choice; see AUDIT.md.
- **Update `public/.well-known/security.txt` `Expires:` yearly** (currently
  2027-12-31).
- **`security.txt` contact** — currently `hello@hisdayspring.org`; consider a
  dedicated `security@hisdayspring.org` later. Email is still hosted on the
  legacy domain, so this address is intentional.
- **Cloudinary free tier** — 25 credits/mo ≈ 25 GB transformations + 25 GB
  bandwidth. Current usage fits; upgrade or add a custom CDN domain if it grows.
- **Local dev images** — `public/images/` is not in git; the site pulls from
  Cloudinary. Originals: `~/Downloads/FOR WEBSITE` (camera masters) and
  `~/Documents/Hisdayspring-Website-git-backup.git` (pre-migration mirror).
  Re-upload with `node scripts/upload-images-to-cdn.mjs` (it skips uploaded
  files via `.cdn-uploads.json`).

---

## Rollback

If a deploy misbehaves:

1. Pxxl Dashboard → Project → **Deployments** → open the previous good deploy →
   **Redeploy/Rollback**.
2. Purge the HTML cache, otherwise visitors keep the bad copy for the
   year-long `s-maxage`.
3. Domain/DNS problems: the production domain is separate from the legacy
   `hisdayspring.org` zone, so there is nothing to revert there — do not touch
   the old zone's `A`/`MX` records, they keep the old site and the church email
   alive.
4. Payment problems: pastoral giving is transfer-only and never touches Bachs,
   so it keeps working. For a full freeze of online checkout, remove
   `BACHS_SECRET_KEY` on Pxxl and redeploy — donations return a clean 503
   instead of charging.
