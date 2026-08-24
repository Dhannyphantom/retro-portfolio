"use client";
import { useEffect, useRef } from "react";

const CHARS = "01{}[]()<>/;=+-*ABCDEFGHIJKLMNOPQRSTUVWXYZ$#";

// A full-viewport, always-visible matrix-style code rain — kept intentionally
// faint (low opacity + a slow trail fade) so it reads as backdrop texture
// rather than competing with real content. Respects prefers-reduced-motion.
export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const fontSize = 15;
    let columns = 0;
    let drops: number[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -100);
    };
    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) {
      // Draw a single faint static frame instead of looping.
      ctx.fillStyle = "#0A090C";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px var(--font-mono, monospace)`;
      ctx.fillStyle = "rgba(180,92,255,0.238)";
      drops.forEach((d, i) => {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(ch, i * fontSize, (d < 0 ? 4 : d) * fontSize);
      });
      return () => window.removeEventListener("resize", resize);
    }

    let raf: number;
    let last = 0;
    const frameInterval = 60; // ms between steps — classic matrix cadence

    const draw = (ts: number) => {
      raf = requestAnimationFrame(draw);
      if (ts - last < frameInterval) return;
      last = ts;

      // translucent fill creates the fading-trail effect
      ctx.fillStyle = "rgba(7,5,11,0.09)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px var(--font-mono, monospace)`;
      for (let i = 0; i < drops.length; i++) {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        const y = drops[i] * fontSize;
        // leading character brighter, rest of trail dimmer
        ctx.fillStyle = "rgba(196,150,255,0.85)";
        ctx.fillText(ch, i * fontSize, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.16 }}
      aria-hidden="true"
    />
  );
}
