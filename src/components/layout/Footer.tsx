const LINKS = ["Home", "About", "Projects", "Services", "Contact"];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.07] px-7 pt-10 pb-6">
      <div className="max-w-[1120px] mx-auto flex flex-wrap justify-between gap-8 mb-8">
        <div className="max-w-[260px]">
          <div className="font-display font-bold text-lg mb-2.5">Daniel Olojo</div>
          <p className="text-mute text-[13px] leading-relaxed">
            Software developer building mobile, web and backend products that hold up under real use.
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {LINKS.map((l) => (
            <a key={l} href={l === "Home" ? "/" : `/${l.toLowerCase()}`} className="text-mute text-[13px] no-underline px-2.5 py-1 hover:text-violet transition-colors">
              {l}
            </a>
          ))}
        </div>
        <div className="flex gap-2.5">
          {["GitHub", "LinkedIn", "Email"].map((s) => (
            <a key={s} href="#" aria-label={s} className="icon-hover w-9 h-9 rounded border border-white/[0.12] flex items-center justify-center text-paper text-xs">
              {s[0]}
            </a>
          ))}
        </div>
      </div>
      <div className="max-w-[1120px] mx-auto border-t border-white/[0.07] pt-5 text-center text-mute text-[12.5px]">
        © {new Date().getFullYear()} Daniel Olojo. Designed with intent.
      </div>
    </footer>
  );
}
