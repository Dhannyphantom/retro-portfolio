"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Smartphone, Globe, Server, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import DiagonalCard from "@/components/ui/DiagonalCard";
import SafeImage from "@/components/ui/SafeImage";
import type { ProjectItem } from "@/types";

const FILTERS = [
  { id: "all", label: "All work", icon: null },
  { id: "Mobile", label: "Mobile", icon: Smartphone },
  { id: "Web", label: "Web", icon: Globe },
  { id: "Backend", label: "Backend", icon: Server },
];

export default function ProjectsArchive() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => setProjects(d.projects || []))
      .finally(() => setLoading(false));
  }, []);

  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="max-w-[1120px] mx-auto px-7 pt-16 pb-24">
      <Reveal>
        <div className="flex justify-between items-end flex-wrap gap-5 mb-9">
          <div>
            <span className="font-mono text-xs tracking-widest" style={{ color: "rgba(180,92,255,0.422)" }}>ARCHIVE</span>
            <h1 className="font-display font-semibold text-[clamp(28px,3.6vw,42px)] mt-2 tracking-tight">All projects</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium rounded-full px-3.5 py-2 transition-colors"
                style={{
                  color: filter === f.id ? "#0A090C" : "#F3F0F7",
                  background: filter === f.id ? "#F3F0F7" : "rgba(243,240,247,0.06)",
                  border: "1px solid rgba(243,240,247,0.12)",
                }}
              >
                {f.icon && <f.icon size={13} />}
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {loading ? (
        <p className="text-mute">Loading projects…</p>
      ) : visible.length === 0 ? (
        <p className="text-mute">No projects in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((p) => (
            <Reveal key={p.slug}>
              <Link href={`/projects/${p.slug}`}>
                <DiagonalCard always radius={12} padding={2} hoverLift>
                  <div>
                    <SafeImage src={p.thumbnail} className="w-full h-[170px] object-cover" iconSize={28} />
                    <div className="p-5">
                      <span className="text-[11px] font-mono px-2 py-1 rounded" style={{ color: "rgba(180,92,255,0.422)", background: "rgba(139,47,224,0.034)" }}>{p.category}</span>
                      <h3 className="font-display font-semibold text-lg mt-3 mb-1.5">{p.title}</h3>
                      <p className="text-mute text-[13px] leading-relaxed">{p.description}</p>
                      <div className="flex items-center gap-1 text-violet text-[13px] mt-4">
                        View case study <ArrowUpRight size={13} />
                      </div>
                    </div>
                  </div>
                </DiagonalCard>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
