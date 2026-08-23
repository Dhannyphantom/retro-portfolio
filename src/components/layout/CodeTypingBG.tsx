"use client";
import { useEffect, useState } from "react";

const SNIPPETS = [
  ["const app = createApp();", "function build(idea) {", "  return ship(idea);", "}"],
  ["await deploy('production');", "// building something new...", "status: online"],
  ["router.get('/api/quiz', handler);", "db.connect(MONGO_URI);", "export default Server;"],
  ["npm run build", "✓ compiled successfully", "watching for changes..."],
  ["const [state, setState] = useState();", "useEffect(() => { sync(); });", "return <App />;"],
];

function CodeColumn({ lines, className = "", style = {} }: { lines: string[]; className?: string; style?: React.CSSProperties }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = lines[lineIdx];
    const speed = deleting ? 26 : 46 + Math.random() * 24;
    const t = setTimeout(() => {
      if (!deleting) {
        if (text.length < full.length) setText(full.slice(0, text.length + 1));
        else setTimeout(() => setDeleting(true), 1100);
      } else if (text.length > 0) {
        setText(full.slice(0, text.length - 1));
      } else {
        setDeleting(false);
        setLineIdx((li) => (li + 1) % lines.length);
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, lineIdx, lines]);

  return (
    <div
      className={`absolute font-mono text-[12.5px] leading-[1.9] whitespace-nowrap select-none ${className}`}
      style={{ color: "rgba(180,92,255,0.55)", ...style }}
    >
      {lines.slice(0, lineIdx).map((l, i) => <div key={i}>{l}</div>)}
      <div>{text}<span className="blink-cursor">▍</span></div>
    </div>
  );
}

export default function CodeTypingBG() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ opacity: 0.18 }}>
      <CodeColumn lines={SNIPPETS[0]} style={{ top: "8%", left: "5%" }} />
      <CodeColumn lines={SNIPPETS[1]} className="hide-sm" style={{ top: "6%", right: "5%" }} />
      <CodeColumn lines={SNIPPETS[2]} className="hide-sm" style={{ top: "44%", left: "3%" }} />
      <CodeColumn lines={SNIPPETS[3]} style={{ top: "46%", right: "4%" }} />
      <CodeColumn lines={SNIPPETS[4]} className="hide-sm" style={{ bottom: "6%", left: "6%" }} />
    </div>
  );
}
