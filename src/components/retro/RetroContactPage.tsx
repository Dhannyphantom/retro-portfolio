"use client";
import RetroPageShell from "./RetroPageShell";
import TerminalWindow from "./TerminalWindow";
import GlitchText from "./GlitchText";
import SectionLabel from "./SectionLabel";
import MagneticBtn from "./MagneticBtn";
import RetroContactForm from "./RetroContactForm";

export default function RetroContactPage({
  osName,
  email,
  location,
  socials,
}: {
  osName: string;
  email?: string;
  location?: string;
  socials?: { github?: string; linkedin?: string; twitter?: string };
}) {
  return (
    <RetroPageShell osName={osName}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 140px" }}>
        <TerminalWindow title="contact.sh" hint="run to connect">
          <div style={{ padding: "32px 36px" }}>
            <SectionLabel n="07" label="CONTACT" />
            <GlitchText tag="h1" style={{ fontFamily: "var(--font-retro-display)", fontSize: 44, color: "var(--text)", margin: "0 0 8px" }}>
              let&apos;s build.
            </GlitchText>
            <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 13, color: "var(--text-dim)", lineHeight: 1.8, maxWidth: 500, marginBottom: 32 }}>
              open to new projects and interesting problems.
              <br />
              {location || "remote"} — remote-friendly.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }} className="retro-contact-grid">
              <RetroContactForm />

              <div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                  {email && <MagneticBtn href={`mailto:${email}`} external>email →</MagneticBtn>}
                  {socials?.github && <MagneticBtn href={socials.github} external>github →</MagneticBtn>}
                  {socials?.linkedin && <MagneticBtn href={socials.linkedin} external>linkedin →</MagneticBtn>}
                  <MagneticBtn href="/account/login">client login →</MagneticBtn>
                </div>
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)" }}>
                  // prefer a quicker path? <a href="/hire" style={{ color: "var(--g)" }} data-cursor-hover>submit a full project brief →</a>
                </div>
              </div>
            </div>
          </div>
        </TerminalWindow>
      </div>
    </RetroPageShell>
  );
}
