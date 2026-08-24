import Reveal from "@/components/ui/Reveal";

const LINES = ["Build things that matter.", "Keep it simple.", "Engineer for scale.", "Performance is a feature.", "Great software feels invisible."];

export default function Philosophy() {
  return (
    <section className="max-w-[900px] mx-auto px-7 py-16 text-center">
      <Reveal>
        <span className="font-mono text-xs tracking-widest" style={{ color: "rgba(180,92,255,0.422)" }}>PHILOSOPHY</span>
      </Reveal>
      <div className="mt-[22px] flex flex-col gap-1">
        {LINES.map((line, i) => (
          <Reveal key={line} delay={i * 90}>
            <p className={`font-display font-semibold text-[clamp(20px,3.4vw,30px)] my-1.5 tracking-tight ${i % 2 === 0 ? "text-paper" : "text-violet"}`}>{line}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
