"use client";
import { useState, MouseEvent } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
};

// Retro terminal button: transparent with a colored border by default,
// fills solid on hover, hard press-down on click — no magnetic cursor-
// following (that's a modern web trope), no gradient, no light-sweep shine.
export default function CTAButton({ children, variant = "primary", href, onClick, className = "", type = "button" }: Props) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const trigger = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 650);
    onClick?.();
  };

  const base = cn(
    "inline-flex items-center justify-center gap-2 text-[13px] font-medium relative overflow-hidden px-5 py-3 uppercase tracking-wide retro-btn",
    variant === "outline" && "retro-btn-cyan",
    className
  );

  const content = (
    <>
      {children}
      {ripples.map((r) => (
        <span key={r.id} className="ripple-el" style={{ left: r.x, top: r.y }} />
      ))}
    </>
  );

  if (href) {
    return (
      <a href={href} onClick={trigger} className={base}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} onClick={trigger} className={base}>
      {content}
    </button>
  );
}
