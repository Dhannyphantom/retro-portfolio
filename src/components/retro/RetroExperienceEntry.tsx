"use client";
import { useRef } from "react";
import { useInView } from "@/lib/hooks/useInView";
import type { ExperienceItem } from "@/types";

const EXP_COLORS = ["var(--g)", "var(--c)", "var(--r)"];

export default function RetroExperienceEntry({ item, idx, isLast }: { item: ExperienceItem; idx: number; isLast: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const color = EXP_COLORS[idx % EXP_COLORS.length];
  return (
    <div ref={ref} style={{ display: "flex", gap: 20, opacity: inView ? 1 : 0, transform: inView ? "none" : "translateX(-20px)", transition: `all 0.5s ease ${idx * 0.15}s` }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20, flexShrink: 0 }}>
        <div style={{ width: 14, height: 14, background: color, flexShrink: 0, border: "2px solid var(--bg)", outline: `1px solid ${color}` }} />
        {!isLast && <div style={{ flex: 1, width: 1, background: "var(--border)", minHeight: 20, marginTop: 4 }} />}
      </div>
      <div style={{ flex: 1, border: "1px solid var(--border)", padding: "16px 20px", marginBottom: 16, background: "var(--card-bg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color, letterSpacing: "0.1em" }}>
            · {idx === 0 ? "CURRENT" : "PAST"}
          </span>
          <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", background: "var(--bg3)", padding: "2px 8px", border: "1px solid var(--border)" }}>
            {item.startDate} — {item.endDate || "Present"}
          </span>
        </div>
        <h3 style={{ fontFamily: "var(--font-retro-display)", fontSize: 24, color: "var(--text)", margin: "0 0 4px" }}>
          {item.role} · <span style={{ color }}>{item.organization}</span>
        </h3>
        {item.description && <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", lineHeight: 1.8, margin: "0 0 14px" }}>{item.description}</p>}
        {!!item.achievements?.length && (
          <ul style={{ margin: "0 0 14px", padding: "0 0 0 16px" }}>
            {item.achievements.map((b, i) => (
              <li key={i} style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", lineHeight: 1.8, marginBottom: 2 }}>{b}</li>
            ))}
          </ul>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {(item.technologies || []).map((t) => (
            <span key={t} style={{ fontSize: 9, padding: "3px 7px", border: "1px solid var(--border)", color: "var(--text-dim)", fontFamily: "var(--font-retro-body)" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
