"use client";
import Link from "next/link";

export default function OSMenuBar({ osName }: { osName: string }) {
  return (
    <div className="retro-menubar">
      <span style={{ fontFamily: "var(--font-retro-pixel)", fontSize: 8, color: "var(--r)" }}>■</span>
      <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text)" }}>{osName}</span>
      <Link href="/account/login" style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)" }} data-cursor-hover>
        Client
      </Link>
      <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)" }}>View</span>
      <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)" }}>Help</span>
      <div style={{ flex: 1 }} />
      <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)" }} suppressHydrationWarning>
        {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
      </span>
    </div>
  );
}
