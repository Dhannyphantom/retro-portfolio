import { Search, PenTool, Code2, Hammer, TestTube2, Rocket, TrendingUp } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const STEPS = [
  { icon: Search, title: "Discover", desc: "Understand the problem before touching code." },
  { icon: PenTool, title: "Plan", desc: "Map scope, architecture and milestones." },
  { icon: Code2, title: "Design", desc: "Structure the data, screens and flows." },
  { icon: Hammer, title: "Build", desc: "Ship in small, reviewable increments." },
  { icon: TestTube2, title: "Test", desc: "Catch issues before your users do." },
  { icon: Rocket, title: "Launch", desc: "Ship it — deploy, monitor, stabilize." },
  { icon: TrendingUp, title: "Scale", desc: "Grow the system as real usage arrives." },
];

export default function HowIWork() {
  return (
    <section className="max-w-[1120px] mx-auto px-7 py-16">
      <Reveal>
        <div className="text-center mb-12">
          <span className="font-mono text-xs tracking-widest" style={{ color: "rgba(180,92,255,0.422)" }}>FROM IDEA TO PRODUCT</span>
          <h2 className="font-display font-semibold text-[clamp(28px,3.6vw,40px)] mt-2 tracking-tight">How I work</h2>
        </div>
      </Reveal>
      <div className="flex flex-wrap justify-center">
        {STEPS.map((w, i) => (
          <Reveal key={w.title} delay={i * 80} className="flex items-center">
            <div className="flex flex-col items-center w-[120px] text-center">
              <div
                className="animate-ambientGlow w-[52px] h-[52px] rounded-full flex items-center justify-center text-violet mb-3 bg-ink2"
                style={{ animationDelay: `${i * 0.3}s`, border: "1px solid #B45CFF" }}
              >
                <w.icon size={20} />
              </div>
              <div className="font-display font-semibold text-sm">{w.title}</div>
              <div className="text-[11.5px] text-mute mt-1">{w.desc}</div>
            </div>
            {i < STEPS.length - 1 && <div className="hidden sm:block w-7 h-px mx-1 mb-10" style={{ background: "rgba(180,92,255,0.15)" }} />}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
