"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import GlitchText from "./GlitchText";
import { PENDING_KEY, PendingAction, runTerminalCommand, scrollToSection } from "@/lib/terminalBridge";

const SECTIONS = [
  { n: "01", id: "about", label: "ABOUT" },
  { n: "02", id: "projects", label: "PROJECTS" },
  { n: "03", id: "experience", label: "EXPERIENCE" },
  { n: "04", id: "contact", label: "CONTACT" },
];

const menuBtn: React.CSSProperties = {
  background: "none", border: "none", padding: "0 2px", cursor: "none",
  fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text)", height: "100%",
};

export default function OSMenuBar({ osName }: { osName: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(-1);
  const viewRef = useRef<HTMLDivElement>(null);

  // The red ■ + OS name act as a "back" control: go back one step in the
  // browser history when there is one, otherwise fall back to the homepage
  // (unless we're already there, in which case there's nowhere to go).
  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else if (pathname !== "/") {
      router.push("/");
    }
  };

  // Close the dropdown on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!viewRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // If View/Help was used from an inner page, we hop to the homepage first and
  // finish the action here once it has mounted (after its own scroll-to-top).
  useEffect(() => {
    if (pathname !== "/") return;
    let raw: string | null = null;
    try { raw = sessionStorage.getItem(PENDING_KEY); } catch {}
    if (!raw) return;
    try { sessionStorage.removeItem(PENDING_KEY); } catch {}
    let action: PendingAction | null = null;
    try { action = JSON.parse(raw); } catch {}
    if (!action) return;
    const a = action;
    setTimeout(() => (a.type === "help" ? runTerminalCommand("help") : scrollToSection(a.id)), 1100);
  }, [pathname]);

  const dispatch = (action: PendingAction) => {
    if (pathname === "/") {
      if (action.type === "help") runTerminalCommand("help");
      else scrollToSection(action.id);
      return;
    }
    try { sessionStorage.setItem(PENDING_KEY, JSON.stringify(action)); } catch {}
    router.push("/");
  };

  return (
    <div className="retro-menubar">
      <button
        type="button"
        onClick={goBack}
        data-cursor-hover
        title="go back"
        aria-label="Go back"
        style={{ display: "inline-flex", alignItems: "center", gap: 20, background: "none", border: "none", padding: 0, cursor: "none" }}
      >
        <span style={{ fontFamily: "var(--font-retro-pixel)", fontSize: 8, color: "var(--r)" }}>■</span>
        <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text)" }}>{osName}</span>
      </button>
      <Link href="/account/login" style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text)" }} data-cursor-hover>
        Client
      </Link>

      {/* VIEW — retro dropdown with glitching section links */}
      <div ref={viewRef} style={{ position: "relative", height: "100%", display: "flex", alignItems: "center" }}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          data-cursor-hover
          aria-haspopup="menu"
          aria-expanded={open}
          style={{ ...menuBtn, background: open ? "var(--white)" : "none", color: open ? "var(--bg)" : "var(--text)", padding: "0 8px" }}
        >
          View
        </button>
        {open && (
          <div
            role="menu"
            className="retro-dropdown"
            style={{
              position: "absolute", top: "100%", left: 0, minWidth: 220, zIndex: 1001,
              background: "var(--bg2)", border: "1px solid var(--white)", boxShadow: "4px 4px 0 var(--g)", padding: 4,
            }}
          >
            <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", padding: "6px 10px 8px", letterSpacing: "0.12em", borderBottom: "1px dashed var(--border)", marginBottom: 4 }}>
              // JUMP_TO
            </div>
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                role="menuitem"
                type="button"
                data-cursor-hover
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(-1)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(-1)}
                onClick={() => { setOpen(false); dispatch({ type: "scroll", id: s.id }); }}
                style={{
                  display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left",
                  padding: "10px 12px", cursor: "none", border: "none",
                  background: hover === i ? "var(--white)" : "transparent",
                  color: hover === i ? "var(--bg)" : "var(--text)",
                  fontFamily: "var(--font-retro-body)", fontSize: 13, letterSpacing: "0.08em",
                }}
              >
                <span style={{ color: hover === i ? "var(--bg)" : "var(--r)", fontSize: 11 }}>{s.n}</span>
                <GlitchText tag="span" className="retro-glitch-active">{s.label}</GlitchText>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* HELP — scrolls to the terminal, types `help`, and runs it */}
      <button
        type="button"
        onClick={() => { setOpen(false); dispatch({ type: "help" }); }}
        data-cursor-hover
        title="open the terminal and run help"
        style={{ ...menuBtn, padding: "0 8px" }}
      >
        Help
      </button>

      <div style={{ flex: 1 }} />
      <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)" }} suppressHydrationWarning>
        {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
      </span>
    </div>
  );
}
