/**
 * The public origin of the site.
 *
 * The church moved to hisdayspringfamily.org; the old hisdayspring.org host no
 * longer serves this site (it answers 406), so a canonical or sitemap entry
 * pointing there sends crawlers to a dead page. Everything that emits an
 * absolute URL for humans or crawlers reads this constant.
 *
 * NEXT_PUBLIC_SITE_URL lets a preview build point at itself. It is read at
 * build time, which is when metadata, the sitemap and robots are rendered.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  "https://www.hisdayspringfamily.org"
).replace(/\/+$/, "");
