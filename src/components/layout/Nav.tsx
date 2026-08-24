"use client";
import Link from "next/link";

const LINKS = [
  { href: "/#about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  return (
    <div className="relative z-50">
      <div className="max-w-[1120px] mx-auto px-7 pt-6 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-lg tracking-tight">
          Daniel Olojo
        </Link>
        <div className="hidden sm:flex gap-8 text-[13.5px] text-mute">
          <Link href="/" className="nav-link text-paper no-underline">Home</Link>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link text-mute no-underline hover:text-paper transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
