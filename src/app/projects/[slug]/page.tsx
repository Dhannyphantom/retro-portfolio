import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { getSiteSettings } from "@/lib/settings";
import RetroProjectDetail from "@/components/retro/RetroProjectDetail";
import type { ProjectItem } from "@/types";

async function getProject(slug: string): Promise<ProjectItem | null> {
  try {
    await connectDB();
    const p = await Project.findOne({ slug }).lean();
    return p as unknown as ProjectItem | null;
  } catch {
    return null;
  }
}

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

export default async function ProjectCaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, { prev, next }, settings] = await Promise.all([
    getProject(slug),
    getNeighbors(slug),
    getSiteSettings(),
  ]);
  if (!project) notFound();

  const osName = `${settings.name.split(" ")[0].toLowerCase()}OS`;

  return (
    <RetroProjectDetail
      osName={osName}
      project={project}
      prev={prev as any}
      next={next as any}
    />
  );
}
