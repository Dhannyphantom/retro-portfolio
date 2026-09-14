"use client";
import { useEffect, useRef, useState } from "react";
import { useAchievements, ACHIEVEMENTS } from "@/lib/achievements";
import { useTheme } from "@/lib/theme";

type Line = { text: string; kind?: "cmd" | "out" | "err" };

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "There are 10 kinds of people: those who understand binary, and those who don't.",
  "I told my code a joke. No reaction — it doesn't have a sense of humor(), only functions.",
];

// Visually-hidden but fully focusable/typeable — the standard a11y
// "screen-reader-only" pattern, repurposed here to give us a real <input>
// (so keystrokes, IME composition, and mobile virtual keyboards all work
// exactly like a normal text field) without ever showing a boxy input UI.
// The terminal draws its own prompt + typed text + blinking block cursor
// as the last line of the scrollback instead.
const hiddenInputStyle: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  border: 0,
  background: "transparent",
};

export default function Terminal({
  name = "Daniel",
  bio,
}: {
  name?: string;
  bio?: string;
}) {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const { unlock, openGames, unlocked } = useAchievements();
  const { toggleTheme } = useTheme();
  const [history, setHistory] = useState<Line[]>([
    { text: `Welcome to ${slug}'s terminal. Type 'help' to get started.`, kind: "out" },
  ]);
  const [input, setInput] = useState("");
  const [cmdLog, setCmdLog] = useState<string[]>([]);
  const [logIdx, setLogIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const firstRun = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [history, input]);

  const print = (text: string, kind: Line["kind"] = "out") => setHistory((h) => [...h, { text, kind }]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    print(`~/${slug} $ ${cmd}`, "cmd");
    setCmdLog((l) => [...l, cmd]);
    setLogIdx(-1);

    if (!firstRun.current) {
      firstRun.current = true;
      unlock("first_contact");
    }

    const [word, ...rest] = cmd.toLowerCase().split(/\s+/);
    switch (word) {
      case "help":
        print(
          "Commands: about, skills, projects, experience, contact, whoami, ls, cat, sudo, games, achievements, theme, matrix, joke, coffee, date, clear"
        );
        break;
      case "about":
        print(
          bio ||
            `${name} is a software developer building React Native/Expo mobile apps, Next.js web platforms, and Node.js/Express backends — the kind of software meant to hold up once real people start using it.`
        );
        break;
      case "skills":
        print("React Native · Expo · Next.js · TypeScript · Node.js · Express · MongoDB · full-stack product builds.");
        break;
      case "projects":
        print("Run `open projects` in your mind, or just click PROJECTS in the nav above — a few live builds are waiting there.");
        break;
      case "experience":
        print("Scroll down to the EXPERIENCE section for the full timeline.");
        break;
      case "contact":
        print("Head to the CONTACT section below, or hit [CLIENT] in the nav to start a project.");
        break;
      case "whoami":
        print(`guest@${slug} — just visiting, but welcome anyway.`);
        break;
      case "ls":
        print("about.txt  skills.txt  projects/  experience.txt  contact.txt  secrets/");
        break;
      case "cat":
        if (rest.join(" ") === "resume.txt" || rest.join(" ") === "secrets/resume.txt") {
          print(`${name} — Software Developer. Full resume: see the CV page ([My resume] button up top).`);
        } else if (rest.length) {
          print(`cat: ${rest.join(" ")}: No such file`, "err");
        } else {
          print("usage: cat <file>", "err");
        }
        break;
      case "sudo":
        print("Nice try. Permission denied: you are not root here. 😄", "err");
        break;
      case "games":
        print("Launching ARCADE.EXE...");
        openGames();
        break;
      case "achievements": {
        const count = Object.keys(unlocked).length;
        print(`${count}/${ACHIEVEMENTS.length} unlocked.`);
        ACHIEVEMENTS.forEach((a) => print(`  [${unlocked[a.id] ? "x" : " "}] ${a.title}`));
        break;
      }
      case "theme":
        toggleTheme();
        unlock("theme_shift");
        print("Theme toggled.");
        break;
      case "matrix":
        print("Wake up... you found a hidden command. The matrix rain behind this page is real, by the way.");
        unlock("glitch_in_matrix");
        break;
      case "konami":
        print("A cheat code lives on this very page. Old-school controllers only. ↑ ↑ ↓ ↓ ← → ← → B A");
        break;
      case "coffee":
        print("☕ ( ( ( — brewing... you now owe this terminal a coffee.");
        break;
      case "joke":
        print(JOKES[Math.floor(Math.random() * JOKES.length)]);
        break;
      case "date":
        print(new Date().toString());
        break;
      case "clear":
        setHistory([]);
        return;
      default:
        print(`command not found: ${word} — type 'help'`, "err");
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!cmdLog.length) return;
      const idx = logIdx < 0 ? cmdLog.length - 1 : Math.max(0, logIdx - 1);
      setLogIdx(idx);
      setInput(cmdLog[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (logIdx < 0) return;
      const idx = logIdx + 1;
      if (idx >= cmdLog.length) {
        setLogIdx(-1);
        setInput("");
      } else {
        setLogIdx(idx);
        setInput(cmdLog[idx]);
      }
    }
  };

  return (
    <div className="win">
      <div className="win-bar">
        <span className="win-title">TERMINAL — ~/{slug}</span>
        <span className="win-controls">
          <span className="win-dot">▢</span>
          <span className="win-dot">×</span>
        </span>
      </div>
      <div
        ref={scrollRef}
        className="terminal-scroll font-mono text-[12px] leading-relaxed p-3.5 h-[220px] overflow-y-auto"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((l, i) => (
          <div
            key={i}
            style={{
              color: l.kind === "cmd" ? "var(--cyan)" : l.kind === "err" ? "var(--magenta)" : "var(--text-dim)",
              whiteSpace: "pre-wrap",
            }}
          >
            {l.text}
          </div>
        ))}
        <div className="flex items-center flex-wrap gap-1.5 mt-1">
          <span style={{ color: "var(--green)" }}>~/{slug} $</span>
          <span style={{ color: "var(--text)", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{input}</span>
          <span className="terminal-caret" />
        </div>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Terminal input"
          style={hiddenInputStyle}
        />
      </div>
    </div>
  );
}
