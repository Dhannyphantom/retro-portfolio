import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

const LINKS = ["Home", "About", "Projects", "Services", "Contact"];

export default function Footer({
  name = "Daniel Olojo",
  bio = "Software developer building mobile, web and backend products that hold up under real use.",
  email,
  socials,
}: {
  name?: string;
  bio?: string;
  email?: string;
  socials?: { github?: string; linkedin?: string; twitter?: string };
}) {
  const SOCIALS = [
    { icon: Github, label: "GitHub", href: socials?.github || "#" },
    { icon: Linkedin, label: "LinkedIn", href: socials?.linkedin || "#" },
    { icon: Mail, label: "Email", href: email ? `mailto:${email}` : "#" },
  ];

  return (
    <footer className="relative z-10 border-t border-retroBorder px-7 pt-10 pb-6">
      <div className="max-w-[1120px] mx-auto flex flex-wrap justify-between gap-8 mb-8">
        <div className="max-w-[260px]">
          <div className="font-mono text-[13px] text-violet mb-2.5">~/{name.toLowerCase().replace(/\s+/g, "-")}</div>
          <p className="text-mute text-[12.5px] leading-relaxed font-mono">{bio}</p>
        </div>
        <div className="flex flex-wrap gap-1 items-center font-mono text-[12px]">
          {LINKS.map((l) => (
            <Link key={l} href={l === "Home" ? "/" : `/${l.toLowerCase()}`} className="text-mute no-underline px-2.5 py-1 hover:text-violet transition-colors">
              [{l.toUpperCase()}]
            </Link>
          ))}
          <Link href="/account/login" className="text-mute no-underline px-2.5 py-1 hover:text-violet transition-colors">
            [CLIENT LOGIN]
          </Link>
        </div>
        <div className="flex gap-2.5">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} aria-label={s.label} className="icon-hover w-9 h-9 border border-retroBorder flex items-center justify-center text-paper">
              <s.icon size={16} />
            </a>
          ))}
        </div>
      </div>
      <div className="max-w-[1120px] mx-auto border-t border-retroBorder pt-5 text-center text-mute text-[11.5px] font-mono">
        © {new Date().getFullYear()} {name}. All rights reserved.
      </div>
    </footer>
  );
}
