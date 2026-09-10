"use client";
import { useMagnetic } from "@/lib/hooks/useMagnetic";

export const NAV_ITEMS = [
  { label: "⌂", id: "hero", title: "HOME" },
  { label: "ME", id: "about", title: "ABOUT" },
  { label: "⌘P", id: "projects", title: "PROJECTS" },
  { label: "EX", id: "experience", title: "EXPERIENCE" },
  { label: "SK", id: "skills", title: "SKILLS" },
  { label: "$", id: "rates", title: "RATES" },
  { label: "▶", id: "games", title: "GAMES" },
  { label: "@", id: "contact", title: "CONTACT" },
];

export default function NavDock({
  active,
  light,
  onToggleTheme,
}: {
  active: string;
  light: boolean;
  onToggleTheme: () => void;
}) {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <div className="retro-navdock hide-sm-flex">
      {NAV_ITEMS.map(({ label, id, title }) => {
        const { ref, onMove, onLeave } = useMagnetic(0.25);
        return (
          <button
            key={id}
            // @ts-expect-error motion-free ref
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            onClick={() => scrollTo(id)}
            title={title}
            data-cursor-hover
            style={{
              fontFamily: "var(--font-retro-body)",
              fontSize: 11,
              padding: "8px 12px",
              background: active === id ? "var(--white)" : "var(--bg3)",
              color: active === id ? "var(--bg)" : "var(--text)",
              border: "1px solid",
              borderColor: active === id ? "var(--white)" : "var(--border)",
              cursor: "none",
              transition: "all 0.15s, transform 0.2s cubic-bezier(0.22,1,0.36,1)",
              minWidth: 34,
              letterSpacing: "0.05em",
            }}
          >
            {label}
          </button>
        );
      })}
      <button
        onClick={onToggleTheme}
        title={light ? "dark mode" : "light mode"}
        data-cursor-hover
        style={{
          fontFamily: "var(--font-retro-body)",
          fontSize: 13,
          padding: "8px 10px",
          background: "var(--bg3)",
          color: "var(--text)",
          border: "1px solid var(--border)",
          cursor: "none",
          marginLeft: 4,
        }}
      >
        {light ? "◑" : "◐"}
      </button>
    </div>
  );
}
