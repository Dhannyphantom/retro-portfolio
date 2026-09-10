"use client";
import { useEffect, useRef } from "react";

export default function RetroMatrixRain({ light = false }: { light?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const FONT_SIZE = 14;
    const CHARS =
      "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ01ABCDEF<>/\\|{}[]".split("");

    let cols = Math.floor(canvas.width / FONT_SIZE);
    let drops: number[] = Array(cols).fill(1);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tick = () => {
      cols = Math.floor(canvas.width / FONT_SIZE);
      while (drops.length < cols) drops.push(Math.random() * -100);
      while (drops.length > cols) drops.pop();

      ctx.fillStyle = light ? "rgba(240,236,224,0.05)" : "rgba(8,8,8,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = light ? "rgba(20,80,20,0.85)" : "rgba(57,255,20,0.85)";
      ctx.font = `${FONT_SIZE}px 'Space Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);
        if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    if (reduceMotion) {
      ctx.fillStyle = light ? "#F0ECE0" : "#080808";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return () => window.removeEventListener("resize", resize);
    }

    const id = setInterval(tick, 50);
    return () => {
      clearInterval(id);
      window.removeEventListener("resize", resize);
    };
  }, [light]);

  return <canvas ref={canvasRef} className="retro-matrix-canvas" aria-hidden="true" />;
}
