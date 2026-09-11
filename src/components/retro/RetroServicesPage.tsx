"use client";
import * as Icons from "lucide-react";
import RetroPageShell from "./RetroPageShell";
import TerminalWindow from "./TerminalWindow";
import GlitchText from "./GlitchText";
import SectionLabel from "./SectionLabel";
import MagneticBtn from "./MagneticBtn";
import type { ServiceItem, RateCardItem } from "@/types";

type WorkflowStepItem = { icon?: string; title: string; description: string };

export default function RetroServicesPage({
  osName,
  services,
  rateCards,
  workflowSteps,
}: {
  osName: string;
  services: ServiceItem[];
  rateCards: RateCardItem[];
  workflowSteps: WorkflowStepItem[];
}) {
  return (
    <RetroPageShell osName={osName}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 140px" }}>
        <TerminalWindow title="~/services — cat menu.txt" hint="what I do">
          <div style={{ padding: "32px 36px" }}>
            <SectionLabel n="01" label="SERVICES" />
            <GlitchText tag="h1" style={{ fontFamily: "var(--font-retro-display)", fontSize: 44, color: "var(--text)", margin: "0 0 32px" }}>
              what I do.
            </GlitchText>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
              {services.map((s) => {
                const Icon = (Icons as any)[s.icon || "Code2"] || Icons.Code2;
                return (
                  <div key={s.title} style={{ border: "1px solid var(--border)", background: "var(--card-bg)", padding: "18px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <Icon size={16} color="var(--g)" />
                      <span style={{ fontFamily: "var(--font-retro-display)", fontSize: 20, color: "var(--text)" }}>{s.title}</span>
                    </div>
                    <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", lineHeight: 1.7, margin: "0 0 12px" }}>{s.description}</p>
                    {(s.startingPrice || s.timeline) && (
                      <div style={{ display: "flex", gap: 12, fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)" }}>
                        {s.startingPrice && <span>from {s.startingPrice}</span>}
                        {s.timeline && <span>· {s.timeline}</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </TerminalWindow>

        {!!workflowSteps.length && (
          <div style={{ marginTop: 24 }}>
            <TerminalWindow title="workflow.sh" hint="idea → shipped">
              <div style={{ padding: "32px 36px" }}>
                <SectionLabel n="02" label="HOW_I_WORK" />
                <GlitchText tag="h2" style={{ fontFamily: "var(--font-retro-display)", fontSize: 36, color: "var(--text)", margin: "0 0 24px" }}>
                  idea to product.
                </GlitchText>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {workflowSteps.map((w, i) => {
                    const Icon = (Icons as any)[w.icon || "Search"] || Icons.Search;
                    return (
                      <div key={w.title} style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--border)", padding: "10px 16px", background: "var(--tag-bg)", minWidth: 200, flex: "1 1 200px" }}>
                        <Icon size={16} color="var(--g)" />
                        <div>
                          <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)" }}>{i + 1}.</div>
                          <div style={{ fontFamily: "var(--font-retro-display)", fontSize: 16, color: "var(--text)" }}>{w.title}</div>
                          <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)" }}>{w.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TerminalWindow>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <TerminalWindow title="rates.sh" hint="pricing">
            <div style={{ padding: "32px 36px" }}>
              <SectionLabel n="03" label="RATES" />
              <GlitchText tag="h2" style={{ fontFamily: "var(--font-retro-display)", fontSize: 36, color: "var(--text)", margin: "0 0 24px" }}>
                let&apos;s talk business.
              </GlitchText>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
                {rateCards.map((r) => (
                  <div key={r.name} style={{ border: `1px solid ${r.recommended ? "var(--g)" : "var(--border)"}`, background: "var(--card-bg)", padding: "20px 20px 24px", position: "relative" }}>
                    {r.recommended && <span style={{ position: "absolute", top: -10, left: 16, fontSize: 9, fontFamily: "var(--font-retro-body)", background: "var(--g)", color: "#000", padding: "2px 8px" }}>RECOMMENDED</span>}
                    <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)" }}>{r.name}</div>
                    <div style={{ fontFamily: "var(--font-retro-display)", fontSize: 32, color: "var(--text)", margin: "6px 0" }}>{r.price} <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{r.unit}</span></div>
                    <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", marginBottom: 14 }}>{r.description}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                      {(r.features || []).map((f) => (
                        <div key={f} style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)" }}>· {f}</div>
                      ))}
                    </div>
                    <MagneticBtn href="/hire" primary={!!r.recommended} style={{ width: "100%", textAlign: "center" }}>get started</MagneticBtn>
                  </div>
                ))}
              </div>
            </div>
          </TerminalWindow>
        </div>
      </div>
    </RetroPageShell>
  );
}
