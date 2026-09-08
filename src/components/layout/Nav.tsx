"use client";
import Link from "next/link";
import ThemeToggle from "@/components/layout/ThemeToggle";
import Magnetic from "@/components/ui/Magnetic";

const LINKS = [
  { href: "/#about", label: "ABOUT" },
  { href: "/projects", label: "PROJECTS" },
  { href: "/services", label: "SERVICES" },
  { href: "/account/login", label: "CLIENT" },
];

export default function Nav({ name = "Daniel Olojo" }: { name?: string }) {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  return (
    <div
      className="sticky top-0 z-50 border-b-2"
      style={{
        background: "rgba(var(--void-rgb),0.92)",
        borderColor: "var(--border-strong)",
      }}
    >
      <div className="max-w-[1120px] mx-auto px-7 py-4 flex items-center justify-between">
        <Magnetic
          as={Link}
          href="/"
          strength={10}
          className="font-mono text-[13px] text-neon tracking-tight inline-block"
        >
          ~/{slug} $
        </Magnetic>
        <div className="hidden sm:flex items-center gap-7 text-[11.5px] font-mono text-mute">
          <Magnetic
            as={Link}
            href="/"
            strength={8}
            className="nav-link text-paper no-underline inline-block"
          >
            [HOME]
          </Magnetic>
          {LINKS.map((l) => (
            <Magnetic
              key={l.href}
              as={Link}
              href={l.href}
              strength={8}
              className="nav-link text-mute no-underline hover:text-paper transition-colors inline-block"
            >
              [{l.label}]
            </Magnetic>
          ))}
          <ThemeToggle />
        </div>
        <div className="sm:hidden">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
