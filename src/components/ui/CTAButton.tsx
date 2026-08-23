"use client";
import { useState, MouseEvent } from "react";
import Magnetic from "./Magnetic";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
};

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
    "inline-flex items-center justify-center gap-2 text-sm rounded relative overflow-hidden px-5 py-3",
    variant === "primary" ? "font-semibold text-paper bg-gradient-to-r from-purple to-purple-2 shine-wrap" : "font-medium text-paper border border-white/[0.16] fill-wrap",
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
      <Magnetic as="a" href={href} onClick={trigger} className={base}>
        {content}
      </Magnetic>
    );
  }
  return (
    <Magnetic as="button" type={type} onClick={trigger} className={base}>
      {content}
    </Magnetic>
  );
}
