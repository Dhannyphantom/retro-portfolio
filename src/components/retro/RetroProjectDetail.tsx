"use client";
import RetroPageShell, { BackLink } from "./RetroPageShell";
import TerminalWindow from "./TerminalWindow";
import GlitchText from "./GlitchText";
import SectionLabel from "./SectionLabel";
import MagneticBtn from "./MagneticBtn";
import SafeImage from "@/components/ui/SafeImage";
import type { ProjectItem } from "@/types";

export default function RetroProjectDetail({
  osName,
  project,
  prev,
  next,
}: {
  osName: string;
  project: ProjectItem;
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}) {
  const fileName = `${project.title.toLowerCase().replace(/\s+/g, "-")}.md`;

  return (
    <RetroPageShell osName={osName}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 140px" }}>
        <BackLink href="/projects">all projects</BackLink>

        <TerminalWindow title={fileName} hint={project.category}>
          <div style={{ padding: "32px 36px" }}>
            <SectionLabel n="CS" label="CASE_STUDY" />
            <GlitchText tag="h1" style={{ fontFamily: "var(--font-retro-display)", fontSize: "clamp(36px,6vw,56px)", color: "var(--text)", margin: "0 0 10px", lineHeight: 1 }}>
              {project.title}
            </GlitchText>
            <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 13, color: "var(--text-dim)", lineHeight: 1.8, maxWidth: 640, marginBottom: 24 }}>
              {project.description}
            </p>

            {project.thumbnail && (
              <div style={{ border: "1px solid var(--border)", marginBottom: 28 }}>
                <div style={{ background: "var(--window-bar)", borderBottom: "1px solid var(--border)", padding: "6px 12px", fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)" }}>
                  preview.png
                </div>
                <SafeImage src={project.thumbnail} alt={project.title} className="w-full h-[340px] object-cover" iconSize={36} />
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <button style={{ padding: "11px 22px", background: "var(--white)", color: "var(--bg)", border: "none", cursor: "none", fontFamily: "var(--font-retro-body)", fontSize: 12, letterSpacing: "0.08em" }} data-cursor-hover>
                    ▶ live demo
                  </button>
                </a>
              )}
              {project.githubUrl && <MagneticBtn href={project.githubUrl} external>◆ github</MagneticBtn>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24, marginBottom: 32 }}>
              {project.longDescription && (
                <div>
                  <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--r)", letterSpacing: "0.15em", marginBottom: 8 }}>· OVERVIEW</div>
                  <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)", lineHeight: 1.8, margin: 0 }}>{project.longDescription}</p>
                </div>
              )}
              {project.role && (
                <div>
                  <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--r)", letterSpacing: "0.15em", marginBottom: 8 }}>· MY ROLE</div>
                  <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)", lineHeight: 1.8, margin: 0 }}>{project.role}</p>
                </div>
              )}
              {project.challenges && (
                <div>
                  <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--r)", letterSpacing: "0.15em", marginBottom: 8 }}>· CHALLENGES</div>
                  <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)", lineHeight: 1.8, margin: 0 }}>{project.challenges}</p>
                </div>
              )}
              {project.solutions && (
                <div>
                  <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--r)", letterSpacing: "0.15em", marginBottom: 8 }}>· SOLUTION</div>
                  <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)", lineHeight: 1.8, margin: 0 }}>{project.solutions}</p>
                </div>
              )}
              {project.results && (
                <div>
                  <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--r)", letterSpacing: "0.15em", marginBottom: 8 }}>· RESULTS</div>
                  <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)", lineHeight: 1.8, margin: 0 }}>{project.results}</p>
                </div>
              )}
            </div>

            {!!project.features?.length && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--r)", letterSpacing: "0.15em", marginBottom: 12 }}>· KEY_FEATURES</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 8 }}>
                  {project.features.map((f) => (
                    <div key={f} style={{ border: "1px solid var(--border)", background: "var(--tag-bg)", padding: "10px 14px", fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)" }}>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              {project.technologies.map((t) => (
                <span key={t} style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, padding: "4px 10px", border: "1px solid var(--border)", color: "var(--g)", background: "var(--tag-bg)" }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", padding: "10px 20px", display: "flex", justifyContent: "space-between", fontFamily: "var(--font-retro-body)", fontSize: 11 }}>
            {prev ? <a href={`/projects/${prev.slug}`} style={{ color: "var(--text-dim)" }} data-cursor-hover>← {prev.title}</a> : <span />}
            {next ? <a href={`/projects/${next.slug}`} style={{ color: "var(--text-dim)" }} data-cursor-hover>{next.title} →</a> : <span />}
          </div>
        </TerminalWindow>
      </div>
    </RetroPageShell>
  );
}
