"use client";
import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const [hovering, setHovering] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;

      const target = e.target as HTMLElement;
      setHovering(!!target.closest("a, button, [data-cursor-hover]"));
    };
    window.addEventListener("mousemove", move);

    let raf: number;
    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.16;
      ring.current.y += (pos.current.y - ring.current.y) * 0.16;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="hidden md:block fixed inset-0 pointer-events-none z-[200]">
      <div ref={dotRef} className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-violet pointer-events-none" />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none transition-[width,height,border-color,background] duration-300"
        style={{
          width: hovering ? 64 : 34,
          height: hovering ? 64 : 34,
          border: `1px solid ${hovering ? "#B45CFF" : "rgba(243,240,247,0.26)"}`,
          background: hovering ? "rgba(139,47,224,0.048)" : "transparent",
        }}
      />
    </div>
  );
}
