import SafeImage from "@/components/ui/SafeImage";

export type TechItem = { name: string; iconUrl: string };

// Real brand logos via simple-icons, recolored to phosphor green through the
// CDN's color parameter — flat, monochrome, on-theme, rather than each
// tool's actual (colorful, "modern shiny") brand color.
export const DEFAULT_TECH: TechItem[] = [
  { name: "React Native", iconUrl: "https://cdn.simpleicons.org/react/39FF14" },
  { name: "Next.js", iconUrl: "https://cdn.simpleicons.org/nextdotjs/39FF14" },
  { name: "TypeScript", iconUrl: "https://cdn.simpleicons.org/typescript/39FF14" },
  { name: "Node.js", iconUrl: "https://cdn.simpleicons.org/nodedotjs/39FF14" },
  { name: "MongoDB", iconUrl: "https://cdn.simpleicons.org/mongodb/39FF14" },
  { name: "Tailwind CSS", iconUrl: "https://cdn.simpleicons.org/tailwindcss/39FF14" },
  { name: "Redux Toolkit", iconUrl: "https://cdn.simpleicons.org/redux/39FF14" },
  { name: "Express", iconUrl: "https://cdn.simpleicons.org/express/39FF14" },
  { name: "GSAP", iconUrl: "https://cdn.simpleicons.org/greensock/39FF14" },
];

export default function Marquee({ items = DEFAULT_TECH }: { items?: TechItem[] }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-retroBorder py-5 bg-ink2">
      <div className="marquee-track flex gap-3 w-max">
        {row.map((t, i) => (
          <div
            key={`${t.name}-${i}`}
            className="flex items-center gap-2.5 px-4 py-2 flex-shrink-0 border border-retroBorder bg-ink"
          >
            <SafeImage src={t.iconUrl} alt={t.name} className="w-[16px] h-[16px] object-contain" iconSize={14} />
            <span className="font-mono text-[12.5px] whitespace-nowrap text-mute">[{t.name}]</span>
          </div>
        ))}
      </div>
    </div>
  );
}
