"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";
import SplitText from "@/components/ui/SplitText";
import SafeImage from "@/components/ui/SafeImage";
import { setCursorDragging } from "@/lib/cursorBus";
import { useAchievements } from "@/lib/achievements";

const PROFILE_IMG = "https://images.unsplash.com/photo-1506863530036-1efeddceb993?auto=format&fit=crop&w=600&q=80";
const VIEWPORT = { once: false, amount: 0.4 };

export type TechBadge = { name: string; iconUrl: string };
const DEFAULT_BADGES: TechBadge[] = [
  { name: "React", iconUrl: "https://cdn.simpleicons.org/react/39FF14" },
  { name: "Next.js", iconUrl: "https://cdn.simpleicons.org/nextdotjs/39FF14" },
  { name: "Node.js", iconUrl: "https://cdn.simpleicons.org/nodedotjs/39FF14" },
];

// Orbits idly, but can be grabbed and flung — it snaps back to its orbital
// position on release (framer-motion's dragSnapToOrigin). A concrete,
// contained "mouse drag" interaction rather than a decorative gimmick.
function OrbitBadge({ badge, radius, size, dur, delay, angle, appear, boundsRef }: { badge: TechBadge; radius: number; size: number; dur: number; delay: number; angle: number; appear: number; boundsRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 z-20"
      style={{ width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius }}
      initial={{ opacity: 0, scale: 0.4 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.5, delay: appear }}
    >
      <div className="absolute animate-spin2 pointer-events-none" style={{ inset: 0, animationDuration: `${dur}s`, animationDelay: `${delay}s` }}>
        <div className="absolute pointer-events-auto" style={{ top: -size / 2, left: "50%", marginLeft: -size / 2, transform: `rotate(${angle}deg) translate(0, ${radius}px) rotate(-${angle}deg)` }}>
          <motion.div
            className="animate-spinReverse flex items-center justify-center p-2 win"
            drag
            dragConstraints={boundsRef as React.RefObject<HTMLDivElement>}
            dragElastic={0.4}
            dragSnapToOrigin
            whileDrag={{ scale: 1.25, zIndex: 50 }}
            onDragStart={() => setCursorDragging(true)}
            onDragEnd={() => setCursorDragging(false)}
            style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s`, width: size, height: size, cursor: "grab" }}
            data-cursor-hover
          >
            <SafeImage src={badge.iconUrl} alt={badge.name} className="w-full h-full object-contain p-1.5 pointer-events-none" iconSize={14} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero({ name = "Daniel", headline = "Software Developer", techBadges = DEFAULT_BADGES }: { name?: string; headline?: string; techBadges?: TechBadge[] }) {
  const badges = techBadges.slice(0, 3);
  const angles = [35, 155, 275];
  const boundsRef = useRef<HTMLDivElement>(null);
  const { unlock } = useAchievements();
  const [webcamClicks, setWebcamClicks] = useState(0);
  const [glitch, setGlitch] = useState(false);

  const handleWebcamClick = () => {
    const next = webcamClicks + 1;
    setWebcamClicks(next);
    if (next === 5) {
      unlock("curious_clicker");
      setGlitch(true);
      setTimeout(() => setGlitch(false), 420);
    }
  };

  return (
    <section className="max-w-[1120px] mx-auto px-7 pt-16 pb-[70px] grid grid-cols-1 md:grid-cols-[1fr_0.8fr] gap-10 items-center">
      <div>
        <motion.p
          className="font-mono text-[15px] text-neon mb-2"
          initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }}
        >
          {"> Hello."}
        </motion.p>
        <h1 className="font-display text-[clamp(18px,3vw,26px)] leading-[1.6] tracking-tight mb-3">
          <SplitText text={`I'm ${name}`} by="char" step={24} />
        </h1>
        <motion.h2
          className="font-mono text-[15px] text-neon mb-9"
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5, delay: 0.15 }}
        >
          {headline} <span className="animate-termBlink">█</span>
        </motion.h2>
        <motion.div
          className="flex gap-3.5 flex-wrap"
          initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5, delay: 0.3 }}
        >
          <CTAButton href="/hire" variant="primary">Get a project</CTAButton>
          <CTAButton href="/cv" variant="outline">
            <Download size={14} /> My resume
          </CTAButton>
        </motion.div>
      </div>

      <div ref={boundsRef} className="relative mx-auto aspect-[1/1.1] w-full max-w-[400px]">
        {/* photo presented as a retro "webcam" window rather than a soft
            glowing circular frame — flat border, scanline overlay, no blur */}
        <motion.div
          className={`win absolute inset-[16%] overflow-hidden z-10 ${glitch ? "glitch-flash" : ""}`}
          initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={VIEWPORT} transition={{ duration: 0.6 }}
          onClick={handleWebcamClick}
          data-cursor-hover
        >
          <div className="win-bar">
            <span className="win-title">WEBCAM.EXE{webcamClicks > 0 && webcamClicks < 5 ? ` (${webcamClicks}/5)` : ""}</span>
            <span className="win-controls"><span className="win-dot">▢</span><span className="win-dot">×</span></span>
          </div>
          <div className="relative">
            <SafeImage src={PROFILE_IMG} alt={name} className="w-full h-full object-cover grayscale contrast-125" iconSize={46} />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "repeating-linear-gradient(0deg, rgba(57,255,20,0.06) 0px, rgba(57,255,20,0.06) 1px, transparent 1px, transparent 3px)" }}
            />
          </div>
        </motion.div>

        {badges.map((b, i) => (
          <OrbitBadge key={b.name} badge={b} radius={172} size={40} dur={20} delay={-6.6 * i} angle={angles[i] ?? 35 + i * 120} appear={0.5 + i * 0.15} boundsRef={boundsRef} />
        ))}

        <div className="absolute top-[4%] left-[2%] w-1.5 h-1.5 bg-neon animate-floatSmall" />
        <div className="absolute bottom-[6%] right-0 w-[5px] h-[5px] bg-phosphor animate-floatSmall [animation-delay:1.4s]" />
      </div>
    </section>
  );
}
