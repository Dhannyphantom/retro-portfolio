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
    <footer className="relative z-10 border-t border-white/[0.07] px-7 pt-10 pb-6">
      <div className="max-w-[1120px] mx-auto flex flex-wrap justify-between gap-8 mb-8">
        <div className="max-w-[260px]">
          <div className="font-display font-bold text-lg mb-2.5">{name}</div>
          <p className="text-mute text-[13px] leading-relaxed">{bio}</p>
        </div>
        <div className="flex flex-wrap gap-1 items-center">
          {LINKS.map((l) => (
            <Link key={l} href={l === "Home" ? "/" : `/${l.toLowerCase()}`} className="text-mute text-[13px] no-underline px-2.5 py-1 hover:text-violet transition-colors">
              {l}
            </Link>
          ))}
          <Link href="/account/login" className="text-mute text-[13px] no-underline px-2.5 py-1 hover:text-violet transition-colors">
            Client login
          </Link>
        </div>
        <div className="flex gap-2.5">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} aria-label={s.label} className="icon-hover w-9 h-9 rounded border border-white/[0.12] flex items-center justify-center text-paper">
              <s.icon size={16} />
            </a>
          ))}
        </div>
      </div>
      <div className="max-w-[1120px] mx-auto border-t border-white/[0.07] pt-5 text-center text-mute text-[12.5px]">
        © {new Date().getFullYear()} {name}. Designed with intent.
      </div>
    </footer>
  );
}
