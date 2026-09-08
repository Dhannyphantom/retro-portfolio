"use client";
import { useEffect, useRef } from "react";
import { useAchievements } from "@/lib/achievements";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

export default function EasterEggs() {
  const { unlock, openGames } = useAchievements();
  const progress = useRef(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore while typing into an input/textarea/terminal so normal
      // typing (including "b" and "a") doesn't accidentally trigger it —
      // except arrow keys still count everywhere.
      const target = e.target as HTMLElement;
      const typing = target && ["INPUT", "TEXTAREA"].includes(target.tagName);
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

      if (typing && !key.startsWith("Arrow")) {
        progress.current = 0;
        return;
      }

      const expected = KONAMI[progress.current];
      if (key === expected) {
        progress.current += 1;
        if (progress.current === KONAMI.length) {
          progress.current = 0;
          unlock("konami");
          openGames();
        }
      } else {
        progress.current = key === KONAMI[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [unlock, openGames]);

  return null;
}
