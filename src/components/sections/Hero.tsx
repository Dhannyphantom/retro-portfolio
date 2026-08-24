"use client";
import { useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";
import SplitText from "@/components/ui/SplitText";
import SafeImage from "@/components/ui/SafeImage";

const PROFILE_IMG = "https://images.unsplash.com/photo-1506863530036-1efeddceb993?auto=format&fit=crop&w=600&q=80";

export type TechBadge = { name: string; iconUrl: string };
const DEFAULT_BADGES: TechBadge[] = [
  { name: "React", iconUrl: "https://cdn.simpleicons.org/react" },
  { name: "Next.js", iconUrl: "https://cdn.simpleicons.org/nextdotjs/F3F0F7" },
  { name: "Node.js", iconUrl: "https://cdn.simpleicons.org/nodedotjs" },
];

function OrbitBadge({ badge, radius, size, dur, delay, angle, appear }: { badge: TechBadge; radius: number; size: number; dur: number; delay: number; angle: number; appear: number }) {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 pointer-events-none z-20"
      style={{ width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: appear, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute animate-spin2" style={{ inset: 0, animationDuration: `${dur}s`, animationDelay: `${delay}s` }}>
        <div className="absolute" style={{ top: -size / 2, left: "50%", marginLeft: -size / 2, transform: `rotate(${angle}deg) translate(0, ${radius}px) rotate(-${angle}deg)` }}>
          <div
            className="animate-spinReverse flex items-center justify-center rounded-full p-2"
            style={{
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
              width: size,
              height: size,
              background: "rgba(10,9,13,0.95)",
              border: "1px solid rgba(180,92,255,0.4)",
              boxShadow: "0 0 16px 2px rgba(139,47,224,0.28)",
            }}
          >
            <SafeImage src={badge.iconUrl} alt={badge.name} className="w-full h-full object-contain" iconSize={14} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero({ name = "Daniel", headline = "Software Developer", techBadges = DEFAULT_BADGES }: { name?: string; headline?: string; techBadges?: TechBadge[] }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const badges = techBadges.slice(0, 3);
  const angles = [35, 155, 275];

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: px * 12, y: py * -12 });
  };

  return (
    <section className="max-w-[1120px] mx-auto px-4 pt-8">
      {/* neumorphic dark panel with an animated purple glow living in its depth */}
      <div
        className="relative overflow-hidden rounded-[32px]"
        style={{
          background: "linear-gradient(160deg, #121014, #08070A 60%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -30px 60px rgba(0,0,0,0.5), 0 30px 60px -20px rgba(0,0,0,0.6)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute rounded-full animate-heroGlow"
            style={{
              width: 520, height: 520, top: "-8%", right: "-6%",
              background: "radial-gradient(circle, rgba(139,47,224,0.35) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute rounded-full animate-heroGlow"
            style={{
              width: 380, height: 380, bottom: "-14%", left: "-8%", animationDelay: "2.4s",
              background: "radial-gradient(circle, rgba(180,92,255,0.22) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        </div>

        <div
          onMouseMove={onMove}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          className="relative grid grid-cols-1 md:grid-cols-[1fr_0.8fr] gap-10 items-center px-6 sm:px-11 py-16"
        >
          <div>
            <motion.p
              className="font-display text-[22px] text-violet mb-1.5"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Hello.
            </motion.p>
            <h1 className="font-display font-bold text-[clamp(30px,4vw,44px)] leading-[1.12] tracking-tight mb-1.5">
              <SplitText text={`I'm ${name}`} by="char" step={24} />
            </h1>
            <motion.h2
              className="font-display font-bold text-[clamp(30px,4vw,44px)] leading-[1.12] tracking-tight mb-9 bg-gradient-to-r from-violet to-purple bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {headline}
            </motion.h2>
            <motion.div
              className="flex gap-3.5 flex-wrap"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <CTAButton href="/hire" variant="primary">Get a project</CTAButton>
              <CTAButton href="/cv" variant="outline">
                <Download size={14} /> My resume
              </CTAButton>
            </motion.div>
          </div>

          <div className="relative mx-auto aspect-[1/1.1] w-full max-w-[340px]">
            <div
              className="relative w-full h-full transition-transform duration-300"
              style={{ transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)` }}
            >
              {badges.map((b, i) => (
                <OrbitBadge key={b.name} badge={b} radius={158} size={38} dur={20} delay={-6.6 * i} angle={angles[i] ?? 35 + i * 120} appear={0.5 + i * 0.15} />
              ))}

              <div className="absolute top-[4%] left-[2%] w-1.5 h-1.5 rounded-full bg-violet animate-floatSmall" style={{ boxShadow: "0 0 7px 1px rgba(180,92,255,0.35)" }} />
              <div className="absolute bottom-[6%] right-0 w-[5px] h-[5px] rounded-full bg-purple animate-floatSmall [animation-delay:1.4s]" style={{ boxShadow: "0 0 7px 1px rgba(139,47,224,0.35)" }} />

              <motion.div
                className="absolute inset-[10%] rounded-full border-2 border-purple animate-breathe z-10"
                style={{ boxShadow: "0 0 46px 10px rgba(139,47,224,0.32)" }}
                initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.div
                className="absolute inset-[18%] rounded-full overflow-hidden border border-white/10 animate-ambientGlow z-10"
                initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <SafeImage src={PROFILE_IMG} alt={name} className="w-full h-full object-cover" iconSize={46} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
