import { Star, PenLine } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";
import type { TestimonialItem } from "@/types";

const FALLBACK: TestimonialItem[] = [
  { clientName: "Amaka O.", position: "Product Lead", company: "EdTech Startup", quote: "Daniel took a messy content pipeline and turned it into something our whole team could actually rely on.", rating: 5 },
  { clientName: "Tomiwa A.", position: "Founder", company: "Media Network", quote: "The podcast app redesign felt like a completely different product. Smooth, fast, and it just works.", rating: 5 },
  { clientName: "Chidera E.", position: "Operations Manager", quote: "Reliable is the word I'd use. Deadlines were hit and the backend has held up without a single incident.", rating: 5 },
];

export default function Testimonials({ items = FALLBACK }: { items?: TestimonialItem[] }) {
  return (
    <section className="max-w-[1120px] mx-auto px-7 py-16">
      <Reveal>
        <div className="text-center mb-11">
          <span className="font-mono text-xs tracking-widest" style={{ color: "rgba(180,92,255,0.422)" }}>WHAT PEOPLE SAY</span>
          <h2 className="font-display font-semibold text-[clamp(28px,3.6vw,40px)] mt-2 tracking-tight">Testimonials</h2>
        </div>
      </Reveal>      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((t, i) => (
          <Reveal key={t.clientName} delay={i * 90}>
            <div className="hover-card rounded-xl p-6 bg-ink2 h-full" style={{ border: "1px solid rgba(243,240,247,0.09)" }}>
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating || 5 }).map((_, si) => <Star key={si} size={13} className="text-violet fill-violet" />)}
              </div>
              <p className="text-[14px] leading-relaxed mb-5 italic" style={{ color: "rgba(243,240,247,0.8)" }}>&quot;{t.quote}&quot;</p>
              <div className="flex items-center gap-2.5">
                <SafeImage src={t.avatar} className="w-[38px] h-[38px] rounded-full object-cover transition-transform duration-300 hover:scale-110" iconSize={16} />
                <div>
                  <div className="text-[13.5px] font-semibold">{t.clientName}</div>
                  <div className="text-xs text-mute">{[t.position, t.company].filter(Boolean).join(", ")}</div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={items.length * 90}>
        <div className="text-center mt-8">
          <Link href="/testimonials/new" className="inline-flex items-center gap-2 text-[13.5px] text-mute hover:text-violet transition-colors">
            <PenLine size={14} /> Worked with me? Leave a review
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
