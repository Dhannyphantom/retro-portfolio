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
      <div style={{ flex: 1, border: "1px solid var(--border)", padding: "18px 22px", marginBottom: 16, background: "var(--card-bg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color, letterSpacing: "0.1em" }}>
            · {idx === 0 ? "CURRENT" : "PAST"}
          </span>
          <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text)", background: "var(--bg3)", padding: "2px 8px", border: "1px solid var(--border)" }}>
            {item.startDate} — {item.endDate || "Present"}
          </span>
        </div>
        <h3 style={{ fontFamily: "var(--font-retro-display)", fontSize: 26, color: "var(--text)", margin: "0 0 6px" }}>
          {item.role} · <span style={{ color }}>{item.organization}</span>
        </h3>
        {item.description && (
          <div style={{ borderLeft: "2px solid var(--g)", paddingLeft: 12, margin: "0 0 14px" }}>
            <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 15, color: "var(--text)", lineHeight: 1.75, margin: 0 }}>{item.description}</p>
          </div>
        )}
        {!!item.achievements?.length && (
          <ul style={{ margin: "0 0 14px", padding: "0 0 0 18px" }}>
            {item.achievements.map((b, i) => (
              <li key={i} style={{ fontFamily: "var(--font-retro-body)", fontSize: 14.5, color: "var(--text)", lineHeight: 1.75, marginBottom: 4 }}>{b}</li>
            ))}
          </ul>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {(item.technologies || []).map((t) => (
            <span key={t} style={{ fontSize: 11.5, padding: "4px 9px", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "var(--font-retro-body)", background: "var(--tag-bg)" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
