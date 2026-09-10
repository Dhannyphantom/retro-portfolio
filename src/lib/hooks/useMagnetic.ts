"use client";
import { useRef, useCallback } from "react";

// Heavy "magnetic" hover used across the retro UI's buttons/nav pills — the
// element physically translates toward the cursor within its own box. Ported
// 1:1 from the reference Retro Portfolio UI (src/hooks/useMagnetic.ts).
export function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLElement>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    el.style.transform = `translate(${dx}px, ${dy}px) scale(1.05)`;
  }, [strength]);

  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "";
  }, []);

  return { ref, onMove, onLeave };
}
