import Reveal from "@/components/ui/Reveal";
import SplitText from "@/components/ui/SplitText";
import CTAButton from "@/components/ui/CTAButton";

export default function BigCTA() {
  return (
    <section className="max-w-[1120px] mx-auto px-7 pt-10 pb-[90px]">
      <Reveal>
        <div className="relative overflow-hidden text-center rounded-[20px] p-[70px_30px]" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(160deg, var(--panel), var(--void))" }}>
          <h2 className="relative font-display font-bold text-[clamp(16px,2.6vw,22px)] tracking-tight mb-4 leading-relaxed">
            <SplitText text="Have an idea worth building?" by="word" step={50} />
          </h2>
          <p className="relative font-display font-semibold text-[clamp(13px,1.8vw,16px)] text-neon mb-8 leading-relaxed">
            Let&apos;s turn it into software.
          </p>
          <div className="relative flex gap-3.5 justify-center flex-wrap">
            <CTAButton variant="primary" href="/hire" className="px-6 py-3.5">Hire Me</CTAButton>
            <CTAButton variant="outline" href="/hire" className="px-6 py-3.5">Start a Project</CTAButton>
            <CTAButton variant="outline" href="/contact" className="px-6 py-3.5">Book a Call</CTAButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
