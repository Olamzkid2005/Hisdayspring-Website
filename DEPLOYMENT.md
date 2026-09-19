# Deployment Guide — Hisdayspring Website

Production deployment to **Pxxl** with the custom domain **hisdayspring.org**.

Current state: all code changes are local and uncommitted. The domain
`hisdayspring.org` currently points to `45.43.14.156` (Qservers) — pointing it
to Pxxl **replaces** that site. Make sure the old site has nothing you still
need before continuing.

---

## 1. Commit & push (required first)

Pxxl builds from GitHub. Nothing ships until `main` is up to date.

```bash
git add -A
git commit -m "feat: production payments, pastoral giving, spec compliance, tests"
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
   | Project Domain | `hisdayspring` → gives `hisdayspring.pxxl.pro` |
   | Port Number | **3000** (`next start` reads `PORT`) |
   | GitHub Branch | `main` |
4. **Environment Variables — add BEFORE clicking Deploy** (see section 3).
   The container will start but payments/live APIs return 503 without them.
5. **Additional Build Settings** (auto-detect should handle this; verify):
   | Setting | Value |
   |---|---|
   | Install command | `npm ci` |
   | Build command | `npm run build` |
   | Start command | `npm start` |
   | Runtime version | Node 20+ |
   | Package manager | npm |
6. **Server and Scaling**: the default tier is fine — images are served from
   the Cloudinary CDN, not the app. Enable **Build cache**.
7. **Advanced Options**:
   - Auto-deploy on push: **enable** (deploys every push to `main`)
   - Preview environments: enable (for testing future branches)
   - Blue-green deployment: enable if your plan supports it (zero-downtime releases)
8. Click **Deploy Project**, watch **Project → Deployments** and
   **Project → Live Logs** until the build finishes.
9. Verify: `https://hisdayspring.pxxl.pro` loads the homepage.

---

## 3. Environment variables (Pxxl dashboard)

Add these in the Environment Variables panel **before deploying**.

| Variable | Where to get it | Required |
|---|---|---|
| `PAYSTACK_SECRET_KEY` | Paystack Dashboard → Settings → API Keys → Secret Key (`sk_live_...`) | yes (payments) |
| `FLUTTERWAVE_SECRET_KEY` | Flutterwave Dashboard → Settings → API → Secret Key | yes (payments) |
| `FLUTTERWAVE_SECRET_HASH` | Flutterwave Dashboard → Settings → Webhooks → create a hash yourself, paste the same value here | yes (webhooks) |
| `YOUTUBE_API_KEY` | Google Cloud Console → YouTube Data API v3 credential | no (live page degrades gracefully) |
| `YOUTUBE_CHANNEL_ID` | Your YouTube channel ID | no |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `+2348077829444` | no (has default) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name — `hurqcssn` (baked in as default; only set to override) | no |
| `PASTORAL_PAYSTACK_SUBACCOUNT` | Paystack subaccount code (`ACCT_...`) — see section 6 | optional |
| `PASTORAL_FLUTTERWAVE_SUBACCOUNT_ID` | Flutterwave subaccount ID — see section 6 | optional |

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
2. Log in to **Qservers** (your DNS/ns provider: `ns3.qservers.net` etc.)
   and edit DNS for `hisdayspring.org`:

   | Type | Name | Value | TTL | Notes |
   |---|---|---|---|---|
   | A | `@` | **Pxxl's IPv4** (from dashboard) | 3600 | replaces `45.43.14.156` |
   | CNAME | `www` | `hisdayspring.pxxl.pro` | 3600 | |

3. Wait for propagation — usually minutes, up to a few hours.
   Check with:

   ```bash
   dig +short hisdayspring.org A
   dig +short www.hisdayspring.org CNAME
   ```

4. SSL certificates are issued automatically by Pxxl once DNS resolves.
   Both `https://hisdayspring.org` and `https://www.hisdayspring.org` must
   serve the site over HTTPS.

Note: security headers (including HSTS) activate automatically over HTTPS —
they are already configured in `next.config.ts`.

---

## 5. Payment webhooks (critical)

Card payments work without this, but webhook-verified payments (and the
Paystack "pay with transfer" flow) need it:

1. **Paystack** Dashboard → Settings → API Keys & Webhooks → Webhook URL:

   ```
   https://hisdayspring.org/api/payments/paystack/webhook
   ```

2. **Flutterwave** Dashboard → Settings → Webhooks → Webhook URL:

   ```
   https://hisdayspring.org/api/payments/flutterwave/webhook
   ```

   Paste the **same secret hash** you set in `FLUTTERWAVE_SECRET_HASH` (section 3).

---

## 6. Pastor & Ministerial giving (money routing)

When a donor picks **"Pastor & Ministerial Giving"**, card payments settle
into the **pastor's own account** via gateway subaccounts. Everything else
goes to the church account. Routing is resolved server-side from the purpose —
clients cannot influence it (tested in `__tests__/pastoral-routing.test.ts`).

### One-time gateway setup

1. **Paystack** Dashboard → Subaccounts → Create subaccount:
   - Business name: pastor's name
   - Bank + account number: **the pastor's account**
   - Percentage charge: **0** (so 100% of the gift settles to the pastor)
   - Copy the subaccount code: `ACCT_xxxxxxxxxxxx`
2. **Flutterwave** Dashboard → create the subaccount for the pastor,
   copy its ID (e.g. `RS_...`).

### Wire the codes

Either add the env vars on Pxxl (preferred — no code change, survives red

```
PASTORAL_PAYSTACK_SUBACCOUNT=ACCT_xxxxxxxxxxxx
PASTORAL_FLUTTERWAVE_SUBACCOUNT_ID=RS_xxxxxxxxxx
```

…or paste them into `data/donations.ts`:

```ts
export const PASTORAL_PAYSTACK_SUBACCOUNT = "ACCT_xxxxxxxxxxxx";
export const PASTORAL_FLUTTERWAVE_SUBACCOUNT_ID = "RS_xxxxxxxxxx";
```

Env vars win over the data file if both are set.

### Bank-transfer display

While `pastoralGivingAccount` in `data/donations.ts` is `null`, bank-transfer
donors see the church accounts. To show the **pastor's account** for
"Pastor & Ministerial Giving" transfers, fill it in:

```ts
export const pastoralGivingAccount: BankAccount | null = {
  bankName: "GTBank",
  accountNumber: "0123456789",
  accountName: "Pastor Blessing Olamijulo",
};
```

### Fallback behaviour (safe by default)

- Subaccount configured + pastoral purpose → pastor's account
- Subaccount **not** configured + pastoral purpose → church account (no failure)
- Any non-pastoral purpose → church account, always
- Malformed/invalid code in config → ignored, church account

---

## 7. Post-launch verification checklist

Run through this after DNS + deploy:

- [ ] `https://hisdayspring.org` and `https://www.hisdayspring.org` load over HTTPS (no cert warnings)
- [ ] All nav pages render: `/pastors`, `/giving`, `/books`, `/radio`, `/live`, `/welfare`, `/crusade`, `/testimonials`, `/prayer`, `/privacy`, `/ministries/yofic`
- [ ] `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/.well-known/security.txt`, `/site.webmanifest` all return 200
- [ ] Browser tab shows the church logo favicon; `curl -I https://hisdayspring.org` shows `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`
- [ ] Donate ₦100 via **Paystack card** → complete on checkout → confirm it appears in the Paystack dashboard
- [ ] Donate ₦100 via **Flutterwave** → same check
- [ ] Pick **Pastor & Ministerial Giving** + card → verify in the gateway dashboard the transaction is **split to the pastor's subaccount**
- [ ] Pick **Bank Transfer** → account details screen shows, page does NOT hang (success card must be visible over the background)
- [ ] Paystack webhook: dashboard → Webhooks → send test → 200 response in Pxxl Live Logs
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
2. Domain/DNS problems: revert the Qservers A record to `45.43.14.156` (old host) — propagates in minutes
3. Payment problems: pastoral routing already fails safe to the church account; for a full freeze, remove `PAYSTACK_SECRET_KEY` on Pxxl (donations return a clean 503 message instead of charging)
