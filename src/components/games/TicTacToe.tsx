"use client";
import { useState } from "react";

type Cell = "X" | "O" | null;
const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function winnerOf(board: Cell[]): Cell {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

// Picks a winning move if one exists, blocks the player's winning move if
// one exists, otherwise takes the center, a corner, or whatever's free —
// good enough to feel like a real opponent without a full minimax tree.
function pickAiMove(board: Cell[]): number {
  const empty = board.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
  for (const i of empty) {
    const copy = [...board];
    copy[i] = "O";
    if (winnerOf(copy) === "O") return i;
  }
  for (const i of empty) {
    const copy = [...board];
    copy[i] = "X";
    if (winnerOf(copy) === "X") return i;
  }
  if (board[4] === null) return 4;
  const corners = [0, 2, 6, 8].filter((i) => board[i] === null);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  return empty[Math.floor(Math.random() * empty.length)];
}

export default function TicTacToe({ onWin }: { onWin: () => void }) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [score, setScore] = useState({ win: 0, lose: 0, draw: 0 });
  const winner = winnerOf(board);
  const isDraw = !winner && board.every((c) => c !== null);

  const play = (i: number) => {
    if (board[i] || winner || turn !== "X") return;
    const next = [...board];
    next[i] = "X";
    setBoard(next);

    const w = winnerOf(next);
    if (w || next.every((c) => c !== null)) {
      finish(w, next);
      return;
    }
    setTurn("O");
    setTimeout(() => {
      const aiMove = pickAiMove(next);
      const afterAi = [...next];
      afterAi[aiMove] = "O";
      setBoard(afterAi);
      const w2 = winnerOf(afterAi);
      if (w2 || afterAi.every((c) => c !== null)) finish(w2, afterAi);
      else setTurn("X");
    }, 380);
  };

  const finish = (w: Cell, finalBoard: Cell[]) => {
    setBoard(finalBoard);
    if (w === "X") {
      setScore((s) => ({ ...s, win: s.win + 1 }));
      onWin();
    } else if (w === "O") {
      setScore((s) => ({ ...s, lose: s.lose + 1 }));
    } else {
      setScore((s) => ({ ...s, draw: s.draw + 1 }));
    }
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setTurn("X");
  };

  return (
    <div className="flex flex-col items-center gap-4" data-no-burst>
      <div className="font-mono text-[11px] text-mute">
        YOU (X) {score.win} — CPU (O) {score.lose} — DRAW {score.draw}
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {board.map((c, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            data-cursor-hover
            className="w-16 h-16 flex items-center justify-center font-display text-xl border-2"
            style={{
              borderColor: "var(--border-strong)",
              background: "var(--panel-alt)",
              color: c === "X" ? "var(--green)" : c === "O" ? "var(--magenta)" : "var(--text-dim)",
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="font-mono text-[12px] h-5">
        {winner ? (winner === "X" ? "You win! 🎉" : "CPU wins.") : isDraw ? "Draw." : `Turn: ${turn === "X" ? "you" : "cpu"}`}
      </div>
      <button onClick={reset} data-cursor-hover className="retro-btn px-4 py-1.5 font-mono text-[11px]">
        RESTART
      </button>
    </div>
  );
}
