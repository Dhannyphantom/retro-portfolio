"use client";
import { useState, MouseEvent } from "react";
import { Download } from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";
import SplitText from "@/components/ui/SplitText";
import SafeImage from "@/components/ui/SafeImage";

const PROFILE_IMG = "https://images.unsplash.com/photo-1506863530036-1efeddceb993?auto=format&fit=crop&w=600&q=80";

function OrbitBadge({ label, radius, size, dur, delay, angle }: { label: string; radius: number; size: number; dur: number; delay: number; angle: number }) {
  return (
    <div
      className="absolute top-1/2 left-1/2 pointer-events-none animate-spin2"
      style={{ width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius, animationDuration: `${dur}s`, animationDelay: `${delay}s` }}
    >
      <div className="absolute" style={{ top: -size / 2, left: "50%", marginLeft: -size / 2, transform: `rotate(${angle}deg) translate(0, ${radius}px) rotate(-${angle}deg)` }}>
        <div
          className="animate-spinReverse flex items-center justify-center rounded font-mono text-[10.5px] text-violet"
          style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s`, width: size, height: size, background: "rgba(17,12,24,0.92)", border: "1px solid rgba(180,92,255,0.218)" }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

export default function Hero({ name = "Daniel", headline = "Software Developer" }: { name?: string; headline?: string }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: px * 12, y: py * -12 });
  };

  return (
    <section
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative max-w-[1120px] mx-auto px-7 pt-16 pb-[70px] grid grid-cols-1 md:grid-cols-[1fr_0.8fr] gap-10 items-center"
    >
      <div>
        <p className="font-display text-[22px] text-violet mb-1.5">Hello.</p>
        <h1 className="font-display font-bold text-[clamp(30px,4vw,44px)] leading-[1.12] tracking-tight mb-1.5">
          <SplitText text={`I'm ${name}`} by="char" step={24} />
        </h1>
        <h2 className="font-display font-bold text-[clamp(30px,4vw,44px)] leading-[1.12] tracking-tight mb-9 bg-gradient-to-r from-violet to-purple bg-clip-text text-transparent">
          {headline}
        </h2>
        <div className="flex gap-3.5 flex-wrap">
          <CTAButton href="/hire" variant="primary">Get a project</CTAButton>
          <CTAButton href="/cv" variant="outline">
            <Download size={14} /> My resume
          </CTAButton>
        </div>
      </div>

      <div className="relative mx-auto aspect-[1/1.1] w-full max-w-[340px]">
        <div
          className="relative w-full h-full transition-transform duration-300"
          style={{ transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)` }}
        >
          <OrbitBadge label="RN" radius={158} size={38} dur={20} delay={0} angle={35} />
          <OrbitBadge label="Next" radius={158} size={38} dur={20} delay={-6.6} angle={155} />
          <OrbitBadge label="Node" radius={158} size={38} dur={20} delay={-13.3} angle={275} />

          <div className="absolute top-[4%] left-[2%] w-1.5 h-1.5 rounded-full bg-violet animate-floatSmall" style={{ boxShadow: "0 0 7px 1px rgba(180,92,255,0.272)" }} />
          <div className="absolute bottom-[6%] right-0 w-[5px] h-[5px] rounded-full bg-purple animate-floatSmall [animation-delay:1.4s]" style={{ boxShadow: "0 0 7px 1px rgba(139,47,224,0.272)" }} />

          <div className="absolute inset-[10%] rounded-full border-2 border-purple animate-breathe" style={{ boxShadow: "0 0 36px 6px rgba(139,47,224,0.122)" }} />
          <div className="absolute inset-[18%] rounded-full overflow-hidden border border-white/10 animate-ambientGlow">
            <SafeImage src={PROFILE_IMG} alt={name} className="w-full h-full object-cover" iconSize={46} />
          </div>
        </div>
      </div>
    </section>
  );
}
