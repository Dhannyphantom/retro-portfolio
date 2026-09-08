"use client";
import { useEffect, useRef } from "react";

const COLORS = ["#39FF14", "#00E5FF", "#FF2D95", "#FFB400", "#ECECEC"];
const BURST_COUNT = 10;

export default function ClickEffects() {
  const trailThrottle = useRef(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const spawnBurst = (x: number, y: number) => {
      for (let i = 0; i < BURST_COUNT; i++) {
        const el = document.createElement("div");
        el.className = "pixel-burst-particle";
        const angle = (Math.PI * 2 * i) / BURST_COUNT + Math.random() * 0.4;
        const dist = 26 + Math.random() * 34;
        el.style.setProperty("--dx0", "0px");
        el.style.setProperty("--dy0", "0px");
        el.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
        el.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
        el.style.background = COLORS[i % COLORS.length];
        el.style.transform = `translate(${x}px, ${y}px)`;
        el.style.left = "0px";
        el.style.top = "0px";
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 600);
      }
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Skip inside game canvases/inputs so bursts don't spam during play.
      if (target.closest("[data-no-burst]")) return;
      spawnBurst(e.clientX, e.clientY);
    };

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - trailThrottle.current < 45) return;
      trailThrottle.current = now;
      const el = document.createElement("div");
      el.className = "cursor-trail-dot";
      el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 420);
    };

    window.addEventListener("click", onClick);
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return null;
}
