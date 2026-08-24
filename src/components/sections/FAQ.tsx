"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import type { FAQItem } from "@/types";

const FALLBACK: FAQItem[] = [
  { question: "What technologies do you use?", answer: "Mostly React Native for mobile, Next.js for web, and Node.js with MongoDB on the backend." },
  { question: "What type of projects do you accept?", answer: "Mobile apps, web platforms, and backend/API work — from MVPs to features on an existing product." },
  { question: "How much do you charge?", answer: "Depends on scope — hourly, project-based, or monthly retainer. See the rate cards above." },
  { question: "How long does a project take?", answer: "A focused MVP typically takes 3–6 weeks; larger builds are scoped milestone by milestone." },
  { question: "Do you work with startups?", answer: "Yes — early-stage products are a lot of what I build." },
  { question: "Do you work remotely?", answer: "Yes, fully remote, async-friendly across time zones." },
];

function Item({ item, i }: { item: FAQItem; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={i * 60}>
      <div className="border-b border-white/[0.07]">
        <button onClick={() => setOpen((o) => !o)} className="w-full flex justify-between items-center py-[18px] px-1 text-left">
          <span className="text-[15px] font-medium">{item.question}</span>
          <ChevronDown size={18} className={`text-violet flex-shrink-0 ml-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>
        <div className="overflow-hidden transition-[max-height] duration-400" style={{ maxHeight: open ? 200 : 0 }}>
          <p className="text-mute text-sm leading-relaxed px-1 pb-[18px]">{item.answer}</p>
        </div>
      </div>
    </Reveal>
  );
}

export default function FAQ({ items = FALLBACK }: { items?: FAQItem[] }) {
  return (
    <section className="max-w-[780px] mx-auto px-7 py-16">
      <Reveal>
        <div className="text-center mb-10">
          <span className="font-mono text-xs tracking-widest" style={{ color: "rgba(180,92,255,0.422)" }}>FAQ</span>
          <h2 className="font-display font-semibold text-[clamp(26px,3.2vw,36px)] mt-2 tracking-tight">Common questions</h2>
        </div>
      </Reveal>
      <div>{items.map((f, i) => <Item key={f.question} item={f} i={i} />)}</div>
    </section>
  );
}
