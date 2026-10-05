import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { getSiteSettings } from "@/lib/settings";
import RetroProjectDetail from "@/components/retro/RetroProjectDetail";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, breadcrumbNode, buildPageMetadata, getSiteUrl, sameAsLinks } from "@/lib/seo";
import type { ProjectItem } from "@/types";

// cache() dedupes the lookup between generateMetadata and the page render.
const getProject = cache(async (slug: string): Promise<ProjectItem | null> => {
  try {
    await connectDB();
    const p = await Project.findOne({ slug }).lean();
    return p as unknown as ProjectItem | null;
  } catch {
    return null;
  }
});

async function getNeighbors(slug: string) {
  try {
    await connectDB();
    const all = await Project.find().sort({ order: 1 }).select("slug title").lean();
    const idx = all.findIndex((p) => p.slug === slug);
    return {
      prev: idx > 0 ? all[idx - 1] : null,
      next: idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null,
    };
  } catch {
    return { prev: null, next: null };
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project not found", robots: { index: false, follow: false } };
  return buildPageMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${project.slug}`,
    image: project.thumbnail,
  });
}

export default async function ProjectCaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, { prev, next }, settings] = await Promise.all([getProject(slug), getNeighbors(slug), getSiteSettings()]);
  if (!project) notFound();

  const osName = `${settings.name.split(" ")[0].toLowerCase()}OS`;
  const siteUrl = getSiteUrl();
  const url = absoluteUrl(`/projects/${project.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#project`,
        name: project.title,
        description: project.longDescription || project.description,
        url,
        image: project.thumbnail || undefined,
        keywords: project.technologies?.join(", "),
        genre: project.category,
        author: { "@type": "Person", "@id": `${siteUrl}/#person`, name: settings.name, url: siteUrl, sameAs: sameAsLinks(settings) },
        sameAs: [project.liveUrl, project.githubUrl].filter(Boolean),
      },
      breadcrumbNode([
        { name: "Home", path: "/" },
        { name: "Projects", path: "/projects" },
        { name: project.title, path: `/projects/${project.slug}` },
      ]),
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <RetroProjectDetail osName={osName} project={project} prev={prev as any} next={next as any} />
    </>
  );
}
