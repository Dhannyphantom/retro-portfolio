"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export type Achievement = {
  id: string;
  title: string;
  desc: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_contact", title: "First Contact", desc: "Ran your first terminal command" },
  { id: "curious_clicker", title: "Curious Clicker", desc: "Clicked WEBCAM.EXE five times" },
  { id: "konami", title: "Cheat Code", desc: "Entered the Konami code" },
  { id: "game_over", title: "High Score", desc: "Won a game in the arcade" },
  { id: "theme_shift", title: "Night & Day", desc: "Switched between light and dark mode" },
  { id: "glitch_in_matrix", title: "Glitch In The Matrix", desc: "Found the hidden `matrix` command" },
  { id: "completionist", title: "Completionist", desc: "Unlocked every other achievement" },
];

const STORAGE_KEY = "achievements-unlocked";

type Ctx = {
  unlocked: Record<string, boolean>;
  unlock: (id: string) => void;
  toasts: Achievement[];
  gamesOpen: boolean;
  openGames: () => void;
  closeGames: () => void;
};

const AchievementsContext = createContext<Ctx | null>(null);

export function AchievementsProvider({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<Record<string, boolean>>({});
  const [toasts, setToasts] = useState<Achievement[]>([]);
  const [gamesOpen, setGamesOpen] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUnlocked(JSON.parse(raw));
    } catch {}
    hydrated.current = true;
  }, []);

  const unlock = useCallback((id: string) => {
    setUnlocked((prev) => {
      if (prev[id]) return prev;
      const next = { ...prev, [id]: true };

      // Auto-award "completionist" once every other achievement is in.
      const others = ACHIEVEMENTS.filter((a) => a.id !== "completionist");
      const allOthersDone = others.every((a) => next[a.id]);
      if (allOthersDone && !next.completionist) next.completionist = true;

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}

      const newlyUnlocked = Object.keys(next).filter((k) => !prev[k]);
      const toAnnounce = ACHIEVEMENTS.filter((a) => newlyUnlocked.includes(a.id));
      if (toAnnounce.length) {
        setToasts((t) => [...t, ...toAnnounce]);
        toAnnounce.forEach((a) => {
          setTimeout(() => {
            setToasts((t) => t.filter((x) => x.id !== a.id));
          }, 4200);
        });
      }
      return next;
    });
  }, []);

  const openGames = useCallback(() => setGamesOpen(true), []);
  const closeGames = useCallback(() => setGamesOpen(false), []);

  return (
    <AchievementsContext.Provider value={{ unlocked, unlock, toasts, gamesOpen, openGames, closeGames }}>
      {children}
    </AchievementsContext.Provider>
  );
}

export function useAchievements() {
  const ctx = useContext(AchievementsContext);
  if (!ctx) throw new Error("useAchievements must be used within AchievementsProvider");
  return ctx;
}
