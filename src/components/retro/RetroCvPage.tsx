"use client";
import { Download } from "lucide-react";
import RetroPageShell from "./RetroPageShell";
import TerminalWindow from "./TerminalWindow";
import GlitchText from "./GlitchText";
import SectionLabel from "./SectionLabel";

export default function RetroCvPage({
  osName,
  name,
  title,
  enabled,
  url,
}: {
  osName: string;
  name: string;
  title: string;
  enabled: boolean;
  url: string;
}) {
  return (
    <RetroPageShell osName={osName}>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "60px 24px 140px", textAlign: "center" }}>
        <TerminalWindow title="resume.pdf — file info">
          <div style={{ padding: "40px 32px" }}>
            <SectionLabel n="CV" label="RESUME" />
            <GlitchText tag="h1" style={{ fontFamily: "var(--font-retro-display)", fontSize: 40, color: "var(--text)", margin: "0 0 8px" }}>
              {name}
            </GlitchText>
            <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 13, color: "var(--text-dim)", lineHeight: 1.8, marginBottom: 32 }}>
              {title} — mobile, web and backend. Download the current CV below.
            </p>
            {enabled && url ? (
              <a href={url}>
                <button
                  data-cursor-hover
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px",
                    background: "var(--white)", color: "var(--bg)", border: "none", cursor: "none",
                    fontFamily: "var(--font-retro-body)", fontSize: 13, letterSpacing: "0.08em",
                  }}
                >
                  <Download size={15} /> download cv
                </button>
              </a>
            ) : (
              <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)" }}>
                No CV has been uploaded yet — add one from <code style={{ color: "var(--g)" }}>/admin/profile</code>.
              </p>
            )}
          </div>
        </TerminalWindow>
      </div>
    </RetroPageShell>
  );
}
