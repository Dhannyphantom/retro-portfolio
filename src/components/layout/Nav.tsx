import Link from "next/link";

const LINKS = [
  { href: "/#about", label: "ABOUT" },
  { href: "/projects", label: "PROJECTS" },
  { href: "/services", label: "SERVICES" },
  { href: "/account/login", label: "CLIENT" },
];

export default function Nav({ name = "Daniel Olojo" }: { name?: string }) {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="sticky top-0 z-50 border-b border-retroBorder" style={{ background: "rgba(10,1,24,0.92)" }}>
      <div className="max-w-[1120px] mx-auto px-7 py-4 flex items-center justify-between">
        <Link href="/" className="font-mono text-[13px] text-violet tracking-tight">
          ~/{slug} $
        </Link>
        <div className="hidden sm:flex gap-7 text-[11.5px] font-mono text-mute">
          <Link href="/" className="nav-link text-paper no-underline">[HOME]</Link>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link text-mute no-underline hover:text-paper transition-colors">
              [{l.label}]
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
