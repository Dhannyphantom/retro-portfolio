"use client";
import { useEffect, useState } from "react";

const SYMBOLS = ["01", "{}", "[]", "</>", "$_", "&&", "==", "#!"];

function shuffled(): { id: number; sym: string }[] {
  const pairs = [...SYMBOLS, ...SYMBOLS].map((sym, i) => ({ id: i, sym }));
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs;
}

export default function MemoryMatch({ onWin }: { onWin: () => void }) {
  const [cards, setCards] = useState(shuffled);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const won = matched.length === cards.length;

  useEffect(() => {
    if (won) onWin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won]);

  useEffect(() => {
    if (flipped.length !== 2) return;
    setMoves((m) => m + 1);
    const [a, b] = flipped;
    if (cards[a].sym === cards[b].sym) {
      setMatched((m) => [...m, a, b]);
      setFlipped([]);
    } else {
      const t = setTimeout(() => setFlipped([]), 650);
      return () => clearTimeout(t);
    }
  }, [flipped, cards]);

  const flip = (i: number) => {
    if (flipped.length === 2 || flipped.includes(i) || matched.includes(i)) return;
    setFlipped((f) => [...f, i]);
  };

  const reset = () => {
    setCards(shuffled());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  return (
    <div className="flex flex-col items-center gap-4" data-no-burst>
      <div className="font-mono text-[11px] text-mute">MOVES: {moves}{won ? " — SOLVED! 🎉" : ""}</div>
      <div className="grid grid-cols-4 gap-1.5">
        {cards.map((c, i) => {
          const isUp = flipped.includes(i) || matched.includes(i);
          return (
            <button
              key={c.id}
              onClick={() => flip(i)}
              data-cursor-hover
              className="w-14 h-14 flex items-center justify-center font-mono text-[13px] border-2"
              style={{
                borderColor: matched.includes(i) ? "var(--green)" : "var(--border-strong)",
                background: isUp ? "var(--panel)" : "var(--panel-alt)",
                color: "var(--green)",
              }}
            >
              {isUp ? c.sym : "?"}
            </button>
          );
        })}
      </div>
      <button onClick={reset} data-cursor-hover className="retro-btn px-4 py-1.5 font-mono text-[11px]">
        RESTART
      </button>
    </div>
  );
}
