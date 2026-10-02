"use client";
import { useEffect, useState } from "react";
import SnakeGame from "@/components/games/SnakeGame";
import TicTacToe from "@/components/games/TicTacToe";
import MemoryMatch from "@/components/games/MemoryMatch";

const TABS = [
  { id: "snake", label: "SNAKE.EXE" },
  { id: "ttt", label: "TICTACTOE.EXE" },
  { id: "memory", label: "MEMORY.EXE" },
] as const;

// Arcade popup opened from the terminal's `games` command. Closes on the
// backdrop, the × button, or Escape.
export default function RetroGamesModal({ onClose, onWin }: { onClose: () => void; onWin: () => void }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("snake");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 10001, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.82)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 440, background: "var(--bg)", border: "1px solid var(--border)", maxHeight: "92vh", overflowY: "auto" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", background: "var(--window-bar)", borderBottom: "1px solid var(--border)" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
          <span style={{ flex: 1, textAlign: "center", fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.08em" }}>
            ARCADE.EXE — {TABS.find((t) => t.id === tab)!.label}
          </span>
          <button
            onClick={onClose}
            data-cursor-hover
            aria-label="Close games"
            style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-dim)", width: 20, height: 20, lineHeight: 1, cursor: "none", fontFamily: "var(--font-retro-body)", fontSize: 12 }}
          >
            ×
          </button>
        </div>
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              data-cursor-hover
              style={{
                flex: 1, padding: "10px", fontFamily: "var(--font-retro-body)", fontSize: 10, letterSpacing: "0.08em",
                background: tab === t.id ? "var(--white)" : "transparent",
                color: tab === t.id ? "var(--bg)" : "var(--text-dim)",
                border: "none", borderRight: "1px solid var(--border)", cursor: "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
          {tab === "snake" && <SnakeGame onWin={onWin} />}
          {tab === "ttt" && <TicTacToe onWin={onWin} />}
          {tab === "memory" && <MemoryMatch onWin={onWin} />}
        </div>
        <div style={{ borderTop: "1px solid var(--border)", padding: "6px 14px", fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)" }}>
          // esc to close
        </div>
      </div>
    </div>
  );
}
