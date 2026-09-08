"use client";
import { useState } from "react";
import { useAchievements } from "@/lib/achievements";
import SnakeGame from "./SnakeGame";
import TicTacToe from "./TicTacToe";
import MemoryMatch from "./MemoryMatch";

const TABS = [
  { id: "snake", label: "SNAKE.EXE" },
  { id: "ttt", label: "TICTACTOE.EXE" },
  { id: "memory", label: "MEMORY.EXE" },
] as const;

export default function GamesPanel() {
  const { gamesOpen, closeGames, unlock } = useAchievements();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("snake");

  if (!gamesOpen) return null;
  const handleWin = () => unlock("game_over");

  return (
    <div
      className="fixed inset-0 z-[10004] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={closeGames}
    >
      <div onClick={(e) => e.stopPropagation()} className="win modal-pop w-full max-w-[420px]">
        <div className="win-bar">
          <span className="win-title">ARCADE.EXE — retro games</span>
          <span className="win-controls">
            <span className="win-dot" data-cursor-hover onClick={closeGames}>×</span>
          </span>
        </div>
        <div className="flex border-b-2" style={{ borderColor: "var(--border-strong)" }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              data-cursor-hover
              className="flex-1 py-2 font-mono text-[10.5px] border-r-2 last:border-r-0"
              style={{
                borderColor: "var(--border-strong)",
                background: tab === t.id ? "var(--panel-alt)" : "transparent",
                color: tab === t.id ? "var(--green)" : "var(--text-dim)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="p-5 flex justify-center">
          {tab === "snake" && <SnakeGame onWin={handleWin} />}
          {tab === "ttt" && <TicTacToe onWin={handleWin} />}
          {tab === "memory" && <MemoryMatch onWin={handleWin} />}
        </div>
      </div>
    </div>
  );
}
