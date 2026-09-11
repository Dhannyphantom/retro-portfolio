"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMagnetic } from "@/lib/hooks/useMagnetic";

const LINKS = [
  { label: "⌂", href: "/", title: "HOME" },
  { label: "⌘P", href: "/projects", title: "PROJECTS" },
  { label: "SV", href: "/services", title: "SERVICES" },
  { label: "$", href: "/#rates", title: "RATES" },
  { label: "@", href: "/#contact", title: "CONTACT" },
  { label: "▶", href: "/hire", title: "HIRE ME" },
];

export default function InnerNavDock({ light, onToggleTheme }: { light: boolean; onToggleTheme: () => void }) {
  const pathname = usePathname();
  return (
    <div className="retro-navdock">
      {LINKS.map(({ label, href, title }) => {
        const { ref, onMove, onLeave } = useMagnetic(0.25);
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href.replace("/#", "/"));
        return (
          <Link key={href} href={href} title={title}>
            <button
              // @ts-expect-error motion-free ref
              ref={ref}
              onMouseMove={onMove}
              onMouseLeave={onLeave}
              data-cursor-hover
              style={{
                fontFamily: "var(--font-retro-body)",
                fontSize: 11,
                padding: "8px 12px",
                background: active ? "var(--white)" : "var(--bg3)",
                color: active ? "var(--bg)" : "var(--text)",
                border: "1px solid",
                borderColor: active ? "var(--white)" : "var(--border)",
                cursor: "none",
                transition: "all 0.15s, transform 0.2s cubic-bezier(0.22,1,0.36,1)",
                minWidth: 34,
                letterSpacing: "0.05em",
              }}
            >
              {label}
            </button>
          </Link>
        );
      })}
      <button
        onClick={onToggleTheme}
        title={light ? "dark mode" : "light mode"}
        data-cursor-hover
        style={{
          fontFamily: "var(--font-retro-body)", fontSize: 13, padding: "8px 10px",
          background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border)",
          cursor: "none", marginLeft: 4,
        }}
      >
        {light ? "◑" : "◐"}
      </button>
    </div>
  );
}
