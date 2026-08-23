import Reveal from "@/components/ui/Reveal";
import type { ExperienceItem } from "@/types";

const FALLBACK: ExperienceItem[] = [
  { role: "Software Developer", organization: "Guru EduTech", startDate: "2023", endDate: "Present", description: "Building mobile apps, an exam-prep content pipeline, and the backend behind a monthly quiz competition.", technologies: ["React Native", "Node.js", "MongoDB", "Next.js"] },
  { role: "Full-Stack Developer", organization: "Freelance", startDate: "2021", endDate: "2023", description: "Shipped web and mobile products for independent clients.", technologies: ["React", "Next.js", "Express"] },
  { role: "Self-Taught Foundations", organization: "Independent Study", startDate: "2019", endDate: "2021", description: "Learned JavaScript, React and React Native by building.", technologies: ["JavaScript", "React", "React Native"] },
];

export default function Experience({ items = FALLBACK }: { items?: ExperienceItem[] }) {
  return (
    <section id="experience" className="max-w-[1120px] mx-auto px-7 py-16">
      <Reveal>
        <div className="text-center mb-11">
          <span className="font-mono text-xs tracking-widest" style={{ color: "rgba(180,92,255,0.62)" }}>THE JOURNEY</span>
          <h2 className="font-display font-semibold text-[clamp(28px,3.6vw,40px)] mt-2 tracking-tight">Experience</h2>
        </div>
      </Reveal>
      <div className="relative max-w-[760px] mx-auto">
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5" style={{ background: "linear-gradient(180deg, rgba(180,92,255,0.32), rgba(139,47,224,0.03))" }} />
        {items.map((e, i) => (
          <Reveal key={e.role + e.organization} delay={i * 100} className={`relative pl-10 ${i === items.length - 1 ? "" : "mb-9"}`}>
            <div
              className="absolute left-0 top-1 w-4 h-4 rounded-full bg-ink"
              style={{ border: "2px solid #B45CFF", boxShadow: i === 0 ? "0 0 8px 1px rgba(180,92,255,0.32)" : "none" }}
            />
            <div className="flex justify-between items-baseline flex-wrap gap-2 mb-2">
              <h4 className="font-display font-semibold text-lg">
                {e.role} · <span className="text-violet">{e.organization}</span>
              </h4>
              <span className="font-mono text-xs text-mute">{e.startDate} — {e.endDate || "Present"}</span>
            </div>
            {e.description && <p className="text-mute text-sm leading-relaxed mb-3">{e.description}</p>}
            <div className="flex flex-wrap gap-2">
              {(e.technologies || []).map((t) => (
                <span key={t} className="text-[11px] font-mono rounded px-2 py-1" style={{ color: "rgba(243,240,247,0.6)", background: "rgba(243,240,247,0.04)", border: "1px solid rgba(243,240,247,0.08)" }}>
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
