"use client";
import { useEffect, useRef, useState } from "react";

function buildLines(name: string) {
  return [
    "DANIEL_OS v1.0.0",
    "INITIALIZING SYSTEM...",
    "",
    "LOADING MODULES:",
    "  [OK] REACT_NATIVE.DLL",
    "  [OK] NEXT_JS.DLL",
    "  [OK] NODE.DLL",
    "  [OK] MONGODB.DLL",
    "",
    "MOUNTING /home/portfolio ...",
    `VERIFYING CREDENTIALS: ${name.toUpperCase()}`,
    "",
    "[||||||||||||||||||||] 100%",
    "",
    "ACCESS GRANTED.",
    "WELCOME.",
  ];
}

// A skippable DOS-style boot sequence, shown once per browser session (not
// on every page navigation). Respects prefers-reduced-motion by skipping
// straight to the site.
export default function BootScreen({ name = "Daniel Olojo" }: { name?: string }) {
  const [text, setText] = useState("");
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem("boot-seen")) {
      setHidden(true);
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      finish();
      return;
    }

    const lines = buildLines(name);
    let li = 0;
    let ci = 0;
    let acc = "";
    let timeoutId: ReturnType<typeof setTimeout>;

    const typeNext = () => {
      if (li >= lines.length) {
        timeoutId = setTimeout(finish, 700);
        return;
      }
      const line = lines[li];
      if (ci <= line.length) {
        setText(acc + line.slice(0, ci));
        ci++;
        timeoutId = setTimeout(typeNext, line.length ? 14 : 60);
      } else {
        acc += line + "\n";
        li++;
        ci = 0;
        timeoutId = setTimeout(typeNext, 40);
      }
    };
    timeoutId = setTimeout(typeNext, 200);

    function finish() {
      if (finishedRef.current) return;
      finishedRef.current = true;
      sessionStorage.setItem("boot-seen", "1");
      setHidden(true);
    }

    window.addEventListener("keydown", finish);
    window.addEventListener("click", finish, { once: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("keydown", finish);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted || hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col justify-end p-8 whitespace-pre-wrap"
      style={{ background: "#000", color: "#39FF14", fontFamily: "var(--font-mono, monospace)", fontSize: 14, cursor: "pointer", transition: "opacity 0.6s ease" }}
    >
      <div>{text}</div>
      <div className="absolute bottom-6 right-8 text-xs opacity-60 animate-termBlink">click / press any key to skip</div>
    </div>
  );
}
