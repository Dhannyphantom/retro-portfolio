import * as Icons from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import DiagonalCard from "@/components/ui/DiagonalCard";
import type { ServiceItem } from "@/types";

const FALLBACK: ServiceItem[] = [
  { title: "Mobile Development", description: "React Native apps built for real users.", icon: "Smartphone" },
  { title: "Web Development", description: "Next.js sites with motion, structure and copy that earns attention.", icon: "Globe" },
  { title: "Backend & APIs", description: "Node.js and MongoDB systems built to stay boring under real traffic.", icon: "Server" },
  { title: "MVP Development", description: "Ship a working product fast without boxing out scaling later.", icon: "Rocket" },
  { title: "Performance Optimization", description: "Faster loads, leaner bundles, fewer re-renders.", icon: "Zap" },
  { title: "Maintenance & Scaling", description: "Keeping shipped products healthy as usage grows.", icon: "Wrench" },
];

export default function Services({ items = FALLBACK }: { items?: ServiceItem[] }) {
  return (
    <section id="services" className="max-w-[1120px] mx-auto px-7 py-16">
      <Reveal>
        <div className="text-center mb-11">
          <span className="font-mono text-xs tracking-widest text-neon">$ WHAT I DO</span>
          <h2 className="font-display font-semibold text-[clamp(16px,2.2vw,22px)] mt-3 tracking-tight leading-relaxed">Services</h2>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((s, i) => {
          const Icon = (Icons as any)[s.icon || "Code2"] || Icons.Code2;
          return (
            <Reveal key={s.title} delay={i * 70}>
              <DiagonalCard always padding={0} hoverLift className="h-full" title={`SERVICE_0${i + 1}.SYS`}>
                <div className="p-6">
                  <div className="icon-hover w-[42px] h-[42px] flex items-center justify-center text-neon mb-[18px]" style={{ border: "1px solid rgba(0,229,255,0.122)", background: "rgba(57,255,20,0.034)" }}>
                    <Icon size={18} />
                  </div>
                  <h4 className="font-display text-[13px] mb-3 leading-relaxed">{s.title}</h4>
                  <p className="text-mute text-[13px] leading-relaxed font-mono">{s.description}</p>
                </div>
              </DiagonalCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
