"use client";
import { MouseEvent, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  always?: boolean; // kept for API compat — controls whether the marching-ants border shows always or only on hover
  radius?: number;  // kept for API compat, has no visual effect (retro = sharp corners everywhere)
  padding?: number;
  hoverLift?: boolean;
  title?: string;   // when set, renders a retro OS-style title bar above the content
  className?: string;
  style?: React.CSSProperties;
};

// A retro "window" panel — flat bordered box, optional title bar with fake
// window controls, and a dashed "marching ants" border that lights up on
// hover (or always, via `always`). When hoverLift is set, the whole panel
// also gets a heavy, springy 3D tilt/skew toward the cursor — same physics
// family as ui/Magnetic.tsx, just applied to a panel instead of a button.
export default function DiagonalCard({ children, always = true, padding = 2, hoverLift = false, title, className = "", style = {} }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springCfg = { stiffness: 120, damping: 14, mass: 1 };
  const srx = useSpring(rx, springCfg);
  const sry = useSpring(ry, springCfg);
  const skewX = useTransform(sry, [-8, 0, 8], [-3, 0, 3]);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!hoverLift || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rx.set(py * -8);
    ry.set(px * 8);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("win relative", always && "always-march", "diag-wrap", hoverLift && "hover-card", className)}
      style={{
        padding,
        transformPerspective: hoverLift ? 800 : undefined,
        rotateX: hoverLift ? srx : undefined,
        rotateY: hoverLift ? sry : undefined,
        skewX: hoverLift ? skewX : undefined,
        ...style,
      }}
    >
      <span className="marching-border" />
      {title && (
        <div className="win-bar -m-[2px] mb-0">
          <span className="win-title">{title}</span>
          <span className="win-controls">
            <span className="win-dot">▢</span>
            <span className="win-dot">×</span>
          </span>
        </div>
      )}
      <div className="relative overflow-hidden bg-ink2 h-full">{children}</div>
    </motion.div>
  );
}
