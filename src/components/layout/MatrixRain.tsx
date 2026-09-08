"use client";
import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme";

const CHARS = "01{}[]()<>/;=+-*ABCDEFGHIJKLMNOPQRSTUVWXYZ$#";

// Real color values (not CSS vars — canvas 2D can't read those) mirroring
// globals.css's --matrix-bg/--matrix-fg/--void per theme. Pure black & white
// in both themes — dark mode rains white/gray glyphs down a black void,
// light mode rains black/charcoal glyphs down the paper-colored void — so
// it reads as a monochrome CRT rain rather than the classic green Matrix
// look, and never fights the site's cyan/green accent tints.
const PALETTE = {
  dark: {
    void: "#000000",
    trailFill: "rgba(0,0,0,0.09)",
    glyphHead: "rgba(255,255,255,0.9)",
  },
  light: {
    void: "#F2F1EC",
    trailFill: "rgba(242,241,236,0.14)",
    glyphHead: "rgba(18,18,18,0.65)",
  },
};

// A full-viewport, always-visible matrix-style code rain — kept intentionally
// faint (low opacity + a slow trail fade) so it reads as backdrop texture
// rather than competing with real content. Respects prefers-reduced-motion.
export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const paletteRef = useRef(PALETTE[theme]);
  paletteRef.current = PALETTE[theme];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

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
      ctx.fillStyle = paletteRef.current.void;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px var(--font-mono, monospace)`;
      // Force true grayscale on every draw. Belt-and-suspenders: some
      // browsers subpixel-antialias small monospace glyphs with a faint
      // red/blue fringe, which — stacked hundreds of times a second at low
      // canvas opacity — can average out to a visible color cast even
      // though every fillStyle here is neutral gray. This guarantees the
      // rendered pixels stay black/white/gray regardless of that.
      ctx.filter = "grayscale(1)";
      ctx.fillStyle = paletteRef.current.glyphHead;
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
      ctx.fillStyle = paletteRef.current.trailFill;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px var(--font-mono, monospace)`;
      ctx.filter = "grayscale(1)";
      for (let i = 0; i < drops.length; i++) {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        const y = drops[i] * fontSize;
        // Every glyph is drawn fresh in the same bright "head" color each
        // frame; the translucent trailFill overlay painted just above is
        // what ages already-drawn glyphs into a fading tail over time —
        // no separate dim color needed, same technique as the original.
        ctx.fillStyle = paletteRef.current.glyphHead;
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
