import SafeImage from "@/components/ui/SafeImage";

export type TechItem = { name: string; iconUrl: string };

// Real brand logos via simple-icons (free, MIT-licensed CDN of SVG brand marks).
export const DEFAULT_TECH: TechItem[] = [
  { name: "React Native", iconUrl: "https://cdn.simpleicons.org/react" },
  { name: "Next.js", iconUrl: "https://cdn.simpleicons.org/nextdotjs/F3F0F7" },
  { name: "TypeScript", iconUrl: "https://cdn.simpleicons.org/typescript" },
  { name: "Node.js", iconUrl: "https://cdn.simpleicons.org/nodedotjs" },
  { name: "MongoDB", iconUrl: "https://cdn.simpleicons.org/mongodb" },
  { name: "Tailwind CSS", iconUrl: "https://cdn.simpleicons.org/tailwindcss" },
  { name: "Redux Toolkit", iconUrl: "https://cdn.simpleicons.org/redux" },
  { name: "Express", iconUrl: "https://cdn.simpleicons.org/express/F3F0F7" },
  { name: "GSAP", iconUrl: "https://cdn.simpleicons.org/greensock" },
];

export default function Marquee({ items = DEFAULT_TECH }: { items?: TechItem[] }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-white/[0.07] py-5" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.015), transparent)" }}>
      <div className="marquee-track flex gap-4 w-max">
        {row.map((t, i) => (
          <div
            key={`${t.name}-${i}`}
            className="flex items-center gap-2.5 rounded-full px-4 py-2 flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #17151C, #0B0A0D)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <SafeImage src={t.iconUrl} alt={t.name} className="w-[18px] h-[18px] object-contain" iconSize={14} />
            <span className="font-mono text-[12.5px] whitespace-nowrap text-mute">{t.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
