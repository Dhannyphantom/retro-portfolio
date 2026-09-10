"use client";
import { useEffect, useState } from "react";

export const ACHIEVEMENTS: Record<string, { title: string; desc: string; icon: string }> = {
  BOOT: { title: "SYSTEM ONLINE", desc: "Boot sequence complete", icon: "■" },
  TERMINAL: { title: "TERMINAL WIZARD", desc: "Executed a shell command", icon: ">" },
  KONAMI: { title: "CHEAT CODE ACTIVE", desc: "↑↑↓↓←→←→BA", icon: "★" },
  GAMER: { title: "PLAYER ONE", desc: "Launched a game", icon: "▶" },
  EXPLORER: { title: "ALL SECTORS CLEAR", desc: "Visited every section", icon: "◉" },
  STALKER: { title: "STARING CONTEST", desc: "Hovered the avatar 5× times", icon: "◎" },
  CONTACT: { title: "SIGNAL ACQUIRED", desc: "Reached out", icon: "◈" },
  GLITCH: { title: "GHOST IN MACHINE", desc: "Triggered the glitch effect", icon: "▒" },
  LIGHT_MODE: { title: "PHOTOSENSITIVE", desc: "Switched to light mode", icon: "☀" },
  NIGHT_OWL: { title: "NIGHT OWL", desc: "Visited after midnight", icon: "●" },
};
export type AchievementId = keyof typeof ACHIEVEMENTS;

export function AchievementToast({ id, onDone }: { id: AchievementId; onDone: () => void }) {
  const a = ACHIEVEMENTS[id];
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 3200);
    const t2 = setTimeout(onDone, 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div className={leaving ? "retro-toast-out" : "retro-toast-in"} style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontFamily: "var(--font-retro-pixel)", fontSize: 18, color: "var(--g)" }}>{a.icon}</span>
      <div>
        <div style={{ fontFamily: "var(--font-retro-pixel)", fontSize: 7, color: "var(--text)", marginBottom: 4, letterSpacing: "0.1em" }}>
          ACHIEVEMENT UNLOCKED
        </div>
        <div style={{ fontFamily: "var(--font-retro-pixel)", fontSize: 8, color: "var(--g)" }}>{a.title}</div>
        <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", marginTop: 2 }}>{a.desc}</div>
      </div>
    </div>
  );
}
