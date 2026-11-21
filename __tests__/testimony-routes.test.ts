/**
 * Testimonies and the testimony form are one page, so every path that used to
 * point at the form has to keep resolving — the church printed QR material
 * against /testify before the pages were merged.
 *
 * Checked against the real `next.config.ts` rather than a copy of the list: a
 * redirect that only exists in a test is worthless.
 */

import nextConfig from "../next.config";

describe("testimony route redirects", () => {
  it("sends the old form path and every near-miss to the merged page", async () => {
    const redirects = (await nextConfig.redirects?.()) ?? [];
    const bySource = new Map(redirects.map((rule) => [rule.source, rule.destination]));

    for (const source of [
      "/testify",
      "/testimonies",
      "/testimony",
      "/share-testimony",
      "/submit-testimony",
    ]) {
      expect(bySource.get(source)).toBe("/testimonials");
    }
  });

  it("never redirects the merged page itself", async () => {
    const redirects = (await nextConfig.redirects?.()) ?? [];

    expect(redirects.map((rule) => rule.source)).not.toContain("/testimonials");
  });
});
