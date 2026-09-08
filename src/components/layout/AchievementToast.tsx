"use client";
import { Trophy } from "lucide-react";
import { useAchievements } from "@/lib/achievements";

export default function AchievementToastHost() {
  const { toasts } = useAchievements();
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[10005] flex flex-col gap-2 pointer-events-none">
      {toasts.map((a, i) => (
        <div
          key={a.id + i}
          className="achievement-toast win flex items-center gap-3 px-3.5 py-2.5 max-w-[280px]"
          style={{ borderColor: "var(--amber)" }}
        >
          <Trophy size={20} style={{ color: "var(--amber)" }} className="flex-shrink-0" />
          <div>
            <div className="font-mono text-[9.5px] tracking-widest text-mute">ACHIEVEMENT UNLOCKED</div>
            <div className="font-display text-[11px] leading-relaxed mt-0.5">{a.title}</div>
            <div className="font-mono text-[10.5px] text-mute mt-0.5">{a.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
