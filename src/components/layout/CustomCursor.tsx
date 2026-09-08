"use client";
import { useEffect, useRef, useState } from "react";

// Retro reticle cursor: a glowing phosphor dot plus a bracket-cornered ring
// that widens and turns dashed-magenta on hover, or solid-amber while
// something is being dragged (see lib/cursorBus.ts). Includes a small
// coordinate readout, like an old CAD/paint program HUD.
export default function CustomCursor() {
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      setCoords({ x: e.clientX, y: e.clientY });
      if (dotRef.current) dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      if (coordsRef.current) coordsRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;

      const target = e.target as HTMLElement;
      setHovering(!!target.closest("a, button, input, select, textarea, [data-cursor-hover]"));
    };
    window.addEventListener("mousemove", move);

    const onDrag = (e: Event) => setDragging(!!(e as CustomEvent).detail);
    window.addEventListener("cursor-drag", onDrag);

    let raf: number;
    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.2;
      ring.current.y += (pos.current.y - ring.current.y) * 0.2;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("cursor-drag", onDrag);
      cancelAnimationFrame(raf);
    };
  }, []);

  const size = dragging ? 46 : hovering ? 38 : 22;
  const color = dragging ? "var(--amber)" : hovering ? "var(--magenta)" : "var(--green)";

  return (
    <div className="hidden md:block fixed inset-0 pointer-events-none z-[10001]">
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5"
        style={{ background: "var(--green)", boxShadow: "0 0 6px var(--green), 0 0 12px var(--green)" }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 transition-[width,height,border-color,margin,background] duration-150"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          border: `1px ${dragging ? "solid" : hovering ? "dashed" : "solid"} ${color}`,
          background: dragging ? "rgba(255,180,0,0.12)" : "transparent",
        }}
      >
        <span className="absolute w-1 h-1" style={{ top: -2, left: -2, background: color }} />
        <span className="absolute w-1 h-1" style={{ bottom: -2, right: -2, background: color }} />
      </div>
      <div
        ref={coordsRef}
        className="fixed top-0 left-0 font-mono text-[10px] whitespace-nowrap"
        style={{ color: "var(--text-dim)", marginTop: 14, marginLeft: 14, letterSpacing: 0.5 }}
      >
        {coords.x},{coords.y}
      </div>
    </div>
  );
}
