"use client";
import { useEffect, useState } from "react";
import RetroPageShell from "./RetroPageShell";
import TerminalWindow from "./TerminalWindow";
import GlitchText from "./GlitchText";
import SectionLabel from "./SectionLabel";
import RetroProjectCard from "./RetroProjectCard";
import type { ProjectItem } from "@/types";

const FILTERS = [
  { id: "all", label: "ALL" },
  { id: "Mobile", label: "MOBILE" },
  { id: "Web", label: "WEB" },
  { id: "Backend", label: "BACKEND" },
];

export default function RetroProjectsArchive({ osName }: { osName: string }) {
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
    <RetroPageShell osName={osName}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 140px" }}>
        <TerminalWindow title="~/projects — ls -la" hint={`${projects.length} entries`}>
          <div style={{ padding: "32px 36px" }}>
            <SectionLabel n="02" label="ARCHIVE" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
              <GlitchText tag="h1" style={{ fontFamily: "var(--font-retro-display)", fontSize: 44, color: "var(--text)", margin: 0 }}>
                all projects.
              </GlitchText>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    data-cursor-hover
                    style={{
                      fontFamily: "var(--font-retro-body)", fontSize: 10, letterSpacing: "0.08em",
                      padding: "8px 14px", cursor: "none",
                      background: filter === f.id ? "var(--white)" : "transparent",
                      color: filter === f.id ? "var(--bg)" : "var(--text-dim)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)" }}>loading projects...</p>
            ) : visible.length === 0 ? (
              <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)" }}>No projects in this category yet.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
                {visible.map((p, i) => <RetroProjectCard key={p.slug} p={p} idx={i} />)}
              </div>
            )}
          </div>
        </TerminalWindow>
      </div>
    </RetroPageShell>
  );
}
