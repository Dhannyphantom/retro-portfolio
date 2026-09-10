"use client";

export default function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          fontFamily: "var(--font-retro-body)",
          fontSize: 10,
          color: "var(--r)",
          letterSpacing: "0.15em",
        }}
      >
        · {n}_{label.toUpperCase()}
      </span>
    </div>
  );
}
