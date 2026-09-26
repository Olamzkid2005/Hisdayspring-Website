# Deployment Guide — Hisdayspring Website

Production deployment to **Pxxl** with the custom domain **hisdayspring.org**.

Current state: Pxxl is **live** at `https://hisdayspring-website.pxxlspace.cv`
(commit `ce495c8`) with sandbox Bachs keys, and both checkout endpoints plus the
webhook signature check are verified there. Vercel serves the same commit at
`https://hisdayspring.vercel.app` as the test mirror. The domain
`hisdayspring.org` still points to `45.43.14.156` (Qservers) — pointing it to
Pxxl **replaces** that site. Make sure the old site has nothing you still need
before continuing.

Tip: verify the full checkout flow on the Pxxl URL before the cutover, then
swap in the `sk_live_...` keys (section 3 + 5). Zero code changes either way —
the key prefix picks the API environment.

---

## 1. Commit & push (required first)

Pxxl builds from GitHub. Nothing ships until `main` is up to date.

```bash
git add -A
git commit -m "feat: production payments (Bachs), pastoral giving, spec compliance, tests"
git push origin main
```

---

## 2. Deploy on Pxxl

Official flow per docs.pxxl.app (`Dashboard > Deploy Project`):

1. Sign in at **pxxl.app** → **Dashboard → Deploy Project**
   (or Projects → Add New → Deploy from GitHub)
2. Connect GitHub if asked, find **Olamzkid2005/Hisdayspring-Website**, click **Import**
3. Configure the project:
   | Field | Value |
   |---|---|
   | Project Domain | `hisdayspring-website` → gives `hisdayspring-website.pxxlspace.cv` |
   | Port Number | **3000** (`next start` reads `PORT`; Pxxl also injects `PORT` and `EXPOSE_PORT`) |
   | GitHub Branch | `main` |
4. **Environment Variables — add BEFORE clicking Deploy** (see section 3).
   The container will start but payments/live APIs return 503 without them.
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
   - Preview environments: enable (for testing future branches)
   - Blue-green deployment: enable if your plan supports it (zero-downtime releases)
8. Click **Deploy Project**, watch **Project → Deployments** and
   **Project → Live Logs** until the build finishes.
9. Verify: `https://hisdayspring-website.pxxlspace.cv` loads the homepage.

### Redeploying — and the env-var trap

Two things bite here, both learned the hard way:

- **Changing an env var does nothing until you rebuild.** Pxxl applies
  variables while it builds the image, so after adding or editing one, open
  **Overview → Redeploy** and wait for the build to go green.
- **A variable is only read if the deployed commit reads it.** Compare the
  commit on the Overview card against `git log --oneline -1` before debugging a
  "still broken" deploy: a fix that is pushed but not deployed looks exactly
  like a fix that does not work.

To redeploy: **Overview → Redeploy → Deploy `<commit>`** (the dialog defaults to
the latest commit on `main`). A clean build takes ~2.5 minutes and the runtime
rolls over with no downtime.

Sanity-check the payment endpoints after every deploy:

```bash
BASE=https://hisdayspring-website.pxxlspace.cv

curl -s -X POST $BASE/api/payments/bachs/initialize \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","amount":1000,"paymentMethod":"card-payment","metadata":{"name":"Test","phone":"+2348077829444","purpose":"tithes","type":"donation"}}'

curl -s -X POST $BASE/api/payments/bachs/book-order/initialize \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"test@example.com","phone":"+2348077829444","paymentMethod":"card-payment","fulfillment":"pickup","items":[{"bookId":"100-days-devotional","quantity":1}]}'
```

Both must return **200** with a `chk_...` id and a `sandbox-checkout.bachs.io`
URL (`checkout.bachs.io` once live keys are in). A **502** means `SITE_URL` is
missing or wrong, or the deployed commit predates the fix.

---

## 3. Environment variables (Pxxl dashboard)

Add these in the Environment Variables panel **before deploying**.

| Variable | Where to get it | Required |
|---|---|---|
| `SITE_URL` | The public site origin **with scheme**, e.g. `https://hisdayspring.org` (or the Pxxl URL pre-cutover). Build into the redirect URLs Bachs is sent — behind Pxxl's proxy the request URL is the internal container address, and Bachs rejects localhost success URLs with a 502. **Required on Pxxl.** | yes |
| `BACHS_SECRET_KEY` | Bachs dashboard → Developer Portal → API keys. `sk_live_...` for production, `sk_sandbox_...` for sandbox | yes (donations) |
| `BACHS_WEBHOOK_SECRET` | Bachs Developer Portal → Webhooks → your endpoint's signing secret | yes (webhooks) |
| `YOUTUBE_API_KEY` | Google Cloud Console → YouTube Data API v3 credential | no (live page degrades gracefully) |
| `YOUTUBE_CHANNEL_ID` | Your YouTube channel ID | no |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `+2348077829444` | no (has default) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name — `hurqcssn` (baked in as default; only set to override) | no |

Rules:
- Never use `NEXT_PUBLIC_` for secrets — anything with that prefix is exposed
  to the browser bundle.
- Rotate keys if they were ever committed or shared.

---

## 4. Point the domain (www.hisdayspring.org)

Pxxl hosts globally with managed SSL; your DNS just needs to point at it.

1. In the Pxxl dashboard, open the project → **Domains** → add both:
   - `hisdayspring.org`
   - `www.hisdayspring.org`
   - Pxxl shows its A-record IP and/or CNAME target — copy those values.
2. Log in to the **Qservers client area**
   (<https://process.qservers.net/clientarea.php>) → **Domains → My Domains** →
   open the dropdown beside `hisdayspring.org` → **Domain DNS Manager**.

   Do **not** change the nameservers (`ns3.qservers.net`, `ns4.qservers.net`,
   `ns3.qserverscloud.com`, `ns4.qserverscloud.com`) — edit the records only.

   Set the two mail rows **first** (see the warning below), then the website
   rows:

   | Type | Name | Value | TTL | Notes |
   |---|---|---|---|---|
   | MX | `@` | `1.qservers.net` | 300 | priority `0` — keeps email alive |
   | CNAME | `mail` | `1.qservers.net` | 300 | keeps `mail.hisdayspring.org` working |
   | A | `@` | **Pxxl's IPv4** (from the Domains panel) | 300 | replaces `45.43.14.156` |
   | CNAME | `www` | Pxxl's CNAME target (e.g. `hisdayspring-website.pxxlspace.cv`) | 300 | |

   Leave `webmail`, `cpanel`, the SPF `TXT` and `_dmarc` alone. A short TTL
   (300) through the cutover makes a rollback take minutes instead of hours.

   **Why the mail rows must change first.** The zone at the last audit was:

   ```
   MX    0 hisdayspring.org.        <- mail follows the apex A record
   A     45.43.14.156               <- Qservers box, also runs Exim 1.qservers.net
   CNAME mail -> hisdayspring.org   <- also follows the apex
   ```

   The mail server and the old website are the **same host**, and MX points at
   the apex rather than at the mail host. Repointing `A @` at Pxxl would send
   `@hisdayspring.org` mail to a server with no mail service, so the church's
   inbox would silently stop receiving. Pin MX and `mail` to `1.qservers.net`,
   confirm with `dig +short hisdayspring.org MX`, and only then move the
   website records.

   Optional hardening: the SPF record contains `+a`, which after the cutover
   would authorise Pxxl's IP to send mail as `hisdayspring.org`. The Qservers
   host is already covered by `ip4:45.43.14.156` and `+mx`, so dropping `+a` is
   safe and tidier.

3. Wait for propagation — usually minutes, up to a few hours.
   Check with:

   ```bash
   dig +short hisdayspring.org A
   dig +short www.hisdayspring.org CNAME
   dig +short hisdayspring.org MX     # must be 1.qservers.net, not hisdayspring.org
   ```

4. SSL certificates are issued automatically by Pxxl once DNS resolves.
   Both `https://hisdayspring.org` and `https://www.hisdayspring.org` must
   serve the site over HTTPS.
5. **After** DNS resolves, update `SITE_URL` to `https://hisdayspring.org` on
   Pxxl and **redeploy** — otherwise Bachs keeps sending buyers back to the old
   `…pxxlspace.cv` host. Then re-point the Bachs webhook (section 5) at the new
   domain.

Note: security headers (including HSTS) activate automatically over HTTPS —
they are already configured in `next.config.ts`.

---

## 5. Payment webhooks (critical)

Card and bank-transfer donations both complete on Bachs' hosted checkout.
Webhook-verified fulfilment needs this:

1. Bachs dashboard → **Developer Portal → Webhooks** → **Add destination**:

   ```
   https://hisdayspring.org/api/payments/bachs/webhook
   ```

2. Subscribe to the **Checkout** and **Payments** events — at minimum
   `collection.succeeded` (the source of truth for fulfilment) and
   `checkout.completed`.

   Until the custom domain is live, point this at whichever host is serving
   production (right now `https://hisdayspring.vercel.app`); switch it to
   `https://hisdayspring.org` immediately after the DNS cutover.

3. Copy the endpoint's **signing secret** into `BACHS_WEBHOOK_SECRET` (section 3).
   Deliveries are signed with HMAC-SHA256 over `"{timestamp}.{raw_body}"` and
   sent as `X-Bachs-Signature-V2`; the route rejects anything unsigned or older
   than 5 minutes.

Note: the donor's thank-you page is driven by a server-side call to
`/api/payments/bachs/verify`, not by the webhook, so a misconfigured webhook
does not break the donor journey — but without it there is no server-side
record of the payment beyond the Bachs dashboard.

### Book ordering (paid online, collected in church)

`/books` has in-site ordering on the same Bachs pipeline: a multi-book cart,
a **Pick up in church** option (buyer shows the payment reference at the
bookstand) and a **PDF** option (download links shown right after payment).
The cart is priced server-side from `data/books.ts` — clients send only book
IDs and quantities.

After paying, Bachs redirects the buyer to `/books/receipt?checkout_id=…` for
**both** fulfillment modes: pickup orders get their bookstand reference, PDF
orders their download links. The receipt verifies the payment server-side
(with retries — Bachs can bounce the buyer back before the checkout session
settles), clears the book cart, and offers a manual **Check again** for bank
transfers that reflect late.

Setup and notes:

1. **PDF delivery** uses Cloudinary. Upload each PDF as
   `books/pdf/<book-id>` (e.g. `books/pdf/made-to-be-whole`) in the
   **raw** uploads folder of the `hurqcssn` cloud. A title whose PDF is not
   uploaded yet gets a polite "not available yet" message at download time —
   no code change needed when the file goes live.
2. **Staff verification**: at the bookstand, open
   `/books/verify`, paste the buyer's reference (or their download-link URL),
   and confirm what was paid before handing over books. It checks the
   checkout against Bachs' API live — no database.
3. **Receipts**: every paid order gets a professional receipt at
   `/books/receipt?checkout_id=<id>` — church logo, order lines, total,
   reference and buyer. Shareable straight to WhatsApp, plus native share,
   copy-link, and a print/save-as-PDF view (site chrome hidden via print
   styles). The receipt URL is stable, so buyers can return to it later.
3. The Bachs webhook endpoint receives book-order `collection.succeeded`
   events too; nothing extra to configure.
4. Download links are per-checkout and re-verified on every request, but
   anyone holding the link can download — same trust model as any download
   link sent by email.

---

## 6. Pastor & Ministerial giving (direct transfer only)

When a donor picks **"Pastor & Ministerial Giving"**, no checkout is created.
The giving page hides the amount/donor form and the card option, and shows the
pastor's own bank account with copy-to-clipboard buttons instead. Bachs has no
subaccount concept, so a card gift cannot be routed to an individual — it would
settle into the church account while the donor believed it reached the pastor.
Transfer-only is the honest option, and it also means the church pays no
processing fee on those gifts.

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
the bank prints it so a donor can match it against their transfer
confirmation.

### Sharing the pastor's account

`https://hisdayspring.org/giving?purpose=pastoral-giving` opens the giving page
with **Pastor & Ministerial Giving** already selected — this is the link to send
to members over WhatsApp or print in a bulletin. Choosing a purpose on the page
writes it back into the address bar, so a URL copied from the browser always
describes what the donor is looking at rather than going stale. Values that are
not real purposes are ignored.

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

1. Apply for the **connect** capability on the Bachs account —
   https://docs.bachs.io/connect/become-a-platform
2. Create a connected account for the pastor and onboard it —
   https://docs.bachs.io/connect/guides/create-an-account
3. Add `transfer_data.destination = <acct_...>` plus either `platform_fee` or
   `transfer_data.amount` to the checkout in
   `app/api/payments/bachs/initialize/route.ts`, resolved server-side from the
   validated purpose only.

Be aware this changes the money model: with a destination charge the church
stays merchant of record, and a refund or lost dispute debits the **church**
balance rather than the pastor's.
See https://docs.bachs.io/connect/split-payments/destination

### Behaviour today (safe by default)

- Pastoral-giving → no checkout at all; the pastor's account is displayed and
  copyable, and the church account card is hidden to prevent wrong-account gifts
- Every other purpose → church account, always
- Client-supplied `transfer_data` / `platform_fee` / subaccount codes → ignored
- Missing or malformed key config → donations fail cleanly (503) instead of
  charging to an unintended destination

---

## 7. Post-launch verification checklist

Run through this after DNS + deploy:

- [ ] Pxxl **Overview shows the latest `main` commit** (`git log --oneline -1`) — a stale commit silently disables every fix
- [ ] `https://hisdayspring.org` and `https://www.hisdayspring.org` load over HTTPS (no cert warnings)
- [ ] Both checkout endpoints on the live domain return 200 with a `chk_...` id (commands in section 2)
- [ ] All nav pages render: `/pastors`, `/giving`, `/books`, `/radio`, `/live`, `/welfare`, `/crusade`, `/testimonials`, `/prayer`, `/privacy`, `/ministries/yofic`
- [ ] `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/.well-known/security.txt`, `/site.webmanifest` all return 200
- [ ] Browser tab shows the church logo favicon; `curl -I https://hisdayspring.org` shows `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`
- [ ] Donate ₦100 via **card** → complete on the Bachs checkout → confirm it appears in the Bachs dashboard
- [ ] Donate ₦100 via **bank transfer** → complete on the Bachs checkout → same check
- [ ] Return from checkout → thank-you card shows, and the URL no longer carries `checkout_id`
- [ ] Hand-edit `?checkout_id=fake` on `/giving` → page reports it could not confirm (never shows a thank-you)
- [ ] Pick **Pastor & Ministerial Giving** → the online form disappears, the pastor's account (Access/Diamond `0025053293`) shows, and both **Copy** buttons put the right text on the clipboard over HTTPS
- [ ] Open `/giving?purpose=pastoral-giving` directly → it lands on the pastor's account without any clicking, and the address bar keeps the selection when another purpose is chosen
- [ ] Order a book on `/books` (₦100 min title works) → pay → reference shows → `/books/verify` confirms it at the bookstand
- [ ] Pick **PDF** fulfillment → download link serves a file after payment; a hand-edited `?checkout_id=fake` link is refused
- [ ] Bachs webhook: Developer Portal → Webhooks → send a test → 200 response in Pxxl Live Logs
- [ ] `/live` shows the stream status with the production `YOUTUBE_API_KEY`
- [ ] Prayer request form opens WhatsApp with the message prefilled
- [ ] Contact form opens the donor's email client (mailto)
- [ ] Run a Lighthouse audit against the live domain (see section 8)

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
error, open `http://localhost:3000` in a normal Chrome window first (accept any
local-server warning), then rerun the command.

Targets: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

---

## 9. Known follow-ups (not blockers)

- **4 lint warnings** (`<img>` in `app/radio`, `app/books`,
  `SermonsSection` ×2) — YouTube thumbnails / background images; harmless.
- **Update `public/.well-known/security.txt` `Expires:` field yearly**.
- **`security.txt` contact** — currently `hello@hisdayspring.org`; consider a
  dedicated `security@hisdayspring.org` later.
- **Cloudinary free tier** — 25 credits/mo ≈ 25 GB transformations + 25 GB
  bandwidth. Current usage fits comfortably; if the site outgrows it, upgrade
  or add a custom CDN domain in the Cloudinary dashboard.
- **Local dev images**: `public/images/` is no longer in git. The site pulls
  everything from Cloudinary, so no local copies are needed. If you ever need
  the originals: `~/Downloads/FOR WEBSITE` (camera masters) and
  `~/Documents/Hisdayspring-Website-git-backup.git` (full pre-migration git
  mirror). Re-download from Cloudinary or re-run
  `node scripts/upload-images-to-cdn.mjs` (it skips already-uploaded files via
  `.cdn-uploads.json`).

---

## Rollback

If a deploy misbehaves:

1. Pxxl Dashboard → Project → **Deployments** → open the previous good deploy → **Redeploy/Rollback**
2. Domain/DNS problems: revert the Qservers `A @` record to `45.43.14.156` (old host) — propagates in minutes. **Leave MX pointed at `1.qservers.net`** either way; that is what keeps email working
3. Payment problems: pastoral giving is transfer-only and never touches Bachs, so it keeps working; for a full freeze of the online checkout, remove `BACHS_SECRET_KEY` on Pxxl (donations return a clean 503 message instead of charging)
