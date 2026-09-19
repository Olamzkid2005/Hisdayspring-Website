import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      // Explicit AI-crawler policy (specification.website: robots.txt for AI
      // crawlers). Search + feeding allowed; training disallowed by default.
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
    sitemap: "https://hisdayspring.org/sitemap.xml",
  };
}
