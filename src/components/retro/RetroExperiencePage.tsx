"use client";
import RetroPageShell from "./RetroPageShell";
import TerminalWindow from "./TerminalWindow";
import GlitchText from "./GlitchText";
import SectionLabel from "./SectionLabel";
import RetroExperienceEntry from "./RetroExperienceEntry";
import type { ExperienceItem } from "@/types";

export default function RetroExperiencePage({ osName, experience }: { osName: string; experience: ExperienceItem[] }) {
  return (
    <RetroPageShell osName={osName}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 140px" }}>
        <TerminalWindow title="experience.log" hint="most recent first">
          <div style={{ padding: "32px 36px" }}>
            <SectionLabel n="03" label="EXPERIENCE" />
            <GlitchText tag="h1" style={{ fontFamily: "var(--font-retro-display)", fontSize: 44, color: "var(--text)", margin: "0 0 8px" }}>
              receipts.
            </GlitchText>
            <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)", marginBottom: 32 }}>
              Roles where I&apos;ve shipped things people actually depend on.
            </p>
            {experience.map((e, i) => (
              <RetroExperienceEntry key={e.role + e.organization} item={e} idx={i} isLast={i === experience.length - 1} />
            ))}
          </div>
        </TerminalWindow>
      </div>
    </RetroPageShell>
  );
}
