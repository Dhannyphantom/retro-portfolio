"use client";
import { useRef, useMemo, MouseEvent, ElementType } from "react";
import { motion, useMotionValue, useSpring, useTransform, MotionStyle } from "framer-motion";

type Props = {
  as?: ElementType;
  /** How far the element is pulled toward the cursor, in px at max offset. */
  strength?: number;
  /** Radius (px) around the element where the magnetic pull starts kicking in. */
  range?: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
};

// Heavy "magnetic" hover: the element leans toward the cursor with real
// spring weight (low stiffness + higher mass = momentum, not a snap), and
// racks into a skew as it's dragged around off-center — the same kind of
// heavy, springy pull used on the reference site. A short-range magnetic
// field (onMouseMove is only wired up once the cursor is already inside
// the element's own box, same as the previous version) keeps it from
// feeling like the whole page is grabbing at the cursor.
export default function Magnetic({
  as,
  strength = 26,
  range = 999,
  children,
  className = "",
  style,
  ...rest
}: Props) {
  const Tag = useMemo(() => {
    // Plain intrinsic tags ("a", "button", "div"...) resolve through
    // motion's proxy; anything else (e.g. next/link's Link) gets wrapped
    // via motion(Component) so client-side routing / other behavior still
    // works underneath the physics.
    if (!as || typeof as === "string") return (motion as any)[(as as string) || "button"];
    return motion(as as any);
  }, [as]);
  const ref = useRef<HTMLElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Heavy spring: low stiffness + real mass gives it weight and a touch of
  // overshoot instead of snapping straight to the target offset.
  const springCfg = { stiffness: 140, damping: 11, mass: 1.1 };
  const sx = useSpring(x, springCfg);
  const sy = useSpring(y, springCfg);
  const scale = useSpring(1, { stiffness: 300, damping: 18, mass: 0.6 });

  // Skew is derived from how far off-center the pull currently is, so the
  // button visibly "racks over" as it's dragged toward an edge and settles
  // flat again once it snaps back to center.
  const skewX = useTransform(sx, [-strength, 0, strength], [-10, 0, 10]);
  const skewY = useTransform(sy, [-strength, 0, strength], [6, 0, -6]);
  const rotate = useTransform(sx, [-strength, 0, strength], [-4, 0, 4]);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > range) return;
    x.set(Math.max(-strength, Math.min(strength, dx * 0.5)));
    y.set(Math.max(-strength, Math.min(strength, dy * 0.5)));
  };

  const onEnter = () => scale.set(1.08);
  const onLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={className}
      style={{ x: sx, y: sy, skewX, skewY, rotate, scale, ...(style as MotionStyle) }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
