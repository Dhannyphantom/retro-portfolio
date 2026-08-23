import { Check } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import DiagonalCard from "@/components/ui/DiagonalCard";
import CTAButton from "@/components/ui/CTAButton";
import type { RateCardItem } from "@/types";

const FALLBACK: RateCardItem[] = [
  { name: "Hourly", billingType: "hourly", price: "$35", unit: "/ hour", description: "For focused, well-scoped work.", features: ["Flexible engagement", "Weekly time logs", "Async updates", "No minimum commitment"] },
  { name: "Project-Based", billingType: "project", price: "$1,200", unit: "starting at", description: "For a defined product or feature set.", features: ["Fixed scope & timeline", "Milestone check-ins", "Source code ownership", "30 days post-launch support"], recommended: true },
  { name: "Monthly Retainer", billingType: "retainer", price: "$800", unit: "/ month", description: "For ongoing product partnership.", features: ["Priority response time", "Feature + maintenance work", "Monthly planning call", "Cancel anytime"] },
];

export default function RateCards({ items = FALLBACK }: { items?: RateCardItem[] }) {
  return (
    <section className="max-w-[1120px] mx-auto px-7 py-16">
      <Reveal>
        <div className="text-center mb-11">
          <span className="font-mono text-xs tracking-widest" style={{ color: "rgba(180,92,255,0.62)" }}>LET&apos;S TALK BUSINESS</span>
          <h2 className="font-display font-semibold text-[clamp(28px,3.6vw,40px)] mt-2 tracking-tight">Rate cards</h2>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((r, i) => (
          <Reveal key={r.name} delay={i * 90}>
            <DiagonalCard
              always={!!r.recommended}
              radius={14}
              padding={r.recommended ? 2 : 1}
              className="h-full"
              style={r.recommended ? { background: "linear-gradient(160deg, rgba(76,29,149,0.09), transparent)" } : {}}
            >
              <div className="p-7 flex flex-col h-full relative">
                {r.recommended && (
                  <span className="absolute -top-3 left-6 text-[10.5px] font-mono px-2.5 py-1 rounded text-paper bg-gradient-to-r from-violet to-purple tracking-wide">
                    RECOMMENDED
                  </span>
                )}
                <div className="text-mute text-[13px] mb-1.5">{r.name}</div>
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="font-display font-bold text-[30px]">{r.price}</span>
                  <span className="text-mute text-xs">{r.unit}</span>
                </div>
                <p className="text-mute text-[13px] mb-5">{r.description}</p>
                <div className="flex flex-col gap-2.5 mb-6 flex-1">
                  {(r.features || []).map((f) => (
                    <div key={f} className="flex items-center gap-2 text-[13px]" style={{ color: "rgba(243,240,247,0.8)" }}>
                      <Check size={14} className="text-violet" /> {f}
                    </div>
                  ))}
                </div>
                <CTAButton variant={r.recommended ? "primary" : "outline"} href="/hire" className="w-full">
                  Get started
                </CTAButton>
              </div>
            </DiagonalCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
