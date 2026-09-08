import Reveal from "@/components/ui/Reveal";

const FALLBACK = ["Build things that matter.", "Keep it simple.", "Engineer for scale.", "Performance is a feature.", "Great software feels invisible."];

export default function Philosophy({ lines = FALLBACK }: { lines?: string[] }) {
  return (
    <section className="max-w-[900px] mx-auto px-7 py-16 text-center">
      <Reveal>
        <span className="font-mono text-xs tracking-widest text-neon">$ PHILOSOPHY</span>
      </Reveal>
      <div className="mt-[22px] flex flex-col gap-1">
        {lines.map((line, i) => (
          <Reveal key={line} delay={i * 90}>
            <p className={`font-display font-semibold text-[clamp(12px,1.8vw,16px)] my-2.5 tracking-tight leading-relaxed ${i % 2 === 0 ? "text-paper" : "text-neon"}`}>{line}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
