"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const GRID = 16;
const CELL = 16;
const START = [{ x: 8, y: 8 }];

type Pt = { x: number; y: number };

function randomFood(snake: Pt[]): Pt {
  let p: Pt;
  do {
    p = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
}

export default function SnakeGame({ onWin }: { onWin: () => void }) {
  const [snake, setSnake] = useState<Pt[]>(START);
  // Food starts as `null` and is only randomized after mount (in a
  // useEffect, client-side only). Previously this used
  // `useState(() => randomFood(START))`, which calls Math.random() during
  // the initial render — that render happens once on the server and again
  // on the client during hydration, producing two different positions and
  // triggering a hydration mismatch warning. Waiting until after mount
  // sidesteps that entirely.
  const [food, setFood] = useState<Pt | null>(null);
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [dead, setDead] = useState(false);
  const [started, setStarted] = useState(false);
  const [best, setBest] = useState(0);
  // Set (never called directly) whenever the win condition is met inside
  // the game-tick updater below, and consumed by the effect further down.
  const [justWon, setJustWon] = useState(false);
  const dirRef = useRef(dir);
  const wonRef = useRef(false);
  dirRef.current = dir;

  const score = snake.length - 1;

  useEffect(() => {
    setFood(randomFood(START));
  }, []);

  // IMPORTANT: `onWin` ultimately calls a state setter that lives several
  // components up the tree (RetroHome's achievement/toast state). Calling
  // it directly from inside setSnake's updater (even via a nested
  // setTimeout) risks React flagging "Cannot update a component while
  // rendering a different component", because the call can still land
  // inside another component's render/commit cycle depending on timing.
  // Firing it from this dedicated effect — reacting to a plain local
  // boolean flag — is the pattern React actually guarantees is safe for
  // notifying a parent from a child.
  useEffect(() => {
    if (!justWon) return;
    onWin();
    setJustWon(false);
  }, [justWon, onWin]);

  const reset = useCallback(() => {
    setSnake(START);
    setFood(randomFood(START));
    setDir({ x: 1, y: 0 });
    setDead(false);
    setStarted(true);
    wonRef.current = false;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Pt> = {
        ArrowUp: { x: 0, y: -1 },
        w: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        s: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        a: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        d: { x: 1, y: 0 },
      };
      const next = map[e.key];
      if (!next) return;
      e.preventDefault();
      if (!started) {
        setStarted(true);
      }
      // Disallow reversing directly into yourself.
      if (next.x === -dirRef.current.x && next.y === -dirRef.current.y) return;
      setDir(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started]);

  useEffect(() => {
    if (!started || dead || !food) return;
    const speed = Math.max(70, 140 - score * 4);
    const id = setInterval(() => {
      setSnake((prev) => {
        const head = {
          x: prev[0].x + dirRef.current.x,
          y: prev[0].y + dirRef.current.y,
        };
        const hitWall =
          head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID;
        const hitSelf = prev.some((s) => s.x === head.x && s.y === head.y);

        if (hitWall || hitSelf) {
          const finalLength = prev.length;
          // Still deferred with setTimeout(..., 0) so this state updater
          // stays a pure function of `prev` — but the win notification
          // itself now only ever sets local state (`justWon`), never calls
          // `onWin` directly. See the dedicated effect above.
          setTimeout(() => {
            setDead(true);
            setBest((b) => Math.max(b, finalLength - 1));
            if (finalLength - 1 >= 3 && !wonRef.current) {
              wonRef.current = true;
              setJustWon(true);
            }
          }, 0);
          return prev;
        }

        const ate = head.x === food.x && head.y === food.y;
        const nextSnake = [head, ...prev];
        if (ate) {
          const newFood = randomFood(nextSnake);
          setTimeout(() => {
            setFood(newFood);
            if (nextSnake.length - 1 >= 3 && !wonRef.current) {
              wonRef.current = true;
              setJustWon(true);
            }
          }, 0);
        } else {
          nextSnake.pop();
        }
        return nextSnake;
      });
    }, speed);
    return () => clearInterval(id);
  }, [started, dead, food, score]);

  return (
    <div className="flex flex-col items-center gap-3" data-no-burst>
      <div className="font-mono text-[11px] text-mute">
        SCORE: {score} — BEST: {best}
      </div>
      <div
        className="relative border-2"
        style={{
          borderColor: "var(--border-strong)",
          width: GRID * CELL,
          height: GRID * CELL,
          background: "var(--panel-alt)",
        }}
      >
        {snake.map((s, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: s.x * CELL,
              top: s.y * CELL,
              width: CELL - 1,
              height: CELL - 1,
              background: i === 0 ? "var(--green)" : "var(--cyan)",
            }}
          />
        ))}
        {food && (
          <div
            className="absolute"
            style={{
              left: food.x * CELL,
              top: food.y * CELL,
              width: CELL - 1,
              height: CELL - 1,
              background: "var(--magenta)",
            }}
          />
        )}
        {!started && !dead && (
          <div
            className="absolute inset-0 flex items-center justify-center font-mono text-[11px] text-center px-3"
            style={{ background: "rgba(0,0,0,0.6)", color: "var(--text)" }}
          >
            Press an arrow key to start
          </div>
        )}
        {dead && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 font-mono text-[11px]"
            style={{ background: "rgba(0,0,0,0.72)", color: "var(--text)" }}
          >
            <div>GAME OVER</div>
            <button
              onClick={reset}
              data-cursor-hover
              className="retro-btn px-3 py-1 text-[10px]"
            >
              RETRY
            </button>
          </div>
        )}
      </div>
      <div className="font-mono text-[10px] text-mute">Arrow keys or WASD</div>
    </div>
  );
}
