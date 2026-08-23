const ITEMS = ["React Native", "Next.js", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS", "Redux Toolkit", "Express", "GSAP", "REST APIs"];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden border-y border-white/[0.07] py-[18px]">
      <div className="marquee-track flex gap-12 w-max">
        {row.map((t, i) => (
          <span key={i} className="font-mono text-[13px] whitespace-nowrap opacity-[0.85]" style={{ color: i % ITEMS.length === 0 ? "rgba(180,92,255,0.62)" : "#A79FB8" }}>
            {t} <span className="ml-12" style={{ color: "rgba(139,47,224,0.5)" }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
