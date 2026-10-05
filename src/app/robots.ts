import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

// Served at /robots.txt.
// /admin and /api are blocked from crawling. /account pages are NOT blocked here on purpose:
// they carry a noindex meta tag, and Google can only honor noindex if it is allowed to crawl
// the page. Only the tokenized setup link is blocked.
export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin/", "/api/", "/account/setup"] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
