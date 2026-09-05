"use client";
import { useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { useInView } from "framer-motion";

export type StatItem = { icon?: string; value: number; suffix?: string; label: string };

const FALLBACK: StatItem[] = [
  { icon: "Award", value: 3, suffix: "+", label: "Years building software" },
  { icon: "Code2", value: 6, suffix: "+", label: "Products shipped" },
  { icon: "Users", value: 8, suffix: "+", label: "Clients & collaborators" },
  { icon: "Cpu", value: 12, suffix: "+", label: "Technologies used in production" },
];

function Counter({ to, suffix, shown }: { to: number; suffix: string; shown: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!shown) { setN(0); return; }
    let raf: number;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / 1400, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [shown, to]);
  return <span>{n}{suffix}</span>;
}

export default function DevStats({ items = FALLBACK }: { items?: StatItem[] }) {
  const ref = useRef(null);
  const shown = useInView(ref, { once: false, amount: 0.4 });
  return (
    <section ref={ref} className="max-w-[1120px] mx-auto px-7 py-12 grid grid-cols-2 md:grid-cols-4 gap-5">
      {items.map((s, i) => {
        const Icon = (Icons as any)[s.icon || "Award"] || Icons.Award;
        return (
          <Reveal key={s.label} delay={i * 90}>
            <div className="hover-card rounded-xl p-6 bg-ink2" style={{ border: "1px solid rgba(243,240,247,0.09)" }}>
              <Icon size={20} className="text-violet mb-3.5" />
              <div className="font-display font-bold text-[32px] bg-gradient-to-r from-violet to-purple bg-clip-text text-transparent">
                <Counter to={s.value} suffix={s.suffix || ""} shown={shown} />
              </div>
              <div className="text-mute text-[13px] mt-1.5">{s.label}</div>
            </div>
          </Reveal>
        );
      })}
    </section>
  );
}
