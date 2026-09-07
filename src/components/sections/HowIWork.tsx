import * as Icons from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export type WorkflowStepItem = { icon?: string; title: string; description: string };

const FALLBACK: WorkflowStepItem[] = [
  { icon: "Search", title: "Discover", description: "Understand the problem before touching code." },
  { icon: "PenTool", title: "Plan", description: "Map scope, architecture and milestones." },
  { icon: "Code2", title: "Design", description: "Structure the data, screens and flows." },
  { icon: "Hammer", title: "Build", description: "Ship in small, reviewable increments." },
  { icon: "TestTube2", title: "Test", description: "Catch issues before your users do." },
  { icon: "Rocket", title: "Launch", description: "Ship it — deploy, monitor, stabilize." },
  { icon: "TrendingUp", title: "Scale", description: "Grow the system as real usage arrives." },
];

export default function HowIWork({ items = FALLBACK }: { items?: WorkflowStepItem[] }) {
  return (
    <section className="max-w-[1120px] mx-auto px-7 py-16">
      <Reveal>
        <div className="text-center mb-12">
          <span className="font-mono text-xs tracking-widest text-violet">$ FROM IDEA TO PRODUCT</span>
          <h2 className="font-display font-semibold text-[clamp(16px,2.2vw,22px)] mt-3 tracking-tight leading-relaxed">How I work</h2>
        </div>
      </Reveal>
      <div className="flex flex-wrap justify-center">
        {items.map((w, i) => {
          const Icon = (Icons as any)[w.icon || "Search"] || Icons.Search;
          return (
            <Reveal key={w.title} delay={i * 80} className="flex items-center">
              <div className="flex flex-col items-center w-[120px] text-center">
                <div
                  className="animate-ambientGlow w-[52px] h-[52px] rounded-full flex items-center justify-center text-violet mb-3 bg-ink2"
                  style={{ animationDelay: `${i * 0.3}s`, border: "1px solid #00E5FF" }}
                >
                  <Icon size={20} />
                </div>
                <div className="font-display font-semibold text-sm">{w.title}</div>
                <div className="text-[11.5px] text-mute mt-1">{w.description}</div>
              </div>
              {i < items.length - 1 && <div className="hidden sm:block w-7 h-px mx-1 mb-10" style={{ background: "rgba(0,229,255,0.15)" }} />}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
