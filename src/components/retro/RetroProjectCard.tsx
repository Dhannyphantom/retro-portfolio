"use client";
import { useRef, useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import MagneticBtn from "./MagneticBtn";
import { useInView } from "@/lib/hooks/useInView";
import type { ProjectItem } from "@/types";

function useSkew(maxDeg = 6) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${nx * maxDeg}deg) rotateX(${-ny * maxDeg}deg) scale(1.02)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(600px) rotateY(0) rotateX(0) scale(1)";
  };
  return { ref, onMove, onLeave };
}

export default function RetroProjectCard({ p, idx }: { p: ProjectItem; idx: number }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef);
  const skew = useSkew(5);
  const fileName = `${p.title.toLowerCase().replace(/\s+/g, "-")}.tsx`;

  return (
    <div
      ref={cardRef}
      style={{
        border: "1px solid var(--border)",
        background: "var(--card-bg)",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(24px)",
        transition: `opacity 0.45s ease ${idx * 0.06}s, transform 0.45s ease ${idx * 0.06}s`,
      }}
    >
      <div
        ref={skew.ref}
        onMouseMove={skew.onMove}
        onMouseLeave={() => { skew.onLeave(); setHovered(false); }}
        onMouseEnter={() => setHovered(true)}
        style={{ transition: "transform 0.2s cubic-bezier(0.22,1,0.36,1)", willChange: "transform" }}
      >
        <div style={{ background: "var(--window-bar)", borderBottom: "1px solid var(--border)", padding: "6px 12px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
          <span style={{ flex: 1, textAlign: "center", fontSize: 10, color: "var(--text-dim)", fontFamily: "var(--font-retro-body)" }}>{fileName}</span>
          <span style={{ fontSize: 10, color: "var(--border)", fontFamily: "var(--font-retro-body)" }}>#{String(idx + 1).padStart(2, "0")}</span>
        </div>

        <div style={{ height: 140, background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative", borderBottom: "1px solid var(--border)" }}>
          <SafeImage src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" iconSize={28} />
          <div style={{ position: "absolute", inset: 0, background: hovered ? "rgba(255,0,51,0.08)" : "rgba(0,0,0,0.15)", transition: "background 0.3s", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.08) 3px,rgba(0,0,0,0.08) 4px)", pointerEvents: "none" }} />
        </div>

        <div style={{ padding: "16px 16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h3 style={{ fontFamily: "var(--font-retro-display)", fontSize: 28, color: "var(--text)", margin: 0, lineHeight: 1 }}>{p.title}</h3>
            <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: p.featured ? "var(--g)" : "var(--text-dim)", letterSpacing: "0.15em" }}>
              {p.featured && <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--g)", marginRight: 4, verticalAlign: "middle" }} />}
              {p.category?.toUpperCase()}
            </span>
          </div>
          <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", lineHeight: 1.7, margin: "0 0 12px" }}>{p.description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
            {p.technologies.map((t) => (
              <span key={t} style={{ fontSize: 9, padding: "3px 7px", border: "1px solid var(--border)", color: "var(--text-dim)", fontFamily: "var(--font-retro-body)", background: "var(--tag-bg)" }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <MagneticBtn href={`/projects/${p.slug}`} style={{ padding: "8px 16px", fontSize: 10 }}>
              view case study →
            </MagneticBtn>
            {p.liveUrl && (
              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                <button style={{ padding: "8px 16px", background: "var(--white)", color: "var(--bg)", border: "none", cursor: "none", fontFamily: "var(--font-retro-body)", fontSize: 10, letterSpacing: "0.1em" }} data-cursor-hover>
                  ▶ live demo
                </button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
