import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { getSiteUrl } from "@/lib/seo";

// Served at /sitemap.xml. Rendered per request so new projects appear immediately.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();

  // Static routes carry no lastModified: Google ignores lastmod values that are
  // always "now", so only include it where it's genuinely known (projects).
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/experience`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/hire`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/cv`, changeFrequency: "monthly", priority: 0.5 },
  ];

  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    await connectDB();
    const projects = (await Project.find().select("slug updatedAt").lean()) as unknown as { slug: string; updatedAt?: Date }[];
    projectRoutes = projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch {
    // DB unreachable: still serve the static routes.
  }

  return [...staticRoutes, ...projectRoutes];
}
