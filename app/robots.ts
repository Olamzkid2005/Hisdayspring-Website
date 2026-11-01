import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Do not block /_next/: crawlers need the JS/CSS to render the page.
        disallow: ["/api/"],
      },
      // Explicit AI-crawler policy: search and live fetching are allowed;
      // bulk training crawlers (Google-Extended, CCBot, Bytespider) are not.
      {
        userAgent: ["GPTBot"],
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: ["ClaudeBot", "anthropic-ai"],
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: ["Google-Extended", "CCBot", "Bytespider"],
        disallow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
