"use client";
import Link from "next/link";
import RetroCursor from "./RetroCursor";
import RetroMatrixRain from "./RetroMatrixRain";
import OSMenuBar from "./OSMenuBar";
import InnerNavDock from "./InnerNavDock";
import { useTheme } from "@/lib/theme";

// Same chrome the homepage brings (cursor, matrix rain, CRT overlay, top
// menu bar) reused across every migrated inner page, with a bottom dock of
// real route links instead of the homepage's scroll-to-section dock.
export default function RetroPageShell({
  osName,
  children,
}: {
  osName: string;
  children: React.ReactNode;
}) {
  const { theme, toggleTheme } = useTheme();
  const light = theme === "light";

  return (
    <div className="retro-root" style={{ minHeight: "100vh", background: "var(--bg)", position: "relative" }}>
      <RetroCursor />
      <RetroMatrixRain light={light} />
      <div className="retro-noise-overlay" />
      <OSMenuBar osName={osName} />
      <main style={{ paddingTop: 28, position: "relative", zIndex: 1 }}>{children}</main>
      <InnerNavDock light={light} onToggleTheme={toggleTheme} />
    </div>
  );
}

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      data-cursor-hover
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontFamily: "var(--font-retro-body)", fontSize: 11,
        color: "var(--text-dim)", marginBottom: 20,
      }}
    >
      ← {children}
    </Link>
  );
}
