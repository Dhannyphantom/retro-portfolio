import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Reveal from "@/components/ui/Reveal";
import CTAButton from "@/components/ui/CTAButton";
import SafeImage from "@/components/ui/SafeImage";
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

export default async function ProjectCaseStudy({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  if (!project) notFound();
  const { prev, next } = await getNeighbors(params.slug);

  return (
    <div className="max-w-[900px] mx-auto px-7 pt-14 pb-24">
      <Reveal>
        <Link href="/projects" className="inline-flex items-center gap-1.5 text-mute text-sm mb-8 hover:text-paper transition-colors">
          <ArrowLeft size={15} /> Back to projects
        </Link>
        <span className="text-[11px] font-mono px-2 py-1 rounded" style={{ color: "rgba(180,92,255,0.62)", background: "rgba(139,47,224,0.05)" }}>{project.category}</span>
        <h1 className="font-display font-bold text-[clamp(30px,4.4vw,48px)] tracking-tight mt-3 mb-4">{project.title}</h1>
        <p className="text-mute text-lg leading-relaxed mb-8">{project.description}</p>

        {project.thumbnail && (
          <div className="rounded-2xl overflow-hidden mb-10" style={{ border: "1px solid rgba(180,92,255,0.2)" }}>
            <SafeImage src={project.thumbnail} className="w-full h-[380px] object-cover" iconSize={40} />
          </div>
        )}

        <div className="flex gap-3 mb-12">
          {project.liveUrl && <CTAButton variant="primary" href={project.liveUrl}>Live demo <ArrowUpRight size={14} /></CTAButton>}
          {project.githubUrl && <CTAButton variant="outline" href={project.githubUrl}><Github size={14} /> GitHub</CTAButton>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-12">
          {project.longDescription && (
            <div>
              <h3 className="font-display font-semibold text-lg mb-2.5">Overview</h3>
              <p className="text-mute text-sm leading-relaxed">{project.longDescription}</p>
            </div>
          )}
          {project.role && (
            <div>
              <h3 className="font-display font-semibold text-lg mb-2.5">My role</h3>
              <p className="text-mute text-sm leading-relaxed">{project.role}</p>
            </div>
          )}
          {project.challenges && (
            <div>
              <h3 className="font-display font-semibold text-lg mb-2.5">Challenges</h3>
              <p className="text-mute text-sm leading-relaxed">{project.challenges}</p>
            </div>
          )}
          {project.solutions && (
            <div>
              <h3 className="font-display font-semibold text-lg mb-2.5">Solution</h3>
              <p className="text-mute text-sm leading-relaxed">{project.solutions}</p>
            </div>
          )}
          {project.results && (
            <div>
              <h3 className="font-display font-semibold text-lg mb-2.5">Results</h3>
              <p className="text-mute text-sm leading-relaxed">{project.results}</p>
            </div>
          )}
        </div>

        {!!project.features?.length && (
          <div className="mb-12">
            <h3 className="font-display font-semibold text-lg mb-3">Key features</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.features.map((f) => (
                <li key={f} className="text-mute text-sm rounded px-3.5 py-2.5" style={{ border: "1px solid rgba(243,240,247,0.08)" }}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-14">
          {project.technologies.map((t) => (
            <span key={t} className="text-[12px] font-mono px-2.5 py-1.5 rounded" style={{ color: "rgba(180,92,255,0.62)", background: "rgba(139,47,224,0.05)", border: "1px solid rgba(180,92,255,0.18)" }}>{t}</span>
          ))}
        </div>

        <div className="flex justify-between border-t border-white/[0.08] pt-6">
          {prev ? (
            <Link href={`/projects/${prev.slug}`} className="text-sm text-mute hover:text-paper transition-colors">← {prev.title}</Link>
          ) : <span />}
          {next ? (
            <Link href={`/projects/${next.slug}`} className="text-sm text-mute hover:text-paper transition-colors">{next.title} →</Link>
          ) : <span />}
        </div>
      </Reveal>
    </div>
  );
}
