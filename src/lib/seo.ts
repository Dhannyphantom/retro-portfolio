import type { Metadata } from "next";
import { getSiteSettings, type SiteSettingsData } from "@/lib/settings";

/** Canonical origin of the site. Set NEXT_PUBLIC_SITE_URL in production (e.g. https://jenom-dev.vercel.app). */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
    "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

export function absoluteUrl(path = "/") {
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Generated fallback image (src/app/opengraph-image.tsx) used when no share image is uploaded in /admin/profile. */
export const DEFAULT_OG_PATH = "/opengraph-image";

type PageMetaInput = {
  title: string;
  description?: string;
  /** Path of the page, e.g. "/projects". Used for the canonical URL and og:url. */
  path: string;
  image?: string;
  noindex?: boolean;
};

/**
 * Builds a complete Metadata object for a page. Next.js replaces (not merges) nested
 * openGraph/twitter objects from the layout, so each page must supply them in full.
 * The title gets the "| Name" suffix from the layout's title template.
 */
export async function buildPageMetadata({ title, description, path, image, noindex }: PageMetaInput): Promise<Metadata> {
  const s = await getSiteSettings();
  const desc = description || s.bio;
  const img = image || s.ogImageUrl || DEFAULT_OG_PATH;
  const fullTitle = `${title} | ${s.name}`;
  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description: desc,
      url: path,
      siteName: s.name,
      type: "website",
      locale: "en_US",
      images: [{ url: img }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: desc, images: [img] },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

// ---------- JSON-LD builders (schema.org) ----------

export function sameAsLinks(s: SiteSettingsData): string[] {
  return [s.socials?.github, s.socials?.linkedin, s.socials?.twitter].filter((x): x is string => !!x);
}

export function personNode(s: SiteSettingsData, skills: string[] = []) {
  const url = getSiteUrl();
  return {
    "@type": "Person",
    "@id": `${url}/#person`,
    name: s.name,
    jobTitle: s.title,
    description: s.bio,
    url,
    image: s.avatarUrl || undefined,
    sameAs: sameAsLinks(s),
    knowsAbout: skills.length ? skills : undefined,
  };
}

export function homeGraph(s: SiteSettingsData, skills: string[] = []) {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: s.name,
        description: s.bio,
        inLanguage: "en",
        publisher: { "@id": `${url}/#person` },
      },
      personNode(s, skills),
      {
        "@type": "ProfilePage",
        "@id": `${url}/#profilepage`,
        url,
        name: `${s.name} — ${s.title}`,
        isPartOf: { "@id": `${url}/#website` },
        mainEntity: { "@id": `${url}/#person` },
      },
    ],
  };
}

export function breadcrumbNode(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}
