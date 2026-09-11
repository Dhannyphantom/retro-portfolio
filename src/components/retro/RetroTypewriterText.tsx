"use client";
import { useTypewriterLoop } from "@/lib/hooks/useTypewriterLoop";

// Old-school retro typewriter: cycles through `texts` one at a time, typing
// each one out, holding it, deleting it, then moving to the next — on
// repeat, forever. A blinking block cursor follows the typed text, same
// style as the rest of the terminal UI.
export default function RetroTypewriterText({
  texts,
  className = "",
  style = {},
}: {
  texts: string[];
  className?: string;
  style?: React.CSSProperties;
}) {
  const display = useTypewriterLoop(texts);
  return (
    <span className={className} style={style}>
      {display}
      <span className="animate-termBlink">█</span>
    </span>
  );
}
