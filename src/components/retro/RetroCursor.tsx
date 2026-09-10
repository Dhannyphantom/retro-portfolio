"use client";
import { useEffect, useRef, useState } from "react";

// Pixel-arrow cursor + a lazily-trailing magnetic ring that expands over
// interactive elements. Only mounted on pages using the new retro UI (see
// SiteChrome) — scoped there so it never fights the old CustomCursor on
// pages that haven't been migrated yet.
export default function RetroCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const [clicking, setClicking] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const animRing = () => {
      ringPos.current.x += (posRef.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (posRef.current.y - ringPos.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(animRing);
    };
    rafRef.current = requestAnimationFrame(animRing);

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);
    const onEnterLink = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a,button,[data-cursor-hover]")) setExpanded(true);
    };
    const onLeaveLink = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a,button,[data-cursor-hover]")) setExpanded(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseover", onEnterLink);
    window.addEventListener("mouseout", onLeaveLink);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseover", onEnterLink);
      window.removeEventListener("mouseout", onLeaveLink);
    };
  }, []);

  return (
    <div className="hidden md:block">
      <div ref={cursorRef} className={`retro-cursor${clicking ? " clicking" : ""}`} />
      <div ref={ringRef} className={`retro-cursor-ring${expanded ? " expanded" : ""}`} />
    </div>
  );
}
